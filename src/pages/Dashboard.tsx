import { Link } from "react-router-dom";
import { Card as CardIcon, MessageQuestion, Box, Eye, Flash, Wifi, Monitor, Call } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { customer, services, invoices, usageData, monthlyUsage, recentActivity, promotions } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Dashboard() {
  const { t } = useLanguage();
  const outstandingBalance = invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);
  const activeServicesCount = services.filter((s) => s.status === "active").length;
  const dataUsage = usageData.find((u) => u.name === "Data")!;
  const dataPercent = Math.round((dataUsage.value / dataUsage.limit) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("Good morning", "صباح الخير") : hour < 17 ? t("Good afternoon", "مساء الخير") : t("Good evening", "مساء الخير");

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {t(customer.name, customer.nameAr)} 👋</h1>
        <p className="text-muted-foreground text-sm">{t("Here's your account overview", "إليك نظرة عامة على حسابك")}</p>
      </div>

      {/* Promotions banner */}
      {promotions.length > 0 && (
        <div className="gradient-primary rounded-lg p-4 text-white">
          <p className="font-semibold">{t(promotions[0].title, promotions[0].titleAr)}</p>
          <p className="text-sm opacity-90 mt-1">{t(promotions[0].description, promotions[0].descriptionAr)}</p>
          <Button variant="secondary" size="sm" className="mt-2 bg-white/20 text-white hover:bg-white/30 border-0">
            {t("Learn More", "اعرف المزيد")}
          </Button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{t("Outstanding Balance", "الرصيد المستحق")}</p>
              <CardIcon size={16} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{outstandingBalance.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{t("OMR", "ر.ع")}</span></p>
            <Link to="/billing">
              <Button size="sm" className="mt-2 w-full">{t("Pay Now", "ادفع الآن")}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{t("Data Usage", "استخدام البيانات")}</p>
              <Wifi size={16} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{dataUsage.value} <span className="text-sm font-normal text-muted-foreground">/ {dataUsage.limit} {dataUsage.unit}</span></p>
            <Progress value={dataPercent} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">{dataPercent}% {t("used", "مستخدم")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{t("Active Services", "الخدمات النشطة")}</p>
              <Flash size={16} className="text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{activeServicesCount}</p>
            <Link to="/services">
              <Button variant="outline" size="sm" className="mt-2 w-full">{t("View Services", "عرض الخدمات")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: "/billing", icon: CardIcon, labelEn: "Pay Bill", labelAr: "دفع الفاتورة" },
          { to: "/support", icon: MessageQuestion, labelEn: "Raise Ticket", labelAr: "إنشاء تذكرة" },
          { to: "/orders", icon: Box, labelEn: "Track Order", labelAr: "تتبع الطلب" },
          { to: "/catalog", icon: Eye, labelEn: "View Plans", labelAr: "عرض الباقات" },
        ].map((action) => (
          <Link key={action.to} to={action.to}>
            <Card className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <action.icon size={20} className="text-primary" />
                </div>
                <span className="text-xs font-medium">{t(action.labelEn, action.labelAr)}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Usage chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Monthly Usage", "الاستخدام الشهري")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="data" name={t("Data (GB)", "البيانات (جيجا)")} fill="hsl(316, 70%, 41%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="voice" name={t("Voice (min)", "الصوت (دقيقة)")} fill="hsl(202, 90%, 43%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sms" name={t("SMS", "رسائل")} fill="hsl(220, 9%, 46%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Recent Activity", "النشاط الأخير")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
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
