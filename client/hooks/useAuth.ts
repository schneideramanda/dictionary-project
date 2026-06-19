import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      router.push('/');
    },
  });
}

export function useSignIn() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
    onError: error =>
      toast.error((error as Error).message || 'Failed to sign in. Please try again.'),
  });
}

export function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      router.push('/sign-in');
    },
  });
}
