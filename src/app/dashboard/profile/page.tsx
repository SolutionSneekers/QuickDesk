import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold font-headline mb-4">Profile & Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>This feature is coming soon. Here you will be able to manage your profile information and notification settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>User profile details and settings will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
