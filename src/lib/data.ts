
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc, Timestamp, writeBatch } from "firebase/firestore";
import { db } from './firebase';

// --- Data Types ---

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'End User' | 'Support Agent' | 'Admin';
};

export type Category = {
  id: string;
  name: string;
};

export type Comment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  isAgent: boolean;
};

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  categoryId: string; 
  requesterId: string; 
  assigneeId?: string; 
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  comments?: Comment[]; 
};


// --- Firestore Collections ---

const userCollection = collection(db, 'users');
const categoryCollection = collection(db, 'categories');
const ticketCollection = collection(db, 'tickets');


// --- Helper to enrich documents ---

// Enriches a single document with related data
async function enrichDocument(docData: any, fields: Array<{ fieldName: string, collection: any, targetField: string }>) {
    const enrichedData = { ...docData };
    for (const { fieldName, collection, targetField } of fields) {
        if (docData[fieldName]) {
            const relatedDoc = await getDoc(doc(db, collection, docData[fieldName]));
            if (relatedDoc.exists()) {
                enrichedData[targetField] = { id: relatedDoc.id, ...relatedDoc.data() };
            }
        }
    }
    return enrichedData;
}


// --- User Service ---

export const getUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(userCollection);
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const getUserById = async (id: string): Promise<User | null> => {
    const userDocRef = doc(db, 'users', id);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() } as User;
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const q = query(userCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
};


export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const docRef = await addDoc(userCollection, user);
    return { id: docRef.id, ...user };
};

export const updateUser = async (id: string, user: Partial<Omit<User, 'id'>>): Promise<void> => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, user);
};

export const deleteUser = async (id: string): Promise<void> => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
};


// --- Category Service ---

export const getCategories = async (): Promise<Category[]> => {
    const snapshot = await getDocs(categoryCollection);
    if (snapshot.empty) {
        console.warn("No categories found in Firestore. Please add some to the 'categories' collection or run the seeding script.");
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
    const docRef = await addDoc(categoryCollection, category);
    return { id: docRef.id, ...category };
};

export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id'>>): Promise<void> => {
    const categoryDoc = doc(db, 'categories', id);
    await updateDoc(categoryDoc, category);
};

export const deleteCategory = async (id: string): Promise<void> => {
    const categoryDoc = doc(db, 'categories', id);
    await deleteDoc(categoryDoc);
};


// --- Ticket Service ---

export const getTickets = async (): Promise<any[]> => {
    const snapshot = await getDocs(ticketCollection);
    if (snapshot.empty) return [];

    const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
    
    // In a real high-performance app, you might denormalize this data.
    // For our purposes, enriching the data after the fact is fine.
    const enrichedTickets = await Promise.all(tickets.map(async (ticket) => {
        const enriched: any = { ...ticket };

        if (ticket.requesterId) {
            const requester = await getUserById(ticket.requesterId);
            enriched.requester = requester;
        }
        if (ticket.assigneeId) {
            const assignee = await getUserById(ticket.assigneeId);
            enriched.assignee = assignee;
        }
        if (ticket.categoryId) {
            const categoryDoc = await getDoc(doc(db, 'categories', ticket.categoryId));
            if (categoryDoc.exists()) {
                 enriched.category = { id: categoryDoc.id, ...categoryDoc.data() };
            }
        }
        
         if (ticket.comments && ticket.comments.length > 0) {
            enriched.comments = await Promise.all(ticket.comments.map(async (comment) => {
                const author = await getUserById(comment.authorId);
                return { ...comment, author };
            }));
        }


        return enriched;
    }));

    return enrichedTickets;
};

export const addTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'>): Promise<Ticket> => {
    const now = new Date().toISOString();
    const newTicket = {
        ...ticketData,
        createdAt: now,
        updatedAt: now,
        upvotes: 0,
        downvotes: 0,
    };
    const docRef = await addDoc(ticketCollection, newTicket);
    return { id: docRef.id, ...newTicket };
};

export const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<void> => {
    const ticketDoc = doc(db, 'tickets', id);
    await updateDoc(ticketDoc, {
        ...updates,
        updatedAt: new Date().toISOString()
    });
};

export const addCommentToTicket = async (ticketId: string, commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<void> => {
    const ticketDocRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketDocRef);

    if (!ticketDoc.exists()) {
        throw new Error("Ticket not found");
    }

    const newComment = {
        ...commentData,
        id: new Date().getTime().toString(), // Simple unique ID for the comment
        createdAt: new Date().toISOString(),
    };
    
    const existingComments = ticketDoc.data().comments || [];
    const updatedComments = [...existingComments, newComment];

    await updateDoc(ticketDocRef, {
        comments: updatedComments,
        updatedAt: new Date().toISOString(),
    });
};

export const seedDatabase = async (users: Omit<User, 'id'>[], tickets: Omit<Ticket, 'id'>[], categories: Omit<Category, 'id'>[]) => {
    const batch = writeBatch(db);

    // Seed Users
    users.forEach(user => {
        const docRef = doc(userCollection); // Auto-generate ID
        batch.set(docRef, user);
    });

    // Seed Categories
    categories.forEach(category => {
        const docRef = doc(categoryCollection); // Auto-generate ID
        batch.set(docRef, category);
    });
    
    // Seed Tickets - Note: This requires users and categories to be created first
    // In a real script, you'd get the IDs back before seeding tickets.
    // For this prototype, we'll keep it simple and assume they exist or link later.
    tickets.forEach(ticket => {
        const docRef = doc(ticketCollection); // Auto-generate ID
        batch.set(docRef, ticket);
    });

    await batch.commit();
    console.log("Database seeded successfully!");
};
