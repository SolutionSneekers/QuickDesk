
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
import { getUserByEmail } from "@/lib/data";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user.tsx";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { setCurrentUser } = useCurrentUser();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // This is a temporary login flow for the prototype.
    // In a real app, you would use Firebase Authentication.

    if (!email) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Please enter an email address.",
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
              Enter your email to sign into your account.
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
      </div>
    </div>
  );
}
