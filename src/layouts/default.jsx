import { Outlet, NavLink } from "react-router-dom";
import { useSupabase } from "@/integrations/supabase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { session, supabase } = useSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="flex flex-col min-h-screen overflow-auto items-center justify-center p-4">
      <nav className="flex space-x-4 mb-4">
        <NavLink to="/" className={({ isActive }) => cn("text-blue-500", isActive && "font-bold")}>Home</NavLink>
        {!session ? (
          <>
            <NavLink to="/sign-up" className={({ isActive }) => cn("text-blue-500", isActive && "font-bold")}>Sign Up</NavLink>
            <NavLink to="/sign-in" className={({ isActive }) => cn("text-blue-500", isActive && "font-bold")}>Sign In</NavLink>
          </>
        ) : (
          <Button onClick={handleSignOut} className="text-blue-500">Sign Out</Button>
        )}
      </nav>
      <Outlet />
    </main>
  );
};

export default Layout;