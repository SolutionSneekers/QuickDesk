import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminUsersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold font-headline mb-4">User Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>This feature is coming soon. Here you will be able to add, remove, and edit user roles and permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>User list and management controls will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
