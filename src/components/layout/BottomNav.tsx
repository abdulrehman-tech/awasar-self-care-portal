import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home2, Layer, Card as CardIcon, MessageQuestion, More,
  User, Wifi, Book, Notification, Logout, Box, ClipboardText
} from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const mainTabs = [
  { path: "/", icon: Home2, labelEn: "Home", labelAr: "الرئيسية" },
  { path: "/services", icon: Layer, labelEn: "Services", labelAr: "خدماتي" },
  { path: "/billing", icon: CardIcon, labelEn: "Pay", labelAr: "الدفع" },
  { path: "/support", icon: MessageQuestion, labelEn: "Support", labelAr: "الدعم" },
];

const moreItems = [
  { path: "/profile", icon: User, labelEn: "Profile", labelAr: "الملف الشخصي" },
  { path: "/requests", icon: ClipboardText, labelEn: "Requests", labelAr: "الطلبات" },
  { path: "/orders", icon: Box, labelEn: "Orders", labelAr: "الطلبات" },
  { path: "/network-status", icon: Wifi, labelEn: "Network Status", labelAr: "حالة الشبكة" },
  { path: "/knowledge-base", icon: Book, labelEn: "Knowledge Base", labelAr: "قاعدة المعرفة" },
  { path: "/notifications", icon: Notification, labelEn: "Notifications", labelAr: "الإشعارات" },
  { path: "/catalog", icon: Box, labelEn: "Products", labelAr: "المنتجات" },
];

export default function BottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    setShowLogout(false);
    setDrawerOpen(false);
    toast({ title: t("Logged out", "تم تسجيل الخروج") });
    setTimeout(() => navigate("/login"), 500);
  };

  const isMoreActive = moreItems.some((item) => location.pathname === item.path);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border">
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
                <tab.icon size={20} variant={isActive ? "Bold" : "Linear"} />
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
            <More size={20} variant={isMoreActive ? "Bold" : "Linear"} />
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
                  <item.icon size={20} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-center">{t(item.labelEn, item.labelAr)}</span>
              </Link>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogout(true);
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Logout size={20} className="text-destructive" />
              </div>
              <span className="text-xs font-medium">{t("Logout", "تسجيل الخروج")}</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Logout Confirmation */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("Logout", "تسجيل الخروج")}</DialogTitle>
            <DialogDescription>{t("Are you sure you want to log out?", "هل أنت متأكد أنك تريد تسجيل الخروج؟")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowLogout(false)}>{t("Cancel", "إلغاء")}</Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <Logout size={14} className="me-1" />{t("Logout", "تسجيل الخروج")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
