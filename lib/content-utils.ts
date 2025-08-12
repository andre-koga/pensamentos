import { readdirSync, statSync, readFileSync, Stats } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { SortOption } from '@/components/sort-toggle';

export interface ContentItem {
  title: string;
  path: string[];
  created: Date;
  modified: Date;
  description?: string;
}

// Type for the tree structure: either a string (file) or array starting with string (directory)
export type ContentTreeItem = string | [string, ...ContentTreeItem[]];

// Function to recursively scan content directory and build tree structure for sidebar
export function getContentTree(sortOption?: SortOption): ContentTreeItem[] {
  const contentDir = join(process.cwd(), 'content');

  function scanDirectory(
    dir: string,
    relativePath: string[] = []
  ): ContentTreeItem[] {
    try {
      const items = readdirSync(dir);
      const directories: string[] = [];
      const files: Array<{ name: string; fullPath: string; stat: Stats }> = [];

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          directories.push(item);
        } else if (item.endsWith('.mdx')) {
          files.push({ name: item, fullPath, stat });
        }
      }

      // Sort directories alphabetically
      directories.sort();

      // Sort files based on sort option
      if (
        sortOption &&
        (sortOption.includes('modified') || sortOption.includes('created'))
      ) {
        // For time-based sorting, we need to read file metadata
        const filesWithMetadata = files.map((file) => {
          try {
            const fileContent = readFileSync(file.fullPath, 'utf8');
            const { data } = matter(fileContent);

            const created = data.created
              ? new Date(data.created)
              : file.stat.birthtime;
            const modified = data.modified
              ? new Date(data.modified)
              : file.stat.mtime;

            return {
              ...file,
              created,
              modified,
            };
          } catch (error) {
            // Fallback to file system dates
            console.error('Error parsing file:', file.fullPath, error);
            return {
              ...file,
              created: file.stat.birthtime,
              modified: file.stat.mtime,
            };
          }
        });

        // Sort based on the appropriate date field
        const dateField = sortOption.includes('modified')
          ? 'modified'
          : 'created';
        const isDescending = sortOption.includes('-desc');

        filesWithMetadata.sort((a, b) => {
          const aTime = a[dateField].getTime();
          const bTime = b[dateField].getTime();
          return isDescending ? bTime - aTime : aTime - bTime;
        });

        // Extract just the names in the sorted order
        files.splice(
          0,
          files.length,
          ...filesWithMetadata.map((f) => ({
            name: f.name,
            fullPath: f.fullPath,
            stat: f.stat,
          }))
        );
      } else {
        // For filename-based sorting
        files.sort((a, b) => a.name.localeCompare(b.name));

        if (sortOption === 'filename-desc') {
          files.reverse();
        }
      }

      const result: ContentTreeItem[] = [];

      for (const directory of directories) {
        const fullPath = join(dir, directory);
        // Recursively scan subdirectory
        const subItems = scanDirectory(fullPath, [...relativePath, directory]);
        if (subItems.length > 0) {
          result.push([directory, ...subItems]);
        }
      }

      for (const file of files) {
        // Add poem file
        const fileName = file.name.replace('.mdx', '');
        result.push(fileName);
      }

      return result;
    } catch (error) {
      console.error('Error scanning directory:', dir, error);
      return [];
    }
  }

  return scanDirectory(contentDir);
}

// Function to get all content items with metadata for recently modified section
export function getAllContentItems(sortOption?: SortOption): ContentItem[] {
  const contentDir = join(process.cwd(), 'content');
  const items: ContentItem[] = [];

  function scanDirectory(dir: string, relativePath: string[] = []) {
    try {
      const dirItems = readdirSync(dir);

      for (const item of dirItems) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath, [...relativePath, item]);
        } else if (item.endsWith('.mdx')) {
          try {
            const fileContent = readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContent);

            const fileName = item.replace('.mdx', '');
            const urlPath = [...relativePath, fileName];

            // Get dates (frontmatter or file system)
            const created = data.created
              ? new Date(data.created)
              : stat.birthtime;
            const modified = data.modified
              ? new Date(data.modified)
              : stat.mtime;

            items.push({
              title: data.title || fileName,
              path: urlPath,
              created,
              modified,
              description: data.description,
            });
          } catch (error) {
            console.error('Error parsing file:', fullPath, error);
          }
        }
      }
    } catch (error) {
      console.error('Error scanning directory:', dir, error);
    }
  }

  scanDirectory(contentDir);

  // Sort items based on sort option
  if (sortOption) {
    return sortContentItems(items, sortOption);
  }

  return items;
}

// Function to sort content items based on sort option
export function sortContentItems(
  items: ContentItem[],
  sortOption: SortOption
): ContentItem[] {
  const sortedItems = [...items];

  switch (sortOption) {
    case 'filename-asc':
      return sortedItems.sort((a, b) => {
        const aName = a.path[a.path.length - 1] || '';
        const bName = b.path[b.path.length - 1] || '';
        return aName.localeCompare(bName);
      });

    case 'filename-desc':
      return sortedItems.sort((a, b) => {
        const aName = a.path[a.path.length - 1] || '';
        const bName = b.path[b.path.length - 1] || '';
        return bName.localeCompare(aName);
      });

    case 'modified-asc':
      return sortedItems.sort(
        (a, b) => a.modified.getTime() - b.modified.getTime()
      );

    case 'modified-desc':
      return sortedItems.sort(
        (a, b) => b.modified.getTime() - a.modified.getTime()
      );

    case 'created-asc':
      return sortedItems.sort(
        (a, b) => a.created.getTime() - b.created.getTime()
      );

    case 'created-desc':
      return sortedItems.sort(
        (a, b) => b.created.getTime() - a.created.getTime()
      );

    default:
      return sortedItems;
  }
}

// Function to get recently modified poems (last 3)
export function getRecentlyModified(sortOption?: SortOption): ContentItem[] {
  const allItems = getAllContentItems(sortOption);

  // For recent items, we still want to show the most recently modified
  // regardless of the sort option, but we'll respect the sort option for the main list
  return allItems
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())
    .slice(0, 3);
}

// Function to get recently created poems (last 3)
export function getRecentlyCreated(sortOption?: SortOption): ContentItem[] {
  const allItems = getAllContentItems(sortOption);

  // For recent items, we still want to show the most recently created
  // regardless of the sort option, but we'll respect the sort option for the main list
  return allItems
    .sort((a, b) => b.created.getTime() - a.created.getTime())
    .slice(0, 3);
}

// Utility function to get all poem paths
export function getAllPoemPaths(): string[] {
  const contentDir = join(process.cwd(), 'content');
  const paths: string[] = [];

  function scanDirectory(dir: string, relativePath: string[] = []) {
    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          scanDirectory(fullPath, [...relativePath, item]);
        } else if (item.endsWith('.mdx')) {
          const fileName = item.replace('.mdx', '');
          const urlPath = [...relativePath, fileName];
          const pathString = urlPath.length > 0 ? `/${urlPath.join('/')}` : '/';
          paths.push(pathString);
        }
      }
    } catch (error) {
      console.error('Error reading content directory:', dir, error);
    }
  }
  scanDirectory(contentDir);
  return paths;
}

// Utility function to get a random poem path
export function getRandomPoemPath(): string | null {
  const poemPaths = getAllPoemPaths();
  if (poemPaths.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * poemPaths.length);
  return poemPaths[randomIndex];
}
