import { BookAIcon } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-primary">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <BookAIcon className="text-white" />
          <p className="text-lg text-white font-semibold">Dictionary</p>
        </Link>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
