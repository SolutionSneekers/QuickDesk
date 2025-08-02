
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { getUserById, User } from "@/lib/data";
import { useRouter } from 'next/navigation';


type CurrentUserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isAgent: boolean;
  isEndUser: boolean;
  isLoading: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
        setIsLoading(true);
        const storedUserId = localStorage.getItem("currentUser");
        if (storedUserId) {
            try {
                // In a real app, you'd also verify the user's session/token with a backend.
                const user = await getUserById(storedUserId);
                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                localStorage.removeItem("currentUser"); // Clear invalid stored user
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
        setIsLoading(false);
    }
    fetchUser();
  }, []);

  const handleSetCurrentUser = (user: User | null) => {
    if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", user.id);
        router.push('/dashboard');
    } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        router.push('/login');
    }
  };

  const isAdmin = currentUser?.role === 'Admin';
  const isAgent = currentUser?.role === 'Support Agent';
  const isEndUser = currentUser?.role === 'End User';

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, isAdmin, isAgent, isEndUser, isLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return context;
}
