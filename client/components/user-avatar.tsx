'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar } from './ui/avatar';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useCurrentUser } from '@/hooks/useUser';
import { logoutAction } from '@/app/actions/auth';
import { getUserInitials } from '@/lib/utils';

export default function UserAvatar() {
  const router = useRouter();
  const { user, mutate, isUnauthenticated } = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      mutate(undefined, { revalidate: false });
      await logoutAction();
    });
  };

  if (!user || isUnauthenticated) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger aria-label="User Menu">
        <Avatar className="flex items-center justify-center text-accent dark:text-white bg-input/30">
          {getUserInitials(user?.name ?? '')}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push('/user')} aria-label="View Profile">
          <UserIcon />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} aria-label="Log Out">
          <LogOutIcon />
          {isPending ? 'Logging out...' : 'Log Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
