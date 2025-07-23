import { notFound } from 'next/navigation';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { AppSidebar } from '@/components/app-sidebar';
import { AppBreadcrumbs } from '@/components/app-breadcrumbs';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getContentTree, getRecentlyModified } from '@/lib/content-utils';

interface PoemPageProps {
  params: { slug: string[] };
}

interface ContentFile {
  path: string[];
  frontmatter: any;
  content: string;
  filePath: string;
  created: Date;
  modified: Date;
}

// Function to recursively scan content directory and build URL mappings
function getAllContent(): ContentFile[] {
  const contentDir = join(process.cwd(), 'content');
  const files: ContentFile[] = [];

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
            const fileContent = readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContent);

            // Create URL path from file structure
            const fileName = item.replace('.mdx', '');
            const urlPath = [...relativePath, fileName];

            // Get file system dates
            const stats = statSync(fullPath);
            const created = data.created
              ? new Date(data.created)
              : stats.birthtime;
            const modified = data.modified
              ? new Date(data.modified)
              : stats.mtime;

            files.push({
              path: urlPath,
              frontmatter: { ...data, created, modified },
              content,
              filePath: fullPath,
              created,
              modified,
            });
          } catch (error) {
            console.error('Error parsing file:', fullPath, error);
          }
        }
      }
    } catch (error) {
      console.error('Error reading directory:', dir, error);
    }
  }

  scanDirectory(contentDir);
  return files;
}

// Function to get content by URL path
function getContentByPath(slugPath: string[]): ContentFile | undefined {
  const allContent = getAllContent();
  return allContent.find((content) => {
    return (
      content.path.length === slugPath.length &&
      content.path.every((segment, index) => segment === slugPath[index])
    );
  });
}

// Format date in "Jan 15, 2024" format
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateStaticParams() {
  const allContent = getAllContent();
  return allContent.map((content) => ({
    slug: content.path,
  }));
}

export async function generateMetadata({ params }: PoemPageProps) {
  const { slug } = params;
  const content = getContentByPath(slug);

  if (!content) {
    return {
      title: 'Poem Not Found',
      description: 'The requested poem could not be found.',
    };
  }

  const { frontmatter } = content;
  const title = frontmatter.title || slug.join(' / ');

  return {
    title: `${title} | Pensamentos`,
    description: frontmatter.description || `A poem titled "${title}"`,
    openGraph: {
      title,
      description: frontmatter.description || `A poem titled "${title}"`,
      type: 'article',
      publishedTime: content.created.toISOString(),
      modifiedTime: content.modified.toISOString(),
    },
  };
}

export default async function PoemPage({ params }: PoemPageProps) {
  const { slug } = params;
  const content = getContentByPath(slug);

  if (!content) {
    notFound();
  }

  const { frontmatter, content: mdxContent, created, modified } = content;
  const contentTree = getContentTree();
  const recentlyModified = getRecentlyModified();

  return (
    <>
      <AppSidebar
        contentTree={contentTree}
        recentlyModified={recentlyModified}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <AppBreadcrumbs />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            {/* Poem dates */}
            <div className="text-muted-foreground mb-4 text-sm">
              Created: {formatDate(created)}
              {created.getTime() !== modified.getTime() && (
                <> • Last modified: {formatDate(modified)}</>
              )}
            </div>

            {/* Render MDX content */}
            <MDXRemote source={mdxContent} />
          </article>
        </div>
      </SidebarInset>
    </>
  );
}
