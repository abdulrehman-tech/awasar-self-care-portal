import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Layers, CreditCard, LifeBuoy, MoreHorizontal, User, Wifi, BookOpen, Bell, LogOut, Package, ClipboardList } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

const mainTabs = [
  { path: "/", icon: Home, labelEn: "Home", labelAr: "الرئيسية" },
  { path: "/services", icon: Layers, labelEn: "Services", labelAr: "خدماتي" },
  { path: "/billing", icon: CreditCard, labelEn: "Pay", labelAr: "الدفع" },
  { path: "/support", icon: LifeBuoy, labelEn: "Support", labelAr: "الدعم" },
];

const moreItems = [
  { path: "/profile", icon: User, labelEn: "Profile", labelAr: "الملف الشخصي" },
  { path: "/requests", icon: ClipboardList, labelEn: "Requests", labelAr: "الطلبات" },
  { path: "/orders", icon: Package, labelEn: "Orders", labelAr: "الطلبات" },
  { path: "/network-status", icon: Wifi, labelEn: "Network Status", labelAr: "حالة الشبكة" },
  { path: "/knowledge-base", icon: BookOpen, labelEn: "Knowledge Base", labelAr: "قاعدة المعرفة" },
  { path: "/notifications", icon: Bell, labelEn: "Notifications", labelAr: "الإشعارات" },
  { path: "/catalog", icon: Package, labelEn: "Products", labelAr: "المنتجات" },
];

export default function BottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  const isMoreActive = moreItems.some((item) => location.pathname === item.path);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex items-center justify-around h-16">
          {mainTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[56px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t(tab.labelEn, tab.labelAr)}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[56px]",
              isMoreActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">{t("More", "المزيد")}</span>
          </button>
        </div>
      </nav>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("More Options", "خيارات أخرى")}</DrawerTitle>
            <DrawerDescription>{t("Access additional features", "الوصول إلى ميزات إضافية")}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8 grid grid-cols-3 gap-3">
            {moreItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">{t(item.labelEn, item.labelAr)}</span>
              </Link>
            ))}
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <span className="text-xs font-medium">{t("Logout", "تسجيل الخروج")}</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
