import { Button } from '@/components/ui/button';
import { getRandomPoemPath } from '@/lib/content-utils';
import { Home, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 text-center">
        {/* 404 Display */}
        <div className="space-y-2">
          <h1 className="text-muted-foreground/20 text-8xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>

          <Button asChild size="lg" className="cursor-pointer">
            <Link href={getRandomPoemPath() || ''}>
              <Shuffle className="mr-2 h-4 w-4" />
              Random Poem
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="space-y-2 border-t pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            Lost? Try checking the navigation menu or returning to the homepage.
          </p>
          <p className="text-muted-foreground text-xs">
            If you believe this is an error... well, I can&apos;t help you.
          </p>
        </div>
      </div>
    </div>
  );
}
