import { CopyIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { toast } from 'sonner';

interface CopyContentProps {
  children: ReactNode;
  value: string;
  message?: string;
}

export default function CopyContent({ children, value, message }: CopyContentProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(message ?? 'Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {children}
      <CopyIcon onClick={handleCopy} className="text-primary/40 size-3 cursor-pointer" />
    </div>
  );
}
