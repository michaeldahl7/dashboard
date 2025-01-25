import type { ComponentProps } from 'react';

import { cn } from '@ui/lib/utils';

function Heading1({ className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}

function Heading2({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0',
        className
      )}
      {...props}
    />
  );
}

function Heading3({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 font-semibold text-2xl tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function Heading4({ className, ...props }: ComponentProps<'h4'>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 font-semibold text-xl tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function Paragraph({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('not-first:mt-6 leading-7', className)} {...props} />;
}

function Blockquote({ className, ...props }: ComponentProps<'blockquote'>) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  );
}

const Typography = {
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  H4: Heading4,
  P: Paragraph,
  Blockquote,
};

export { Typography };
