'use client';

import * as React from 'react';
import {
  ChevronRight,
  File,
  Folder,
  Clock,
  Home,
  Shuffle,
  SortAsc,
  ListCollapse,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { ContentItem, ContentTreeItem } from '@/lib/content-utils';
import { Button } from '@/components/ui/button';

// Track current path for building URLs in nested structures
interface TreeProps {
  item: ContentTreeItem;
  basePath?: string[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  contentTree: ContentTreeItem[];
  recentlyModified: ContentItem[];
}

export function AppSidebar({
  contentTree,
  recentlyModified,
  ...props
}: AppSidebarProps) {
  const router = useRouter();

  const handleShuffleClick = async () => {
    try {
      const response = await fetch('/api/random-poem');
      if (response.ok) {
        const data = await response.json();
        router.push(data.path);
      }
    } catch (error) {
      console.error('Error fetching random poem:', error);
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="The Thought Compiler"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Pensamentos</span>
                  <span className="truncate text-xs opacity-70">
                    by Andre H. Koga
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-row items-center justify-center gap-1">
              <Button asChild size="icon" variant="ghost">
                <Link href="/">
                  <Home />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleShuffleClick}
                className="cursor-pointer"
              >
                <Shuffle />
              </Button>
              <Button size="icon" variant="ghost">
                <SortAsc />
              </Button>
              <Button size="icon" variant="ghost">
                <ListCollapse />
              </Button>
              <Button size="icon" variant="ghost">
                <ChevronDown />
              </Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentlyModified.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={`/${item.path.join('/')}`}>
                      <Clock className="h-4 w-4" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>All Poems</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentTree.map((item, index) => (
                <Tree key={index} item={item} basePath={[]} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({ item, basePath = [] }: TreeProps) {
  const [name, ...items] = Array.isArray(item) ? item : [item];

  if (!items.length) {
    // This is a file - create link to poem
    const poemPath = [...basePath, name].join('/');

    return (
      <SidebarMenuButton asChild>
        <Link href={`/${poemPath}`}>
          <File className="h-4 w-4" />
          <span className="truncate">{name}</span>
        </Link>
      </SidebarMenuButton>
    );
  }

  // This is a folder - create collapsible section
  const currentPath = [...basePath, name];

  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder className="h-4 w-4" />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree key={index} item={subItem} basePath={currentPath} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
