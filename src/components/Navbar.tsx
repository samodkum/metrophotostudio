import { useState } from "react";
import { Camera, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { UserButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  onBookNow: () => void;
}

const Navbar = ({ onBookNow }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      // small delay to allow navigation before scrolling
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigate("/"); window.scrollTo(0, 0); }}>
          <Camera className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-gold-gradient">Metro Photo Studio</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            ["Home", "hero"],
            ["Gallery", "gallery"],
            ["Services", "services"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </button>
          ))}
          {isSignedIn && (
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm font-body font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
          )}
          {isSignedIn && (
            <SignOutButton>
              <button className="text-sm font-body font-medium text-foreground hover:text-destructive transition-colors flex items-center gap-1.5">
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </SignOutButton>
          )}
          <button
            onClick={onBookNow}
            className="bg-gold-gradient text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
          <div className="pl-2 border-l border-border/50">
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            {[
              ["Home", "hero"],
              ["Gallery", "gallery"],
              ["Services", "services"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {label}
              </button>
            ))}
            {isSignedIn && (
              <button
                onClick={() => { navigate("/dashboard"); setIsOpen(false); }}
                className="text-left font-medium text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
            )}
            <button
              onClick={() => { onBookNow(); setIsOpen(false); }}
              className="bg-gold-gradient text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold mt-2"
            >
              Book Now
            </button>
            {isSignedIn && (
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                <SignOutButton>
                  <button className="text-left font-medium text-foreground hover:text-destructive transition-colors py-2 flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </SignOutButton>
                <div className="flex justify-center mt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
