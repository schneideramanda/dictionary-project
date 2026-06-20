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

export default function UserAvatar() {
  const router = useRouter();
  const { user, mutate } = useCurrentUser();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const initials = user
    ? user.name
        .split(' ')
        .map(part => part[0])
        .join('')
    : '';

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      mutate(undefined, { revalidate: false });
    });
  };

  if (!user) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Avatar className="flex items-center justify-center text-accent dark:text-white bg-input/30">
          {initials}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push('/user')}>
          <UserIcon />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          <LogOutIcon />
          {isPending ? 'Logging out...' : 'Log Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
