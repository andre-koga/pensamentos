import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface ContentItem {
  title: string;
  path: string[];
  created: Date;
  modified: Date;
  description?: string;
}

// Function to recursively scan content directory and build tree structure for sidebar
export function getContentTree(): any[] {
  const contentDir = join(process.cwd(), 'content');

  function scanDirectory(dir: string, relativePath: string[] = []): any[] {
    try {
      const items = readdirSync(dir);
      const directories: string[] = [];
      const files: string[] = [];

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          directories.push(item);
        } else if (item.endsWith('.mdx')) {
          files.push(item);
        }
      }

      directories.sort();
      files.sort();

      const result: any[] = [];

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
        const fileName = file.replace('.mdx', '');
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
export function getAllContentItems(): ContentItem[] {
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
  return items;
}

// Function to get recently modified poems (last 5)
export function getRecentlyModified(): ContentItem[] {
  const allItems = getAllContentItems();
  return allItems
    .sort((a, b) => b.modified.getTime() - a.modified.getTime())
    .slice(0, 5);
}
