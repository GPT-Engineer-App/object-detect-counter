import { Outlet, NavLink } from "react-router-dom";
import { useSupabase } from "@/integrations/supabase";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const { session, supabase } = useSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="flex flex-col min-h-screen overflow-auto items-center justify-center">
      <nav className="flex space-x-4">
        <NavLink to="/" className="text-blue-500">Home</NavLink>
        {!session ? (
          <>
            <NavLink to="/sign-up" className="text-blue-500">Sign Up</NavLink>
            <NavLink to="/sign-in" className="text-blue-500">Sign In</NavLink>
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