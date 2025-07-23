import { NextResponse } from 'next/server';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Function to recursively find all .mdx files in a directory
function findMdxFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules, .next, and other build directories
        if (
          !item.startsWith('.') &&
          ![
            'node_modules',
            'api',
            'globals.css',
            'layout.tsx',
            'page.tsx',
            'not-found.tsx',
          ].includes(item)
        ) {
          files.push(...findMdxFiles(fullPath, baseDir));
        }
      } else if (item.endsWith('.mdx')) {
        // Convert file path to URL path
        let relativePath = fullPath.replace(baseDir, '').replace(/\\/g, '/');

        // Remove .mdx extension
        relativePath = relativePath.replace('.mdx', '');

        // If the file is named 'page', remove '/page' from the end (Next.js app router convention)
        if (relativePath.endsWith('/page')) {
          relativePath = relativePath.replace('/page', '');
        }

        // Clean up leading slash and ensure proper format
        const urlPath = relativePath.replace(/^\//, '');
        files.push(urlPath ? `/${urlPath}` : '/');
      }
    }
  } catch (error) {
    console.error('Error reading directory:', dir, error);
  }

  return files;
}

export async function GET() {
  try {
    // Get the app directory path
    const appDir = join(process.cwd(), 'app');

    // Find all MDX files
    const mdxFiles = findMdxFiles(appDir);

    if (mdxFiles.length === 0) {
      return NextResponse.json({ error: 'No poems found' }, { status: 404 });
    }

    // Return a random poem path
    const randomIndex = Math.floor(Math.random() * mdxFiles.length);
    const randomPoem = mdxFiles[randomIndex];

    return NextResponse.json({
      path: randomPoem,
      total: mdxFiles.length,
      available: mdxFiles,
    });
  } catch (error) {
    console.error('Error finding random poem:', error);
    return NextResponse.json(
      { error: 'Failed to find random poem' },
      { status: 500 }
    );
  }
}
