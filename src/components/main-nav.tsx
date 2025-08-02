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
import { useCurrentUser } from '@/hooks/use-current-user.tsx';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { isEndUser, isAdmin } = useCurrentUser();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, roles: ['Admin', 'Support Agent', 'End User'] },
    { href: '/dashboard/tickets', label: isEndUser ? 'My Tickets' : 'All Tickets', icon: Ticket, roles: ['Admin', 'Support Agent', 'End User'] },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users, roles: ['Admin'] },
    { href: '/dashboard/admin/categories', label: 'Categories', icon: Tags, roles: ['Admin'] },
    { href: '/dashboard/profile', label: 'Profile', icon: Settings, roles: ['Admin', 'Support Agent', 'End User'] },
  ];

  return (
    <nav className={cn('flex flex-col', className)} {...props}>
      <SidebarMenu>
        {menuItems.map((item) => {
          let hasAccess = true;
          if (item.roles.includes('Admin') && !isAdmin) hasAccess = false;
          if (item.href.startsWith('/dashboard/admin') && !isAdmin) hasAccess = false;


          if (!hasAccess) {
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
