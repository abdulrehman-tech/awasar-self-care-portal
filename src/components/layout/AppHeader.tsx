import { Notification, SearchNormal, Global, User } from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { notifications } from "@/data/mockData";
import awasrLogo from "@/assets/awasr-logo.png";

export default function AppHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-14 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Logo (mobile only) */}
      <div className="md:hidden">
        <img src={awasrLogo} alt="Awasr" className="h-7 w-auto object-contain" />
      </div>

      {/* Search (desktop) */}
      <div className="hidden md:flex items-center gap-2 bg-muted rounded-md px-3 py-1.5 w-72">
        <SearchNormal size={16} className="text-muted-foreground" />
        <input
          type="text"
          placeholder={t("Search...", "بحث...")}
          className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          <Global size={16} />
          <span className="hidden sm:inline">{language === "en" ? "عربي" : "EN"}</span>
        </button>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <Notification size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User avatar */}
        <Link
          to="/profile"
          className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-medium"
        >
          A
        </Link>
      </div>
    </header>
  );
}
