
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { getUserById, User as FirestoreUser } from "@/lib/data";
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, User as AuthUser } from "firebase/auth";
import { app } from "@/lib/firebase";

type AppUser = FirestoreUser; // We are using the Firestore user model as our main user object

type CurrentUserContextType = {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void; // This is now mostly for manual override/logout
  isAdmin: boolean;
  isAgent: boolean;
  isEndUser: boolean;
  isLoading: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth(app);
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser: AuthUser | null) => {
      if (authUser) {
        // User is signed in, now get the profile from Firestore.
        try {
          const firestoreUser = await getUserById(authUser.uid);
          if (firestoreUser) {
            setCurrentUser(firestoreUser);
            // Redirect from login page if user is already logged in
            if(pathname === '/login') {
              router.push('/dashboard');
            }
          } else {
            // This case might happen if the user exists in Auth but not Firestore.
            // For this app's logic, we sign them out.
            await auth.signOut();
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user profile from Firestore:", error);
          await auth.signOut();
          setCurrentUser(null);
        }
      } else {
        // User is signed out.
        setCurrentUser(null);
        if (pathname.startsWith('/dashboard')) {
            router.push('/login');
        }
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router, pathname]);


  const handleSetCurrentUser = (user: AppUser | null) => {
    // This function is now mainly for explicit logout.
    if (user === null) {
        const auth = getAuth(app);
        auth.signOut(); // This will trigger the onAuthStateChanged listener
    }
  };

  const isAdmin = currentUser?.role === 'Admin';
  const isAgent = currentUser?.role === 'Support Agent';
  const isEndUser = currentUser?.role === 'End User';

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, isAdmin, isAgent, isEndUser, isLoading }}>
      {isLoading ? <div>Loading...</div> : children}
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
