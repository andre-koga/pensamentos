'use client';

import * as React from 'react';
import { ChevronRight, File, Folder, Clock } from 'lucide-react';
import Link from 'next/link';

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
import { ContentItem } from '@/lib/content-utils';

// Track current path for building URLs in nested structures
interface TreeProps {
  item: string | any[];
  basePath?: string[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  contentTree: any[];
  recentlyModified: ContentItem[];
}

export function AppSidebar({
  contentTree,
  recentlyModified,
  ...props
}: AppSidebarProps) {
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
        <SidebarGroup>
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
