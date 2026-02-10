import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchNormal, Wifi, Monitor, Call, Box, ArrowRight2, TickCircle } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { plans } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = { internet: Wifi, tv: Monitor, voice: Call, bundle: Box };

export default function CatalogPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const filtered = plans.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const toggleCompare = (id: string) => {
    setCompareList((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const comparePlans = plans.filter((p) => compareList.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">{t("Products & Plans", "المنتجات والباقات")}</h1>
        <div className="flex gap-2">
          {compareList.length >= 2 && (
            <Button size="sm" variant="outline" onClick={() => setShowCompare(true)}>
              {t("Compare", "مقارنة")} ({compareList.length})
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowContact(true)}>
            {t("Contact Sales", "اتصل بالمبيعات")}
          </Button>
        </div>
      </div>

      <div className="relative">
        <SearchNormal size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search plans...", "ابحث عن الباقات...")} className="ps-9" />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("All", "الكل")}</TabsTrigger>
          <TabsTrigger value="internet">{t("Internet", "الإنترنت")}</TabsTrigger>
          <TabsTrigger value="tv">{t("TV", "التلفزيون")}</TabsTrigger>
          <TabsTrigger value="voice">{t("Voice", "الصوت")}</TabsTrigger>
          <TabsTrigger value="bundle">{t("Bundles", "الباقات")}</TabsTrigger>
        </TabsList>

        {["all", "internet", "tv", "voice", "bundle"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter((p) => tab === "all" || p.type === tab).map((plan) => {
                const Icon = typeIcons[plan.type] || Box;
                const isComparing = compareList.includes(plan.id);
                return (
                  <Card key={plan.id} className={cn("transition-colors", isComparing && "border-primary")}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <button onClick={() => toggleCompare(plan.id)} className={cn("text-xs px-2 py-1 rounded border transition-colors", isComparing ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/30")}>
                          {isComparing ? <TickCircle size={12} className="inline mr-0.5" /> : null}
                          {t("Compare", "مقارنة")}
                        </button>
                      </div>
                      <h3 className="font-semibold text-sm">{t(plan.name, plan.nameAr)}</h3>
                      {plan.speed && <p className="text-xs text-muted-foreground">{plan.speed}</p>}
                      {"channels" in plan && <p className="text-xs text-muted-foreground">{(plan as any).channels} {t("channels", "قناة")}</p>}
                      {"includes" in plan && (
                        <div className="mt-1">{((plan as any).includes as string[]).map((inc, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] mr-1">{inc}</Badge>
                        ))}</div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-bold">{plan.price} <span className="text-xs font-normal text-muted-foreground">{t("OMR/mo", "ر.ع/شهر")}</span></p>
                        <Button size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); navigate("/orders"); }}>{t("Subscribe", "اشترك")} <ArrowRight2 size={14} className="ms-1" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Compare dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Plan Comparison", "مقارنة الباقات")}</DialogTitle>
            <DialogDescription>{t("Compare selected plans side by side.", "قارن الباقات المختارة جنباً إلى جنب.")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparePlans.length}, 1fr)` }}>
            {comparePlans.map((plan) => (
              <div key={plan.id} className="text-center space-y-2 p-3 border rounded-lg">
                <h4 className="font-semibold text-sm">{t(plan.name, plan.nameAr)}</h4>
                <p className="text-2xl font-bold">{plan.price} <span className="text-xs text-muted-foreground">{t("OMR", "ر.ع")}</span></p>
                {plan.speed && <p className="text-sm text-muted-foreground">{plan.speed}</p>}
                {"channels" in plan && <p className="text-sm text-muted-foreground">{(plan as any).channels} {t("channels", "قناة")}</p>}
                <Button size="sm" className="w-full text-xs" onClick={() => navigate("/orders")}>{t("Subscribe", "اشترك")}</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Sales */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Contact Sales", "اتصل بالمبيعات")}</DialogTitle>
            <DialogDescription>{t("Fill in your details and we'll get back to you.", "املأ بياناتك وسنتواصل معك.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); setShowContact(false); toast({ title: t("Request Submitted", "تم إرسال الطلب") }); }} className="space-y-4">
            <div className="space-y-2"><Label>{t("Name", "الاسم")}</Label><Input /></div>
            <div className="space-y-2"><Label>{t("Phone", "الهاتف")}</Label><Input /></div>
            <div className="space-y-2"><Label>{t("Email", "البريد")}</Label><Input type="email" /></div>
            <div className="space-y-2"><Label>{t("Interest", "الاهتمام")}</Label><Input placeholder={t("e.g., Fiber 500 plan", "مثال: باقة فايبر 500")} /></div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setShowContact(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">{t("Submit", "إرسال")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
