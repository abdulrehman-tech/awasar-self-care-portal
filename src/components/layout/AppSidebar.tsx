import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Layers, CreditCard, LifeBuoy, Package, Wifi, Bell,
  BookOpen, MapPin, User, Settings, LogOut, ChevronLeft, ChevronRight,
  ClipboardList, MessageSquare
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, labelEn: "Dashboard", labelAr: "الرئيسية" },
  { path: "/services", icon: Layers, labelEn: "My Services", labelAr: "خدماتي" },
  { path: "/billing", icon: CreditCard, labelEn: "Billing", labelAr: "الفواتير" },
  { path: "/requests", icon: ClipboardList, labelEn: "Requests", labelAr: "الطلبات" },
  { path: "/support", icon: LifeBuoy, labelEn: "Support", labelAr: "الدعم" },
  { path: "/knowledge-base", icon: BookOpen, labelEn: "Knowledge Base", labelAr: "قاعدة المعرفة" },
  { path: "/orders", icon: Package, labelEn: "Orders", labelAr: "الطلبات" },
  { path: "/network-status", icon: Wifi, labelEn: "Network Status", labelAr: "حالة الشبكة" },
  { path: "/catalog", icon: MapPin, labelEn: "Products", labelAr: "المنتجات" },
];

const bottomItems = [
  { path: "/profile", icon: User, labelEn: "Profile", labelAr: "الملف الشخصي" },
  { path: "/notifications", icon: Bell, labelEn: "Notifications", labelAr: "الإشعارات" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-200 sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            Awasr
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary" />
              )}
              <item.icon className="h-5 w-5 shrink-0" />
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
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t(item.labelEn, item.labelAr)}</span>}
            </Link>
          );
        })}
        <button className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
          <LogOut className="h-5 w-5 shrink-0" />
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
