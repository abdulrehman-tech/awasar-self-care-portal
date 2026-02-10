import { Link } from "react-router-dom";
import { Card as CardIcon, MessageQuestion, Box, Eye, Flash, Wifi, Notification, ClipboardText, Add, ArrowRight2, LocationTick } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { customer, services, invoices, usageData, monthlyUsage, recentActivity, promotions } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import promoIllustration from "@/assets/promo-illustration.png";

export default function Dashboard() {
  const { t } = useLanguage();
  const outstandingBalance = invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);
  const activeServicesCount = services.filter((s) => s.status === "active").length;
  const downloadUsage = usageData.find((u) => u.name === "Data")!;
  const uploadUsage = usageData.find((u) => u.name === "Upload")!;
  const devicesUsage = usageData.find((u) => u.name === "Devices")!;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("Good morning", "صباح الخير") : hour < 17 ? t("Good afternoon", "مساء الخير") : t("Good evening", "مساء الخير");

  const quickActions = [
    { to: "/billing", icon: CardIcon, labelEn: "Pay Bill", labelAr: "دفع الفاتورة", color: "bg-primary/10 text-primary" },
    { to: "/support", icon: MessageQuestion, labelEn: "Get Support", labelAr: "الدعم", color: "bg-warning/10 text-warning" },
    { to: "/orders", icon: Box, labelEn: "Track Order", labelAr: "تتبع الطلب", color: "bg-info/10 text-info" },
    { to: "/catalog", icon: LocationTick, labelEn: "Browse Plans", labelAr: "تصفح الباقات", color: "bg-secondary/10 text-secondary" },
    { to: "/requests", icon: ClipboardText, labelEn: "My Requests", labelAr: "طلباتي", color: "bg-success/10 text-success" },
    { to: "/network-status", icon: Wifi, labelEn: "Network", labelAr: "الشبكة", color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="space-y-8">
      {/* Personalized Greeting */}
      <div className="gradient-primary rounded-xl p-5 text-white">
        <p className="text-sm opacity-80">{greeting}</p>
        <h1 className="text-xl font-bold mt-0.5">{t(customer.name, customer.nameAr)} 👋</h1>
        <p className="text-sm opacity-80 mt-2">{t("Here's your account overview", "إليك نظرة عامة على حسابك")}</p>

        {/* Inline stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/15 rounded-lg p-3 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{downloadUsage.value}<span className="text-xs font-normal opacity-70"> GB</span></p>
            <p className="text-[10px] opacity-80">{t("Downloaded", "تحميل")}</p>
          </div>
          <div className="bg-white/15 rounded-lg p-3 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{uploadUsage.value}<span className="text-xs font-normal opacity-70"> GB</span></p>
            <p className="text-[10px] opacity-80">{t("Uploaded", "رفع")}</p>
          </div>
          <div className="bg-white/15 rounded-lg p-3 text-center backdrop-blur-sm">
            <p className="text-xl font-bold">{devicesUsage.value}<span className="text-xs font-normal opacity-70">/{devicesUsage.limit}</span></p>
            <p className="text-[10px] opacity-80">{t("Devices", "الأجهزة")}</p>
          </div>
        </div>
      </div>

      {/* Promotions banner */}
      {promotions.length > 0 && (
        <Link to="/catalog" className="mt-2 block">
          <Card className="border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors cursor-pointer overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-[10px] border-secondary/30 text-secondary mb-2">{t("Limited Offer", "عرض محدود")}</Badge>
                <p className="font-semibold text-sm">{t(promotions[0].title, promotions[0].titleAr)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t(promotions[0].description, promotions[0].descriptionAr)}</p>
                <Button size="sm" variant="outline" className="mt-3 text-xs border-secondary/30 text-secondary hover:bg-secondary/10">
                  {t("Learn More", "اعرف المزيد")} <ArrowRight2 size={14} className="ms-1" />
                </Button>
              </div>
              <img src={promoIllustration} alt="" className="h-24 w-24 object-contain shrink-0 opacity-90" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3">{t("Quick Actions", "إجراءات سريعة")}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer text-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${action.color}`}>
                  <action.icon size={18} />
                </div>
                <span className="text-[11px] font-medium leading-tight">{t(action.labelEn, action.labelAr)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {usageData.map((item) => {
          const isUnlimited = item.unlimited;
          const percent = isUnlimited ? -1 : Math.round((item.value / item.limit) * 100);
          return (
            <Card key={item.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{t(item.name, item.name === "Data" ? "التحميل" : item.name === "Upload" ? "الرفع" : "الأجهزة")}</p>
                  {isUnlimited && <Badge variant="outline" className="text-[10px] text-success border-success/20">{t("Unlimited", "غير محدود")}</Badge>}
                </div>
                <p className="text-2xl font-bold">{item.value} <span className="text-sm font-normal text-muted-foreground">{item.unit}{!isUnlimited && ` / ${item.limit}`}</span></p>
                {!isUnlimited && <Progress value={percent} className={`mt-2 h-2 ${percent > 80 ? "[&>div]:bg-warning" : ""}`} />}
                {!isUnlimited && <p className="text-xs text-muted-foreground mt-1">{percent}% {t("used", "مستخدم")}</p>}
                {isUnlimited && <p className="text-xs text-muted-foreground mt-2">{t("This month", "هذا الشهر")}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Usage Trends", "اتجاهات الاستخدام")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyUsage}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(316, 70%, 41%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(316, 70%, 41%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(202, 90%, 43%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(202, 90%, 43%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(220, 13%, 91%)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="download" name={t("Download (GB)", "تحميل (جيجا)")} stroke="hsl(316, 70%, 41%)" fill="url(#downloadGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="upload" name={t("Upload (GB)", "رفع (جيجا)")} stroke="hsl(202, 90%, 43%)" fill="url(#uploadGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Monthly Breakdown", "التفاصيل الشهرية")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(220, 13%, 91%)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="download" name={t("Download (GB)", "تحميل (جيجا)")} fill="hsl(316, 70%, 41%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="upload" name={t("Upload (GB)", "رفع (جيجا)")} fill="hsl(202, 90%, 43%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("Recent Activity", "النشاط الأخير")}</CardTitle>
            <Link to="/notifications" className="text-xs text-primary hover:underline">{t("View All", "عرض الكل")}</Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {item.type === "payment" && <CardIcon size={16} className="text-success" />}
                  {item.type === "ticket" && <MessageQuestion size={16} className="text-warning" />}
                  {item.type === "service" && <Flash size={16} className="text-secondary" />}
                  {item.type === "order" && <Box size={16} className="text-info" />}
                  {item.type === "billing" && <CardIcon size={16} className="text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{t(item.description, item.descriptionAr)}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
