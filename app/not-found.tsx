import { AppSidebar } from '@/components/app-sidebar';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { RandomPoemButton } from '@/components/random-poem-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { getContentTree, getRecentlyModified } from '@/lib/content-utils';

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
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="prose dark:prose-invert max-w-none">
            <h1>404 - Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
