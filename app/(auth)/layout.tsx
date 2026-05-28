export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-12">
      {children}
    </main>
  );
}
