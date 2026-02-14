export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-brand-gradient text-3xl font-bold">Maxogram</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Share moments, connect with friends
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
