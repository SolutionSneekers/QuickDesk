
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/lib/data";

interface UserDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  onSave: (user: Omit<User, 'id'> | User) => void;
}

export function UserDialog({ isOpen, setIsOpen, user, onSave }: UserDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'End User' | 'Support Agent' | 'Admin'>('End User');

  const isEditing = !!user;

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      // Reset form for new user
      setName('');
      setEmail('');
      setRole('End User');
    }
  }, [user, isOpen]);

  const handleSubmit = () => {
    // A real app would have proper validation here
    if (isEditing && user) {
        onSave({ ...user, name, email, role });
    } else {
        // For new users, default the role to End User for security
        // and create a placeholder avatar.
        onSave({ name, email, role: 'End User', avatar: `https://placehold.co/150x150.png` });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this user.' : 'Enter the details for the new user.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
             <Select value={role} onValueChange={(value) => setRole(value as any)} disabled={!isEditing}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="End User">End User</SelectItem>
                  <SelectItem value="Support Agent">Support Agent</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
