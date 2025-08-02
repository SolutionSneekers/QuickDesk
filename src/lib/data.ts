
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase'; // Assuming db is exported from your firebase setup

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
  author: User;
  content: string;
  createdAt: string;
  isAgent: boolean;
};

export type Ticket = {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  category: Category;
  requester: User;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
};

// --- Firestore Service for Categories ---

const categoryCollection = collection(db, 'categories');

export const getCategories = async (): Promise<Category[]> => {
    const snapshot = await getDocs(categoryCollection);
    // Make sure you have created the 'categories' collection in your Firestore database
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


// --- Mock Data (to be replaced) ---

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=user-1', role: 'End User' },
  { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=user-2', role: 'End User' },
  { id: 'user-3', name: 'Cindy Smith', email: 'cindy@example.com', avatar: 'https://i.pravatar.cc/150?u=user-3', role: 'End User' },
  { id: 'user-4', name: 'David Miller', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?u=user-4', role: 'End User' },
  { id: 'agent-1', name: 'Charlie Brown', email: 'charlie@quickdesk.com', avatar: 'https://i.pravatar.cc/150?u=agent-1', role: 'Support Agent' },
  { id: 'agent-2', name: 'Diana Prince', email: 'diana@quickdesk.com', avatar: 'https://i.pravatar.cc/150?u=agent-2', role: 'Support Agent' },
  { id: 'admin-1', name: 'Eve Adams', email: 'eve@quickdesk.com', avatar: 'https://i.pravatar.cc/150?u=admin-1', role: 'Admin' },
];

const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Billing' },
  { id: 'cat-2', name: 'Technical Support' },
  { id: 'cat-3', name: 'General Inquiry' },
  { id: 'cat-4', name: 'Feature Request' },
  { id: 'cat-5', name: 'Account Access' },
];

export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    subject: 'Cannot login to my account',
    description: 'I am trying to login with my credentials but it keeps saying "Invalid password". I have tried resetting it multiple times.',
    status: 'In Progress',
    category: mockCategories[4],
    requester: users[0],
    assignee: users[4],
    createdAt: '2024-07-29T10:00:00Z',
    updatedAt: '2024-07-29T11:30:00Z',
    upvotes: 12,
    downvotes: 1,
    comments: [
      { id: 'comment-1', author: users[4], content: 'Hi Alice, I am looking into this issue for you. Can you please confirm the email address you are using to log in?', createdAt: '2024-07-29T10:15:00Z', isAgent: true },
      { id: 'comment-2', author: users[0], content: 'It\'s alice@example.com. Thanks for the quick response!', createdAt: '2024-07-29T10:20:00Z', isAgent: false },
    ],
  },
  {
    id: 'ticket-2',
    subject: 'Question about my recent invoice',
    description: 'I was charged twice for my subscription this month. Can you please look into it and issue a refund?',
    status: 'Open',
    category: mockCategories[0],
    requester: users[1],
    assignee: users[5],
    createdAt: '2024-07-28T14:00:00Z',
    updatedAt: '2024-07-28T14:00:00Z',
    upvotes: 5,
    downvotes: 0,
    comments: [],
  },
  {
    id: 'ticket-3',
    subject: 'Website is loading very slowly',
    description: 'For the past few days, the main dashboard has been extremely slow to load. All other websites are working fine.',
    status: 'Resolved',
    category: mockCategories[1],
    requester: users[2],
    assignee: users[5],
    createdAt: '2024-07-26T09:00:00Z',
    updatedAt: '2024-07-27T15:00:00Z',
    upvotes: 25,
    downvotes: 2,
    comments: [
        { id: 'comment-3', author: users[5], content: 'We had a brief performance degradation issue which is now resolved. Please let us know if you still experience slowness.', createdAt: '2024-07-27T15:00:00Z', isAgent: true },
    ],
  },
  {
    id: 'ticket-4',
    subject: 'Can we get an integration with Slack?',
    description: 'Our team heavily uses Slack and it would be a game-changer if we could get notifications and create tickets from Slack.',
    status: 'Closed',
    category: mockCategories[3],
    requester: users[3],
    assignee: users[4],
    createdAt: '2024-07-25T16:00:00Z',
    updatedAt: '2024-07-26T10:00:00Z',
    upvotes: 52,
    downvotes: 0,
    comments: [
        { id: 'comment-4', author: users[4], content: 'Thanks for the suggestion! We have added it to our product roadmap for consideration.', createdAt: '2024-07-26T10:00:00Z', isAgent: true },
    ],
  },
  {
    id: 'ticket-5',
    subject: 'How do I update my payment method?',
    description: 'I need to change the credit card on file for my account, but I can\'t find where to do it.',
    status: 'Open',
    category: mockCategories[0],
    requester: users[0],
    createdAt: '2024-07-29T15:00:00Z',
    updatedAt: '2024-07-29T15:00:00Z',
    upvotes: 2,
    downvotes: 0,
    comments: [],
  },
  {
    id: 'ticket-6',
    subject: 'API documentation is unclear',
    description: 'I\'m trying to use the API to create tickets, but the documentation for the /api/tickets endpoint is confusing.',
    status: 'In Progress',
    category: mockCategories[1],
    requester: users[1],
    assignee: users[5],
    createdAt: '2024-07-29T13:00:00Z',
    updatedAt: '2024-07-29T14:10:00Z',
    upvotes: 8,
    downvotes: 0,
    comments: [
      { id: 'comment-5', author: users[5], content: 'Hi Bob, sorry to hear that. I can help clarify the API usage. Which part is giving you trouble?', createdAt: '2024-07-29T14:10:00Z', isAgent: true },
    ],
  },
  {
    id: 'ticket-7',
    subject: 'Password reset link not working',
    description: 'I requested a password reset, but when I click the link in the email, it says "Invalid or expired token".',
    status: 'Resolved',
    category: mockCategories[4],
    requester: users[2],
    assignee: users[4],
    createdAt: '2024-07-28T11:00:00Z',
    updatedAt: '2024-07-28T12:30:00Z',
    upvotes: 3,
    downvotes: 0,
    comments: [
        { id: 'comment-6', author: users[4], content: 'Hi Cindy, I\'ve manually sent you a new, single-use password reset link. Please try that one.', createdAt: '2024-07-28T12:30:00Z', isAgent: true },
    ]
  }
];
