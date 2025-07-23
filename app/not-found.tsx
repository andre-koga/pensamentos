import { AppSidebar } from '@/components/app-sidebar';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Shuffle } from 'lucide-react';
import Link from 'next/link';
import {
  getContentTree,
  getRandomPoemPath,
  getRecentlyModified,
} from '@/lib/content-utils';

export default function NotFound() {
  const contentTree = getContentTree();
  const recentlyModified = getRecentlyModified();
  return (
    <>
      <AppSidebar
        contentTree={contentTree}
        recentlyModified={recentlyModified}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <AppBreadcrumbs />
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="mx-auto max-w-md space-y-6 text-center">
            {/* 404 Display */}
            <div className="space-y-2">
              <h1 className="text-muted-foreground/20 text-8xl font-bold">
                404
              </h1>
              <h2 className="text-2xl font-semibold tracking-tight">
                Page Not Found
              </h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Navigation Options */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/">
                  <Home />
                  Go Home
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                size="lg"
                className="cursor-pointer"
              >
                <Link href={getRandomPoemPath() || ''}>
                  <Shuffle />
                  Random Poem
                </Link>
              </Button>
            </div>

            {/* Additional Help */}
            <div className="space-y-2 border-t pt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Lost? Try checking the navigation menu or returning to the
                homepage.
              </p>
              <p className="text-muted-foreground text-xs">
                If you believe this is an error... well, I can't help you.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
