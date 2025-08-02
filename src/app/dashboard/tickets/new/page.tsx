
'use client';
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories, Category } from "@/lib/data";
import { useEffect, useState } from "react";

export default function NewTicketPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
    }
    fetchCategories();
  }, [])


  return (
    <div>
        <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
            Create New Ticket
            </h1>
        </div>
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Ticket Details</CardTitle>
            <CardDescription>
                Please provide as much detail as possible so we can assist you effectively.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form className="grid gap-6">
                <div className="grid gap-3">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    type="text"
                    className="w-full"
                    placeholder="e.g., Unable to reset my password"
                />
                </div>
                <div className="grid gap-3">
                <Label htmlFor="category">Category</Label>
                <Select>
                    <SelectTrigger id="category" aria-label="Select category">
                    <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
                <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Please describe your issue in detail..."
                    className="min-h-32"
                />
                </div>
                 <div className="grid gap-3">
                    <Label htmlFor="attachment">Attachment (Optional)</Label>
                    <Input id="attachment" type="file" />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild><Link href="/dashboard">Cancel</Link></Button>
                    <Button type="submit">Submit Ticket</Button>
                </div>
            </form>
            </CardContent>
        </Card>
    </div>
  );
}
