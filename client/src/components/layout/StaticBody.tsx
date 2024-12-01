export function StaticBody({ children }: { children: React.ReactNode }) {
  return <div className="h-[calc(100vh-67px)] w-full flex">{children}</div>;
}

export function StaticBodyCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-67px)] w-full flex items-center justify-center">
      {children}
    </div>
  );
}
