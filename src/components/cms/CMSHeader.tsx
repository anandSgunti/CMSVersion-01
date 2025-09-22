import { Bell, Search, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CMSHeader() {
  return (
    <header className="h-16 border-b border-border bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search content..." 
            className="pl-10 bg-background border-border focus:shadow-elegant transition-smooth"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="hover:bg-accent/50 transition-smooth">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-accent/50 transition-smooth">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}