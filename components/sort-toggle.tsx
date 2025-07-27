'use client';

import * as React from 'react';
import { SortAsc, SortDesc, Clock, FileText, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type SortOption =
  | 'filename-asc'
  | 'filename-desc'
  | 'modified-asc'
  | 'modified-desc'
  | 'created-asc'
  | 'created-desc';

const SORT_COOKIE_NAME = 'poem-sort-preference';
const DEFAULT_SORT = 'filename-asc';

export function SortToggle() {
  const router = useRouter();
  const [sortPreference, setSortPreference] =
    React.useState<SortOption>(DEFAULT_SORT);

  // Load sort preference from cookie on mount
  React.useEffect(() => {
    const savedSort = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${SORT_COOKIE_NAME}=`))
      ?.split('=')[1] as SortOption;

    if (savedSort && isValidSortOption(savedSort)) {
      setSortPreference(savedSort);
    }
  }, []);

  const handleSortChange = (newSort: SortOption) => {
    setSortPreference(newSort);

    // Save to cookie
    document.cookie = `${SORT_COOKIE_NAME}=${newSort}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Refresh the page to apply new sorting
    router.refresh();
  };

  const getSortIcon = () => {
    switch (sortPreference) {
      case 'filename-asc':
      case 'modified-asc':
      case 'created-asc':
        return <SortAsc />;
      case 'filename-desc':
      case 'modified-desc':
      case 'created-desc':
        return <SortDesc />;
      default:
        return <SortAsc />;
    }
  };

  const getSortLabel = () => {
    switch (sortPreference) {
      case 'filename-asc':
        return 'Name (A-Z)';
      case 'filename-desc':
        return 'Name (Z-A)';
      case 'modified-asc':
        return 'Modified (Old-New)';
      case 'modified-desc':
        return 'Modified (New-Old)';
      case 'created-asc':
        return 'Created (Old-New)';
      case 'created-desc':
        return 'Created (New-Old)';
      default:
        return 'Sort';
    }
  };

  return (
    <Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              {getSortIcon()}
              <span className="sr-only">Sort poems</span>
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSortChange('filename-asc')}>
            <FileText />
            Name (A to Z)
            {sortPreference === 'filename-asc' && (
              <Check className="text-foreground" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('filename-desc')}>
            <FileText
              className={cn(
                sortPreference === 'filename-desc' && 'text-orange-700'
              )}
            />
            Name (Z to A)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSortChange('modified-desc')}>
            <Clock
              className={cn(
                sortPreference === 'modified-desc' && 'text-orange-700'
              )}
            />
            Modified (New to Old)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('modified-asc')}>
            <Clock
              className={cn(
                sortPreference === 'modified-asc' && 'text-orange-700'
              )}
            />
            Modified (Old to New)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSortChange('created-desc')}>
            <Clock
              className={cn(
                sortPreference === 'created-desc' && 'text-orange-700'
              )}
            />
            Created (New to Old)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange('created-asc')}>
            <Clock
              className={cn(
                sortPreference === 'created-asc' && 'text-orange-700'
              )}
            />
            Created (Old to New)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>{getSortLabel()}</TooltipContent>
    </Tooltip>
  );
}

function isValidSortOption(value: string): value is SortOption {
  return [
    'filename-asc',
    'filename-desc',
    'modified-asc',
    'modified-desc',
    'created-asc',
    'created-desc',
  ].includes(value);
}
