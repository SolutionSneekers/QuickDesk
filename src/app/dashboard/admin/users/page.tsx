
'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, getUsers, addUser, updateUser, deleteUser } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { UserDialog } from "./components/user-dialog";
import { DeleteUserDialog } from "./components/delete-user-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch users." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveUser = async (user: Omit<User, 'id'> | User) => {
        try {
             if ('id' in user && user.id) {
                // Update existing user
                await updateUser(user.id, { name: user.name, email: user.email, role: user.role });
                toast({ title: "Success", description: "User updated successfully." });
            } else {
                // Add new user
                await addUser({ name: user.name, email: user.email, role: user.role, avatar: `https://i.pravatar.cc/150?u=${user.email}` });
                toast({ title: "Success", description: "User added successfully." });
            }
            fetchUsers();
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: "Could not save user." });
        } finally {
            setIsUserDialogOpen(false);
            setSelectedUser(null);
        }
    };
    
    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
            fetchUsers();
            toast({ title: "Success", description: "User deleted successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not delete user." });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline">User Management</h1>
                 <Button size="sm" className="h-8 gap-1" onClick={() => { setSelectedUser(null); setIsUserDialogOpen(true); }}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add User
                    </span>
                 </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all users in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div>
                                                <Skeleton className="h-4 w-24 mb-1" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 float-right" /></TableCell>
                                </TableRow>
                                ))
                            ) : users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsUserDialogOpen(true); }}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true); }}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                   </Table>
                </CardContent>
            </Card>

            <UserDialog
                isOpen={isUserDialogOpen}
                setIsOpen={setIsUserDialogOpen}
                user={selectedUser}
                onSave={handleSaveUser}
            />

            <DeleteUserDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                user={selectedUser}
                onDelete={handleDeleteUser}
            />
        </div>
    );
}
