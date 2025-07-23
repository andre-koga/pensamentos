'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shuffle, Loader2 } from 'lucide-react';

interface RandomPoemButtonProps {
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export function RandomPoemButton({
  variant = 'outline',
  size = 'lg',
  className,
  children = (
    <>
      <Shuffle className="mr-2 h-4 w-4" />
      Random Poem
    </>
  ),
}: RandomPoemButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomPoem = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/random-poem');
      const data = await response.json();

      if (response.ok && data.path) {
        router.push(data.path);
      } else {
        console.error('No poems found:', data.error);
        // Fallback to home if no poems are found
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching random poem:', error);
      // Fallback to home on error
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleRandomPoem}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Finding poem...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
