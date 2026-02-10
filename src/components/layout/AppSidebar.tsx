import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home2, Layer, Card as CardIcon, MessageQuestion, Box, Wifi,
  Notification, Book, LocationTick, User, Setting2, Logout,
  ArrowLeft2, ArrowRight2, ClipboardText
} from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import awasrLogo from "@/assets/awasr-logo.png";

const navItems = [
  { path: "/", icon: Home2, labelEn: "Dashboard", labelAr: "الرئيسية" },
  { path: "/services", icon: Layer, labelEn: "My Services", labelAr: "خدماتي" },
  { path: "/billing", icon: CardIcon, labelEn: "Billing", labelAr: "الفواتير" },
  { path: "/requests", icon: ClipboardText, labelEn: "Requests", labelAr: "الطلبات" },
  { path: "/support", icon: MessageQuestion, labelEn: "Support", labelAr: "الدعم" },
  { path: "/knowledge-base", icon: Book, labelEn: "Knowledge Base", labelAr: "قاعدة المعرفة" },
  { path: "/orders", icon: Box, labelEn: "Orders", labelAr: "الطلبات" },
  { path: "/network-status", icon: Wifi, labelEn: "Network Status", labelAr: "حالة الشبكة" },
  { path: "/catalog", icon: LocationTick, labelEn: "Products", labelAr: "المنتجات" },
];

const bottomItems = [
  { path: "/profile", icon: User, labelEn: "Profile", labelAr: "الملف الشخصي" },
  { path: "/notifications", icon: Notification, labelEn: "Notifications", labelAr: "الإشعارات" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t, dir } = useLanguage();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-e border-border transition-all duration-200 sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <img src={awasrLogo} alt="Awasr" className="h-8 w-auto object-contain" />
        )}
        {collapsed && (
          <img src={awasrLogo} alt="Awasr" className="h-7 w-7 object-cover rounded" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          {dir === "rtl"
            ? (collapsed ? <ArrowLeft2 size={16} /> : <ArrowRight2 size={16} />)
            : (collapsed ? <ArrowRight2 size={16} /> : <ArrowLeft2 size={16} />)
          }
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors relative",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute start-0 top-1 bottom-1 w-[3px] rounded-full bg-primary" />
              )}
              <item.icon size={20} variant={isActive ? "Bold" : "Linear"} className="shrink-0" />
              {!collapsed && <span>{t(item.labelEn, item.labelAr)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border py-2">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} variant={isActive ? "Bold" : "Linear"} className="shrink-0" />
              {!collapsed && <span>{t(item.labelEn, item.labelAr)}</span>}
            </Link>
          );
        })}
        <button className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
          <Logout size={20} className="shrink-0" />
          {!collapsed && <span>{t("Logout", "تسجيل الخروج")}</span>}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{t("Ahmed Al-Balushi", "أحمد البلوشي")}</p>
              <p className="text-xs text-muted-foreground truncate">AWR-98765432</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}