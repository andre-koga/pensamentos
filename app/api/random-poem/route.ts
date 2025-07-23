import { NextResponse } from 'next/server';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// Function to find all .mdx files in content directory and map them to URL paths
function findContentPaths(contentDir: string): string[] {
  const paths: string[] = [];

  function scanDirectory(dir: string, relativePath: string[] = []) {
    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(fullPath, [...relativePath, item]);
        } else if (item.endsWith('.mdx')) {
          try {
            // Create URL path from file structure
            const fileName = item.replace('.mdx', '');
            const urlPath = [...relativePath, fileName];

            // Convert to URL string
            const pathString =
              urlPath.length > 0 ? `/${urlPath.join('/')}` : '/';
            paths.push(pathString);
          } catch (error) {
            console.error('Error processing file:', fullPath, error);
            // Fallback: use file path structure anyway
            const fileName = item.replace('.mdx', '');
            const urlPath = [...relativePath, fileName];
            const pathString =
              urlPath.length > 0 ? `/${urlPath.join('/')}` : '/';
            paths.push(pathString);
          }
        }
      }
    } catch (error) {
      console.error('Error reading content directory:', dir, error);
    }
  }

  scanDirectory(contentDir);
  return paths;
}

export async function GET() {
  try {
    // Get the content directory path
    const contentDir = join(process.cwd(), 'content');

    // Find all MDX files and their URL paths
    const poemPaths = findContentPaths(contentDir);

    if (poemPaths.length === 0) {
      return NextResponse.json({ error: 'No poems found' }, { status: 404 });
    }

    // Return a random poem path
    const randomIndex = Math.floor(Math.random() * poemPaths.length);
    const randomPoem = poemPaths[randomIndex];

    return NextResponse.json({
      path: randomPoem,
      total: poemPaths.length,
      available: poemPaths,
    });
  } catch (error) {
    console.error('Error finding random poem:', error);
    return NextResponse.json(
      { error: 'Failed to find random poem' },
      { status: 500 }
    );
  }
}
