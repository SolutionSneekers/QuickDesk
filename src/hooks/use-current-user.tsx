"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { users, User } from "@/lib/data";

type CurrentUserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  isAdmin: boolean;
  isAgent: boolean;
  isEndUser: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch this from an auth session.
    // For now, we'll get it from localStorage or default to the first admin.
    const storedUserId = localStorage.getItem("currentUser");
    const initialUser = users.find(u => u.id === storedUserId) || users.find(u => u.role === 'Admin');
    if (initialUser) {
      setCurrentUser(initialUser);
    }
  }, []);

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", user.id);
     // Force a re-render by reloading the page
    window.location.reload();
  };

  const isAdmin = currentUser?.role === 'Admin';
  const isAgent = currentUser?.role === 'Support Agent';
  const isEndUser = currentUser?.role === 'End User';

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, isAdmin, isAgent, isEndUser }}>
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
