'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { users } from "@/lib/data";
import Link from "next/link";
import { LogOut, User, Settings, Check } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

export function UserNav() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [selectedUser, setSelectedUser] = React.useState(currentUser?.id || 'admin-1');

  if (!currentUser) {
    return null;
  }
  
  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if(user) {
      setCurrentUser(user);
      setSelectedUser(userId);
    }
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.avatar} alt={`@${currentUser.name}`} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link href="/dashboard/profile">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <DropdownMenuLabel>Switch User</DropdownMenuLabel>
         <DropdownMenuRadioGroup value={selectedUser} onValueChange={handleUserChange}>
            {users.map(user => (
              <DropdownMenuRadioItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </DropdownMenuRadioItem>
            ))}
         </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
