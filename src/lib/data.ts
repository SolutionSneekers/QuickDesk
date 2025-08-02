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

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=user-1', role: 'End User' },
  { id: 'user-2', name: 'Bob Williams', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=user-2', role: 'End User' },
  { id: 'agent-1', name: 'Charlie Brown', email: 'charlie@quickdesk.com', avatar: 'https://i.pravatar.cc/150?u=agent-1', role: 'Support Agent' },
  { id: 'agent-2', name: 'Diana Prince', email: 'diana@quickdesk.com', avatar: 'https://i.pravatar.cc/150?u=agent-2', role: 'Support Agent' },
  { id: 'admin-1', name: 'Eve Adams', email: 'eve@quickdesk.com', avatar: 'https://i.pravatar.cc/150?u=admin-1', role: 'Admin' },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Billing' },
  { id: 'cat-2', name: 'Technical Support' },
  { id: 'cat-3', name: 'General Inquiry' },
  { id: 'cat-4', name: 'Feature Request' },
];

export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    subject: 'Cannot login to my account',
    description: 'I am trying to login with my credentials but it keeps saying "Invalid password". I have tried resetting it multiple times.',
    status: 'In Progress',
    category: categories[1],
    requester: users[0],
    assignee: users[2],
    createdAt: '2024-07-22T10:00:00Z',
    updatedAt: '2024-07-22T11:30:00Z',
    upvotes: 12,
    downvotes: 1,
    comments: [
      { id: 'comment-1', author: users[2], content: 'Hi Alice, I am looking into this issue for you. Can you please confirm the email address you are using to log in?', createdAt: '2024-07-22T10:15:00Z', isAgent: true },
      { id: 'comment-2', author: users[0], content: 'It\'s alice@example.com. Thanks for the quick response!', createdAt: '2024-07-22T10:20:00Z', isAgent: false },
    ],
  },
  {
    id: 'ticket-2',
    subject: 'Question about my recent invoice',
    description: 'I was charged twice for my subscription this month. Can you please look into it and issue a refund?',
    status: 'Open',
    category: categories[0],
    requester: users[1],
    createdAt: '2024-07-21T14:00:00Z',
    updatedAt: '2024-07-21T14:00:00Z',
    upvotes: 5,
    downvotes: 0,
    comments: [],
  },
  {
    id: 'ticket-3',
    subject: 'Website is loading very slowly',
    description: 'For the past few days, the main dashboard has been extremely slow to load. All other websites are working fine.',
    status: 'Resolved',
    category: categories[1],
    requester: users[0],
    assignee: users[3],
    createdAt: '2024-07-20T09:00:00Z',
    updatedAt: '2024-07-21T15:00:00Z',
    upvotes: 25,
    downvotes: 2,
    comments: [
        { id: 'comment-3', author: users[3], content: 'We had a brief performance degradation issue which is now resolved. Please let us know if you still experience slowness.', createdAt: '2024-07-21T15:00:00Z', isAgent: true },
    ],
  },
  {
    id: 'ticket-4',
    subject: 'Can we get an integration with Slack?',
    description: 'Our team heavily uses Slack and it would be a game-changer if we could get notifications and create tickets from Slack.',
    status: 'Closed',
    category: categories[3],
    requester: users[1],
    assignee: users[2],
    createdAt: '2024-07-19T16:00:00Z',
    updatedAt: '2024-07-20T10:00:00Z',
    upvotes: 52,
    downvotes: 0,
    comments: [
        { id: 'comment-4', author: users[2], content: 'Thanks for the suggestion! We have added it to our product roadmap for consideration.', createdAt: '2024-07-20T10:00:00Z', isAgent: true },
    ],
  },
];
