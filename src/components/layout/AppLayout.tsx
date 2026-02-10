import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <ChatbotWidget />
    </div>
  );
}
