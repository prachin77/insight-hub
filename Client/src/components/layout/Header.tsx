import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, PenSquare, Bell, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-lg font-bold text-primary-foreground">I</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">Inkwell</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Explore
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Trending
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Tags
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Input
                  placeholder="Search articles..."
                  className="h-9 bg-secondary text-sm"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>

          {/* Write */}
          <Button size="sm" className="hidden gap-2 md:flex">
            <PenSquare className="h-4 w-4" />
            Write
          </Button>

          {/* Sign In */}
          <Button variant="outline" size="sm" className="hidden md:flex" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
              <a href="/" className="text-sm font-medium text-foreground">Home</a>
              <a href="#" className="text-sm font-medium text-muted-foreground">Explore</a>
              <a href="#" className="text-sm font-medium text-muted-foreground">Trending</a>
              <a href="#" className="text-sm font-medium text-muted-foreground">Tags</a>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1 gap-2">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
