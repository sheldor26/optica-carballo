import Link from 'next/link';

export function AuthFormShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="border-border bg-background w-full max-w-md rounded-lg border p-6 shadow-sm md:p-8">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-6 inline-block text-sm font-medium tracking-tight"
      >
        ← Óptica Carballo
      </Link>
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      )}
      <div className="mt-6">{children}</div>
      {footer && (
        <div className="text-muted-foreground mt-6 text-sm">{footer}</div>
      )}
    </div>
  );
}
