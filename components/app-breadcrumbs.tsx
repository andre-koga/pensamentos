'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbSegment {
  label: string;
  href: string;
  isLast: boolean;
}

// Function to format path segments into user-friendly labels
function formatLabel(segment: string): string {
  // Convert kebab-case and snake_case to title case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to get user-friendly labels for common paths
function getCustomLabel(segment: string): string {
  const customLabels: Record<string, string> = {
    ui: 'UI Components',
    components: 'Components',
    api: 'API',
    app: 'Application',
    lib: 'Library',
    utils: 'Utilities',
    hooks: 'Hooks',
    pages: 'Pages',
    public: 'Public Assets',
  };

  // Check if it's a file (has extension)
  if (segment.includes('.')) {
    return segment;
  }

  return customLabels[segment.toLowerCase()] || formatLabel(segment);
}

export function AppBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbSegments = React.useMemo((): BreadcrumbSegment[] => {
    // If we're at root, show a simple "Home" breadcrumb
    if (pathname === '/') {
      return [{ label: 'Home', href: '/', isLast: true }];
    }

    // Split the pathname and filter out empty segments
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbSegment[] = [
      { label: 'Home', href: '/', isLast: false },
    ];

    // Generate breadcrumbs for each segment
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      const label = getCustomLabel(segment);

      breadcrumbs.push({
        label,
        href,
        isLast,
      });
    });

    return breadcrumbs;
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbSegments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            <BreadcrumbItem className={index > 0 ? 'hidden md:block' : ''}>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink>{segment.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!segment.isLast && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
