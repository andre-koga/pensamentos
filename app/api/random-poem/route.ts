import { NextResponse } from 'next/server';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// Function to find all .mdx files in content directory and extract their slugs from frontmatter
function findContentPaths(contentDir: string): string[] {
  const paths: string[] = [];

  try {
    const items = readdirSync(contentDir);

    for (const item of items) {
      const fullPath = join(contentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        paths.push(...findContentPaths(fullPath));
      } else if (item.endsWith('.mdx')) {
        try {
          // Read the file and parse frontmatter
          const fileContent = readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContent);

          // Use the slug from frontmatter, fallback to filename without extension
          const slug = data.slug || item.replace('.mdx', '');
          paths.push(`/${slug}`);
        } catch (error) {
          console.error('Error parsing frontmatter for file:', fullPath, error);
          // Fallback to filename-based path if frontmatter parsing fails
          const slug = item.replace('.mdx', '');
          paths.push(`/${slug}`);
        }
      }
    }
  } catch (error) {
    console.error('Error reading content directory:', contentDir, error);
  }

  return paths;
}

export async function GET() {
  try {
    // Get the content directory path
    const contentDir = join(process.cwd(), 'content');

    // Find all MDX files and their slugs
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
