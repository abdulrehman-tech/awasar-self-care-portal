import { useState } from "react";
import { Notification, TickCircle, Card as CardIcon, Wifi, Warning2, MessageQuestion, Box } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { notifications } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, any> = { billing: CardIcon, service: Wifi, outage: Warning2, ticket: MessageQuestion, order: Box };

export default function NotificationsPage() {
  const { t, dir } = useLanguage();
  const [items, setItems] = useState(notifications);

  const markAllRead = () => setItems(items.map((n) => ({ ...n, read: true })));
  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("Notifications", "الإشعارات")}</h1>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground">{unreadCount} {t("unread", "غير مقروءة")}</p>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <TickCircle size={16} className="me-1" />{t("Mark all read", "تحديد الكل كمقروء")}
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" dir={dir}>
        <TabsList>
          <TabsTrigger value="all">{t("All", "الكل")}</TabsTrigger>
          <TabsTrigger value="billing">{t("Billing", "الفواتير")}</TabsTrigger>
          <TabsTrigger value="service">{t("Service", "الخدمات")}</TabsTrigger>
          <TabsTrigger value="outage">{t("Outage", "الانقطاع")}</TabsTrigger>
        </TabsList>

        {["all", "billing", "service", "outage", "ticket", "order"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-2 mt-4">
            {items
              .filter((n) => tab === "all" || n.category === tab)
              .map((notification) => {
                const Icon = categoryIcons[notification.category] || Notification;
                return (
                  <Card key={notification.id} className={cn(!notification.read && "border-primary/20 bg-primary/5")}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{t(notification.title, notification.titleAr)}</p>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{t(notification.message, notification.messageAr)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
