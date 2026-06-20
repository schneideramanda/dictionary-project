'use client';

import CopyContent from '@/components/copy-content';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/useUser';
import { getUserInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function UserDetail() {
  const { user } = useCurrentUser();
  const router = useRouter();

  return (
    <motion.div
      className="px-6 py-8 flex flex-col items-center justify-center"
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ opacity: { duration: 0.8 }, x: { duration: 0.5 } }}>
      <Card className="w-full items-center">
        <CardHeader className="w-full">
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full">
          <div className="flex flex-col gap-4 items-center">
            <Avatar className="flex items-center justify-center size-16 text-xl font-semibold bg-secondary">
              {getUserInitials(user?.name ?? '')}
            </Avatar>
            <CopyContent value={user?.id ?? ''}>
              <p className="text-sm text-foreground/60 text-center">{user?.id}</p>
            </CopyContent>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground/70">Name</p>
              <CopyContent value={user?.name ?? ''}>
                <p>{user?.name}</p>
              </CopyContent>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground/70">Email</p>
              <CopyContent value={user?.email ?? ''}>
                <p>{user?.email}</p>
              </CopyContent>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-4 mt-6 w-full">
        <Button
          className="flex-1 py-5"
          variant="outline"
          onClick={() => router.push('/entries/favorites')}>
          Favorites
        </Button>
        <Button
          className="flex-1 py-5"
          variant="outline"
          onClick={() => router.push('/entries/history')}>
          History
        </Button>
      </div>
    </motion.div>
  );
}
