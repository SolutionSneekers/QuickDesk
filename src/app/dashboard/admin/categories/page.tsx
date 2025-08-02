
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categories as initialCategories, Category } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CategoryDialog } from "./components/category-dialog";
import { DeleteCategoryDialog } from "./components/delete-category-dialog";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleAddCategory = (category: Category) => {
        setCategories(prev => [...prev, { ...category, id: `cat-${Date.now()}` }]);
    };

    const handleUpdateCategory = (category: Category) => {
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

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
                            {categories.map(category => (
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
                onSave={selectedCategory ? handleUpdateCategory : handleAddCategory}
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
