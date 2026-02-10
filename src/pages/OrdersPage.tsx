import { Package, Phone, User as UserIcon, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { orders } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Order & Installation Tracking", "تتبع الطلبات والتركيب")}</h1>

      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{order.id} — {t(order.type, order.typeAr)}</CardTitle>
              <Badge variant="outline" className="text-info border-info/20 text-[10px]">{t("In Progress", "قيد التنفيذ")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.service}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step progress bar */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center min-w-[500px]">
                {order.steps.map((step, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center text-center">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                        step.completed
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      )}>
                        {step.completed ? <Check className="h-4 w-4" /> : i + 1}
                      </div>
                      <p className={cn("text-[10px] mt-1 max-w-[70px]", step.completed ? "font-medium" : "text-muted-foreground")}>
                        {t(step.label, step.labelAr)}
                      </p>
                      {step.date && <p className="text-[9px] text-muted-foreground">{step.date}</p>}
                    </div>
                    {i < order.steps.length - 1 && (
                      <div className={cn("flex-1 h-0.5 mx-1", step.completed ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technician info */}
            {order.technician && (
              <Card className="bg-muted/50">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t(order.technician.name, order.technician.nameAr)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {order.technician.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Audit trail */}
            <div>
              <p className="text-sm font-medium mb-2">{t("Order Timeline", "الجدول الزمني للطلب")}</p>
              <div className="space-y-2">
                {order.steps.filter((s) => s.completed).map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm">{t(step.label, step.labelAr)}</p>
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
