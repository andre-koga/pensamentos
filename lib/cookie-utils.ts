import { cookies } from 'next/headers';
import { SortOption } from '@/components/sort-toggle';

const SORT_COOKIE_NAME = 'poem-sort-preference';
const DEFAULT_SORT = 'filename-asc';

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

// Server-side function to get sort preference from cookies
export async function getSortPreferenceFromCookies(): Promise<SortOption> {
  const cookieStore = await cookies();
  const savedSort = cookieStore.get(SORT_COOKIE_NAME)?.value as SortOption;

  if (savedSort && isValidSortOption(savedSort)) {
    return savedSort;
  }

  return DEFAULT_SORT;
}
