import AppHeader from "./AppHeader";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default AppShell;