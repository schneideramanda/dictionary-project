import { Button } from '@/components/ui/button';

export default function UserDetail() {
  return (
    <div className="px-6 py-8">
      <div className="flex items-center gap-2">
        <Button>Favorites</Button>
        <Button>History</Button>
      </div>
    </div>
  );
}
