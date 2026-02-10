import { Wifi, Monitor, Call, Box, Add } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { services, plans } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = { internet: Wifi, tv: Monitor, voice: Call, bundle: Box };

export default function MyServices() {
  const { t } = useLanguage();

  const statusColor = (s: string) =>
    s === "active" ? "bg-success/10 text-success border-success/20" :
    s === "suspended" ? "bg-warning/10 text-warning border-warning/20" :
    "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("My Services", "خدماتي")}</h1>
        <Button size="sm"><Add size={16} className="mr-1" />{t("Add Service", "إضافة خدمة")}</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("All", "الكل")}</TabsTrigger>
          <TabsTrigger value="internet">{t("Internet", "الإنترنت")}</TabsTrigger>
          <TabsTrigger value="tv">{t("TV", "التلفزيون")}</TabsTrigger>
          <TabsTrigger value="voice">{t("Voice", "الصوت")}</TabsTrigger>
        </TabsList>

        {["all", "internet", "tv", "voice"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
            {services
              .filter((s) => tab === "all" || s.type === tab)
              .map((service) => {
                const Icon = typeIcons[service.type] || Box;
                return (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon size={20} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{t(service.name, service.nameAr)}</h3>
                            {service.speed && <p className="text-xs text-muted-foreground">{service.speed}</p>}
                            <Badge variant="outline" className={cn("mt-1 text-[10px]", statusColor(service.status))}>
                              {t(service.status.charAt(0).toUpperCase() + service.status.slice(1),
                                service.status === "active" ? "نشط" : "معلق")}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{service.monthlyCost.toFixed(2)} <span className="text-xs text-muted-foreground">{t("OMR/mo", "ر.ع/شهر")}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="text-xs">{t("Manage", "إدارة")}</Button>
                        <Button variant="outline" size="sm" className="text-xs">{t("Upgrade", "ترقية")}</Button>
                        <Button variant="ghost" size="sm" className="text-xs">{t("Request Change", "طلب تغيير")}</Button>
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
