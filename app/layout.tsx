import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { getContentTree, getRecentlyModified } from '@/lib/content-utils';
import { getSortPreferenceFromCookies } from '@/lib/cookie-utils';

export const metadata: Metadata = {
  title: 'Pensamentos',
  description: 'A MD-based poetry archive',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sortPreference = await getSortPreferenceFromCookies();
  const contentTree = getContentTree(sortPreference);
  const recentlyModified = getRecentlyModified(sortPreference);

  return (
    <html
      lang="en"
      className={cn(GeistSans.className, GeistMono.className)}
      suppressHydrationWarning
    >
      <head />
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
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
              <div className="flex flex-1 flex-col gap-4 p-4 pt-8">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
