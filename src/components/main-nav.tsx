'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Users,
  Ticket,
  Settings,
  LayoutGrid,
  Tags,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/tickets', label: 'All Tickets', icon: Ticket },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users, adminOnly: true },
  { href: '/dashboard/admin/categories', label: 'Categories', icon: Tags, adminOnly: true },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  // In a real app, you'd get this from user auth state
  const userRole = 'Admin'; 

  return (
    <nav className={cn('flex flex-col', className)} {...props}>
      <SidebarMenu>
        {menuItems.map((item) => {
          if (item.adminOnly && userRole !== 'Admin') {
            return null;
          }
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton isActive={isActive} tooltip={item.label}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </nav>
  );
}
