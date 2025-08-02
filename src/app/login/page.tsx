
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
import { users } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const sampleAdmin = users.find(u => u.role === 'Admin');
  const sampleAgent = users.find(u => u.role === 'Support Agent');
  const sampleUser = users.find(u => u.role === 'End User');


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
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  defaultValue="eve@quickdesk.com"
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
                <Input id="password" type="password" required defaultValue="password" />
              </div>
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Sign in</Link>
              </Button>
            </div>
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
                <CardDescription>Use the user switcher in the dashboard header to change roles.</CardDescription>
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
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
