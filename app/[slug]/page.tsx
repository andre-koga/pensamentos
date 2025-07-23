import { notFound } from 'next/navigation';
import { readdirSync, readFileSync } from 'fs';
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

interface PoemPageProps {
  params: Promise<{ slug: string }>;
}

// Function to get all content files and their metadata
function getAllContent() {
  const contentDir = join(process.cwd(), 'content');
  const files: Array<{
    slug: string;
    frontmatter: any;
    content: string;
    filePath: string;
  }> = [];

  function scanDirectory(dir: string) {
    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);

        if (item.endsWith('.mdx')) {
          try {
            const fileContent = readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContent);
            const slug = data.slug || item.replace('.mdx', '');

            files.push({
              slug,
              frontmatter: data,
              content,
              filePath: fullPath,
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

// Function to get content by slug
function getContentBySlug(slug: string) {
  const allContent = getAllContent();
  return allContent.find((content) => content.slug === slug);
}

export async function generateStaticParams() {
  const allContent = getAllContent();
  return allContent.map((content) => ({
    slug: content.slug,
  }));
}

export async function generateMetadata({ params }: PoemPageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    return {
      title: 'Poem Not Found',
      description: 'The requested poem could not be found.',
    };
  }

  const { frontmatter } = content;

  return {
    title: `${frontmatter.title || slug} | Pensamentos`,
    description:
      frontmatter.description || `A poem titled "${frontmatter.title || slug}"`,
    keywords: frontmatter.tags ? frontmatter.tags.join(', ') : undefined,
    openGraph: {
      title: frontmatter.title || slug,
      description:
        frontmatter.description ||
        `A poem titled "${frontmatter.title || slug}"`,
      type: 'article',
      publishedTime: frontmatter.date,
      tags: frontmatter.tags,
    },
  };
}

export default async function PoemPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  const { frontmatter, content: mdxContent } = content;

  return (
    <SidebarProvider>
      <AppSidebar />
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
            {/* Poem metadata */}
            {frontmatter.date && (
              <div className="text-muted-foreground mb-4 text-sm">
                {new Date(frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}

            {/* Render MDX content */}
            <MDXRemote source={mdxContent} />

            {/* Tags */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="mt-8 border-t pt-4">
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
