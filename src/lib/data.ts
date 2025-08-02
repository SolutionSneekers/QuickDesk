
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
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
  authorId: string; // Store author ID instead of the full object
  content: string;
  createdAt: string;
  isAgent: boolean;
};

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  categoryId: string; // Store category ID
  requesterId: string; // Store requester ID
  assigneeId?: string; // Store assignee ID
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
};


// --- Firestore Collections ---

const userCollection = collection(db, 'users');
const categoryCollection = collection(db, 'categories');
const ticketCollection = collection(db, 'tickets');


// --- User Service ---

export const getUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(userCollection);
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const getUserById = async (id: string): Promise<User | null> => {
    const userDoc = doc(db, 'users', id);
    const snapshot = await getDocs(query(userCollection, where('id', '==', id)));
    if(snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
}

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

// We will implement these functions as we build out the ticket features.
// For now, we will return empty arrays to avoid breaking the UI.

export const getTickets = async (): Promise<any[]> => {
    // In a real app, this would fetch tickets and enrich them with related data.
    // For now, we return an empty array as a placeholder.
    return [];
};
