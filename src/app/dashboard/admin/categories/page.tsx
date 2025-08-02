import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminCategoriesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold font-headline mb-4">Category Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Categories</CardTitle>
                    <CardDescription>This feature is coming soon. Here you will be able to create, edit, and delete ticket categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Category list and management controls will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
