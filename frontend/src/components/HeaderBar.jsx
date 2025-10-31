import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";
import {TypographyLead, TypographyMuted} from "@/components/ui/typography";
import {Container} from '@/components/ui/container.jsx'

const HeaderBar = () => {
  const {user, logout} = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  // New state for header visibility and last scroll position
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [{
    key: "transactions",
    to: "/transactions",
    label: "Transactions",
    roles: ["admin", "editor", "reader"]
  }, {key: "reports", to: "/reports", label: "Reports", roles: ["admin", "editor", "reader"]}, {
    key: "users",
    to: "/users",
    label: "Users",
    roles: ["admin"]
  },];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)"); // md breakpoint
    setIsMobile(mediaQuery.matches);

    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!user) {
    return null; // Do not render header if not logged in
  }

  const filteredLinks = navLinks.filter((link) => link.roles.includes(user.role));

  return (
    <header
      className={`border-b bg-background/80 backdrop-blur sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <Container>
        <div className="flex items-center py-4 justify-between">
          {/* Brand */}
          <Link to="/" className="text-lg font-semibold">
            <TypographyLead>Nidhi Pushtika</TypographyLead>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6">
            {filteredLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium hover:underline ${
                  location.pathname === link.to ? "underline" : ""
                }`}
              >
                <TypographyMuted>{link.label}</TypographyMuted>
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
            ) : (
              <>
                <TypographyMuted className="text-sm">
                  Signed in as: <strong>{user.name}</strong>
                </TypographyMuted>
                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            )}

            {/* Hamburger Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex flex-col gap-4 p-6"
                aria-labelledby="sheet-title"
              >
                <h2 id="sheet-title" className="sr-only">
                  Navigation menu
                </h2>
                {filteredLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium hover:underline"
                  >
                    <TypographyMuted>{link.label}</TypographyMuted>
                  </Link>
                ))}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default HeaderBar;
