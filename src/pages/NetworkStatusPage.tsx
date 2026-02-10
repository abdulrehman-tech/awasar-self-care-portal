import { Wifi, Warning2, Clock, Notification } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { networkStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function NetworkStatusPage() {
  const { t } = useLanguage();

  const statusConfig = {
    operational: { color: "bg-success", label: t("Operational", "يعمل"), badge: "text-success border-success/20" },
    degraded: { color: "bg-warning", label: t("Degraded", "متدهور"), badge: "text-warning border-warning/20" },
    outage: { color: "bg-destructive", label: t("Outage", "انقطاع"), badge: "text-destructive border-destructive/20" },
  };

  const outages = networkStatus.filter((n) => n.status !== "operational");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Network Status", "حالة الشبكة")}</h1>

      {/* Active outages */}
      {outages.length > 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Warning2 size={16} className="text-warning" />
              {t("Active Issues", "مشاكل نشطة")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {outages.map((n) => (
              <div key={n.region} className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{t(n.region, n.regionAr)}</p>
                  <p className="text-xs text-muted-foreground">{n.issue && t(n.issue, n.issueAr || "")}</p>
                  {"eta" in n && n.eta && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock size={12} /> {t("Est. resolution:", "الحل المتوقع:")} {new Date(n.eta as string).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className={cn("text-[10px]", statusConfig[n.status].badge)}>
                  {statusConfig[n.status].label}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All regions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Regional Status", "حالة المناطق")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {networkStatus.map((n) => (
              <div key={n.region} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2.5 w-2.5 rounded-full", statusConfig[n.status].color)} />
                  <div>
                    <p className="text-sm font-medium">{t(n.region, n.regionAr)}</p>
                    <p className="text-xs text-muted-foreground">{statusConfig[n.status].label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Notification size={14} className="text-muted-foreground" />
                    <Switch />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planned maintenance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Planned Maintenance", "الصيانة المخططة")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-3 border-b border-border">
            <p className="text-sm font-medium">{t("Al Khuwair Area Fiber Upgrade", "ترقية الألياف في منطقة الخوير")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("August 10, 2024 — 2:00 AM to 4:00 AM", "10 أغسطس 2024 — 2:00 ص إلى 4:00 ص")}</p>
            <p className="text-xs text-muted-foreground">{t("Brief service interruption expected", "من المتوقع انقطاع قصير في الخدمة")}</p>
          </div>
          <div className="py-3">
            <p className="text-sm font-medium">{t("Salalah Network Optimization", "تحسين شبكة صلالة")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("August 15, 2024 — 1:00 AM to 3:00 AM", "15 أغسطس 2024 — 1:00 ص إلى 3:00 ص")}</p>
            <p className="text-xs text-muted-foreground">{t("No service impact expected", "لا يتوقع أي تأثير على الخدمة")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
