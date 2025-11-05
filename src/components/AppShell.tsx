import AppHeader from "./AppHeader";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="px-4 py-6">{children}</main>
    </div>
  );
};

export default AppShell;