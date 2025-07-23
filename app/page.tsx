import { AppSidebar } from '@/components/app-sidebar';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getContentTree, getRecentlyModified } from '@/lib/content-utils';

export default function Home() {
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="prose dark:prose-invert max-w-none">
            <h1>Pensamentos</h1>
            <p>
              Welcome to my collection of poems. I hope you enjoy your stay.
            </p>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
