import { Link } from "react-router-dom";
import { Card as CardIcon, MessageQuestion, Box, Flash, Wifi, ClipboardText, ArrowRight2, LocationTick, ArrowDown, ArrowUp, MoneyRecive } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { customer, services, invoices, usageData, monthlyUsage, recentActivity, promotions } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import promoIllustration from "@/assets/promo-illustration.png";
import OmrSymbol from "@/components/OmrSymbol";

export default function Dashboard() {
  const { t } = useLanguage();
  const outstandingBalance = invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);
  const activeServicesCount = services.filter((s) => s.status === "active").length;
  const downloadUsage = usageData.find((u) => u.name === "Download")!;
  const uploadUsage = usageData.find((u) => u.name === "Upload")!;
  const currentPlan = services.find((s) => s.type === "internet");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("Good morning", "صباح الخير") : hour < 17 ? t("Good afternoon", "مساء الخير") : t("Good evening", "مساء الخير");

  const quickActions = [
    { to: "/billing", icon: CardIcon, labelEn: "Pay Bill", labelAr: "دفع الفاتورة", color: "bg-primary/8 text-primary" },
    { to: "/support", icon: MessageQuestion, labelEn: "Support", labelAr: "الدعم", color: "bg-warning/8 text-warning" },
    { to: "/orders", icon: Box, labelEn: "Orders", labelAr: "الطلبات", color: "bg-info/8 text-info" },
    { to: "/catalog", icon: LocationTick, labelEn: "Plans", labelAr: "الباقات", color: "bg-secondary/8 text-secondary" },
    { to: "/requests", icon: ClipboardText, labelEn: "Requests", labelAr: "طلباتي", color: "bg-success/8 text-success" },
    { to: "/network-status", icon: Wifi, labelEn: "Network", labelAr: "الشبكة", color: "bg-destructive/8 text-destructive" },
  ];

  return (
    <div className="space-y-5">
      {/* Hero Card */}
      <div className="gradient-primary rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative">
          <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{greeting}</p>
          <h1 className="text-lg font-semibold mt-1">{t(customer.name, customer.nameAr)}</h1>
          {currentPlan && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                <Wifi size={12} />
                {currentPlan.name} • {currentPlan.speed}
              </span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowDown size={12} className="opacity-70" />
              </div>
              <p className="text-lg font-bold tabular-nums">{downloadUsage.value}</p>
              <p className="text-[10px] opacity-60 mt-0.5">GB {t("this month", "هذا الشهر")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowUp size={12} className="opacity-70" />
              </div>
              <p className="text-lg font-bold tabular-nums">{uploadUsage.value}</p>
              <p className="text-[10px] opacity-60 mt-0.5">GB {t("uploaded", "مرفوع")}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MoneyRecive size={12} className="opacity-70" />
              </div>
              <p className="text-lg font-bold tabular-nums">{outstandingBalance.toFixed(0)}</p>
              <p className="text-[10px] opacity-60 mt-0.5"><OmrSymbol /> {t("due", "مستحق")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card card-shadow hover:card-shadow-md transition-all duration-200 cursor-pointer text-center group">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${action.color} transition-transform duration-200 group-hover:scale-105`}>
                <action.icon size={18} variant="Bold" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight">{t(action.labelEn, action.labelAr)}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Promo Banner */}
      {promotions.length > 0 && (
        <Link to="/catalog" className="block">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-secondary/10 via-secondary/5 to-primary/5 border border-secondary/10 hover:border-secondary/20 transition-all duration-300 group">
            <div className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">{t("Limited Offer", "عرض محدود")}</span>
                <p className="font-semibold text-sm mt-2 text-foreground">{t(promotions[0].title, promotions[0].titleAr)}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t(promotions[0].description, promotions[0].descriptionAr)}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-secondary group-hover:gap-2 transition-all">
                  {t("View offer", "عرض التفاصيل")} <ArrowRight2 size={12} />
                </div>
              </div>
              <img src={promoIllustration} alt="" className="h-20 w-20 object-contain shrink-0 opacity-80 group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      )}

      {/* Current Plan + Usage */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{t("Your Usage", "استهلاكك")}</h2>
          <Badge variant="outline" className="text-[10px] text-success border-success/20 font-medium">{t("Unlimited Data", "بيانات غير محدودة")}</Badge>
        </div>
        <Card className="card-shadow border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <ArrowDown size={16} className="text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{t("Download", "تحميل")}</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{downloadUsage.value}<span className="text-sm font-normal text-muted-foreground ms-1">GB</span></p>
                <p className="text-[10px] text-muted-foreground mt-1">{t("This month", "هذا الشهر")}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary/8 flex items-center justify-center">
                    <ArrowUp size={16} className="text-secondary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{t("Upload", "رفع")}</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{uploadUsage.value}<span className="text-sm font-normal text-muted-foreground ms-1">GB</span></p>
                <p className="text-[10px] text-muted-foreground mt-1">{t("This month", "هذا الشهر")}</p>
              </div>
            </div>
            {/* Mini sparkline */}
            <div className="h-24 px-2 pb-2 -mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyUsage} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sparkDl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(316, 70%, 41%)" stopOpacity={0.15}/>
                      <stop offset="100%" stopColor="hsl(316, 70%, 41%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="download" stroke="hsl(316, 70%, 41%)" fill="url(#sparkDl)" strokeWidth={1.5} dot={false} />
                  <Area type="monotone" dataKey="upload" stroke="hsl(202, 90%, 43%)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Services */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{t("Active Services", "الخدمات النشطة")}</h2>
          <Link to="/services" className="text-xs text-primary font-medium">{t("Manage", "إدارة")}</Link>
        </div>
        <div className="space-y-3">
          {services.filter(s => s.status === "active").map((service) => (
            <Link key={service.id} to="/services" className="block">
              <Card className="card-shadow border-0 hover:card-shadow-md transition-all duration-200 mb-0">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    service.type === "internet" ? "bg-primary/8" : service.type === "tv" ? "bg-secondary/8" : "bg-success/8"
                  }`}>
                    {service.type === "internet" && <Wifi size={18} className="text-primary" variant="Bold" />}
                    {service.type === "tv" && <Flash size={18} className="text-secondary" variant="Bold" />}
                    {service.type === "addon" && <Box size={18} className="text-success" variant="Bold" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{t(service.name, service.nameAr)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {service.speed ? `${service.speed} • ` : ""}{service.monthlyCost > 0 ? <>{service.monthlyCost} <OmrSymbol />/{t("mo", "شهر")}</> : t("Included", "مشمول")}
                    </p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-success shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Outstanding Balance Card */}
      {outstandingBalance > 0 && (
        <Card className="card-shadow border-0 bg-gradient-to-r from-warning/5 to-transparent">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <MoneyRecive size={20} className="text-warning" variant="Bold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium">{t("Outstanding Balance", "الرصيد المستحق")}</p>
              <p className="text-lg font-bold text-foreground">{outstandingBalance.toFixed(2)} <span className="text-xs font-normal text-muted-foreground"><OmrSymbol /></span></p>
            </div>
            <Link to="/billing">
              <Button size="sm" className="rounded-xl text-xs h-9 px-4">{t("Pay Now", "ادفع الآن")}</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{t("Recent Activity", "النشاط الأخير")}</h2>
          <Link to="/notifications" className="text-xs text-primary font-medium">{t("View All", "عرض الكل")}</Link>
        </div>
        <Card className="card-shadow border-0">
          <CardContent className="p-1">
            {recentActivity.slice(0, 4).map((item, index) => (
              <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors ${index < recentActivity.slice(0, 4).length - 1 ? '' : ''}`}>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === "payment" ? "bg-success/8" : item.type === "ticket" ? "bg-warning/8" : item.type === "service" ? "bg-secondary/8" : item.type === "order" ? "bg-info/8" : "bg-primary/8"
                }`}>
                  {item.type === "payment" && <CardIcon size={16} className="text-success" variant="Bold" />}
                  {item.type === "ticket" && <MessageQuestion size={16} className="text-warning" variant="Bold" />}
                  {item.type === "service" && <Flash size={16} className="text-secondary" variant="Bold" />}
                  {item.type === "order" && <Box size={16} className="text-info" variant="Bold" />}
                  {item.type === "billing" && <CardIcon size={16} className="text-primary" variant="Bold" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-foreground leading-snug">{t(item.description, item.descriptionAr)}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
