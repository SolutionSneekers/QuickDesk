'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user.tsx";

export default function ProfilePage() {
    const { currentUser } = useCurrentUser();

    if (!currentUser) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline mb-4">Profile & Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>Manage your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={currentUser.avatar} />
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <Button>Change Photo</Button>
                            <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={currentUser.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={currentUser.email} disabled/>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue={currentUser.role} disabled/>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password for better security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                     <div className="grid md:grid-cols-2 gap-6">
                         <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <Button>Update Password</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
