
'use client';

import Link from "next/link";
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
import Logo from "@/components/logo";
import { getUsers, User, getUserByEmail } from "@/lib/data";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user.tsx";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('eve@quickdesk.com');
  const [password, setPassword] = useState('password');
  const [sampleUsers, setSampleUsers] = useState<User[]>([]);
  const { setCurrentUser } = useCurrentUser();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch a few users to display as examples on the login page
    const fetchSampleUsers = async () => {
      const users = await getUsers();
      setSampleUsers(users.slice(0, 3));
    };
    fetchSampleUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would use Firebase Auth.
    // For this prototype, we're checking the password locally
    // but looking up the user in the live Firestore database.
    if (password !== 'password') {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password. The password for all test users is 'password'.",
        });
        return;
    }

    try {
        const user = await getUserByEmail(email);
        if (user) {
            setCurrentUser(user);
        } else {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "No user found with that email address.",
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        toast({
            variant: "destructive",
            title: "Login Error",
            description: "An error occurred while trying to log in.",
        });
    }
  };

  const sampleAdmin = sampleUsers.find(u => u.role === 'Admin');
  const sampleAgent = sampleUsers.find(u => u.role === 'Support Agent');
  const sampleUser = sampleUsers.find(u => u.role === 'End User');


  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-8">
            <Link href="/" aria-label="Home">
                <Logo />
            </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Sample Users for Testing</CardTitle>
                <CardDescription>The password for all users is `password`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                {sampleAdmin && (
                    <div>
                        <p className="font-semibold">Admin</p>
                        <p className="text-muted-foreground">Email: {sampleAdmin.email}</p>
                    </div>
                )}
                {sampleAgent && (
                    <div>
                        <p className="font-semibold">Support Agent</p>
                        <p className="text-muted-foreground">Email: {sampleAgent.email}</p>
                    </div>
                )}
                {sampleUser && (
                    <div>
                        <p className="font-semibold">End User</p>
                        <p className="text-muted-foreground">Email: {sampleUser.email}</p>
                    </div>
                )}
                 {sampleUsers.length === 0 && (
                    <p className="text-muted-foreground">Loading sample users...</p>
                 )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
