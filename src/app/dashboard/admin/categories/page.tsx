
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category, getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CategoryDialog } from "./components/category-dialog";
import { DeleteCategoryDialog } from "./components/delete-category-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not fetch categories." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = async (category: Omit<Category, 'id'>) => {
        try {
            await addCategory(category);
            fetchCategories(); // Re-fetch to get the new category with its ID
            toast({ title: "Success", description: "Category added successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not add category." });
        }
    };

    const handleUpdateCategory = async (category: Category) => {
        try {
            await updateCategory(category.id, { name: category.name });
            fetchCategories();
            toast({ title: "Success", description: "Category updated successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not update category." });
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            fetchCategories();
            toast({ title: "Success", description: "Category deleted successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not delete category." });
        }
    };
    
    const handleSave = async (category: Category) => {
        if(selectedCategory) {
            await handleUpdateCategory({ ...category, id: selectedCategory.id });
        } else {
            await handleAddCategory({ name: category.name });
        }
    }


    return (
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline">Category Management</h1>
                 <Button size="sm" className="h-8 gap-1" onClick={() => { setSelectedCategory(null); setIsCategoryDialogOpen(true); }}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Category
                    </span>
                 </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>A list of all ticket categories.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Tickets</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-8 float-right" /></TableCell>
                                    </TableRow>
                                ))
                            ) : categories.map(category => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => { setSelectedCategory(category); setIsCategoryDialogOpen(true); }}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedCategory(category); setIsDeleteDialogOpen(true); }}>
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

            <CategoryDialog
                isOpen={isCategoryDialogOpen}
                setIsOpen={setIsCategoryDialogOpen}
                category={selectedCategory}
                onSave={handleSave}
            />

            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                category={selectedCategory}
                onDelete={handleDeleteCategory}
            />

        </div>
    );
}
