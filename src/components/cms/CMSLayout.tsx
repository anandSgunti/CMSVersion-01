import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CMSSidebar } from "./CMSSidebar";
import { CMSHeader } from "./CMSHeader";

export function CMSLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CMSSidebar />
        <div className="flex-1 flex flex-col">
          <CMSHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}