import { cn } from '@/lib/utils'

type Props = React.HTMLAttributes<HTMLElement>

export function TypographyH1({ className, ...props }: Props) {
  return (
    <h1
      className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}
      {...props}
    />
  )
}

export function TypographyH2({ className, ...props }: Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    />
  )
}

export function TypographyH3({ className, ...props }: Props) {
  return (
    <h3
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

export function TypographyH4({ className, ...props }: Props) {
  return (
    <h4
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

export function TypographyP({ className, ...props }: Props) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props} />
  )
}

export function TypographyLead({ className, ...props }: Props) {
  return <p className={cn('text-xl text-muted-foreground', className)} {...props} />
}

export function TypographyLarge({ className, ...props }: Props) {
  return <div className={cn('text-lg font-semibold', className)} {...props} />
}

export function TypographySmall({ className, ...props }: Props) {
  return (
    <small className={cn('text-sm font-medium leading-none', className)} {...props} />
  )
}

export function TypographyMuted({ className, ...props }: Props) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function TypographyBlockquote({ className, ...props }: Props) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  )
}

export function TypographyCode({ className, ...props }: Props) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      {...props}
    />
  )
}
