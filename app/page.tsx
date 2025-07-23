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
  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Pensamentos</h1>
      <p>Welcome to my collection of poems. I hope you enjoy your stay.</p>
    </div>
  );
}
