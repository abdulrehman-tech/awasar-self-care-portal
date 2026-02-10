import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchNormal, Wifi, Monitor, Call, Box, ArrowRight2, TickCircle, ArrowLeft, CloseCircle, InfoCircle } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { plans } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = { internet: Wifi, tv: Monitor, voice: Call, bundle: Box };

type Plan = (typeof plans)[number];

export default function CatalogPage() {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckout, setShowCheckout] = useState<Plan | null>(null);
  const [showQuote, setShowQuote] = useState(false);

  // Checkout form
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});

  // Quote form
  const [quoteForm, setQuoteForm] = useState({ name: "", phone: "", email: "", company: "", plan: "", message: "" });
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});

  const filtered = plans.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search));

  const toggleCompare = (id: string) => {
    setCompareList((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const comparePlans = plans.filter((p) => compareList.includes(p.id));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!checkoutForm.name.trim()) errors.name = t("Required", "مطلوب");
    if (!checkoutForm.phone.trim()) errors.phone = t("Required", "مطلوب");
    if (!checkoutForm.address.trim()) errors.address = t("Required", "مطلوب");
    setCheckoutErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowCheckout(null);
    setCheckoutForm({ name: "", phone: "", address: "", notes: "" });
    toast({ title: t("Subscription Request Submitted", "تم إرسال طلب الاشتراك"), description: t("We'll contact you to confirm your subscription.", "سنتواصل معك لتأكيد اشتراكك.") });
    navigate("/orders");
  };

  const handleQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!quoteForm.name.trim()) errors.name = t("Required", "مطلوب");
    if (!quoteForm.phone.trim()) errors.phone = t("Required", "مطلوب");
    if (!quoteForm.email.trim()) errors.email = t("Required", "مطلوب");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteForm.email)) errors.email = t("Invalid email", "بريد إلكتروني غير صالح");
    if (!quoteForm.message.trim()) errors.message = t("Required", "مطلوب");
    setQuoteErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowQuote(false);
    setQuoteForm({ name: "", phone: "", email: "", company: "", plan: "", message: "" });
    toast({ title: t("Quote Requested", "تم طلب عرض السعر"), description: t("Our sales team will get back to you shortly.", "سيتواصل فريق المبيعات معك قريباً.") });
  };

  const planFeatures = (plan: Plan) => {
    const features: string[] = [];
    if (plan.speed) features.push(plan.speed);
    if ("channels" in plan) features.push(`${(plan as any).channels} ${t("channels", "قناة")}`);
    if (plan.type === "internet") {
      if ("uploadSpeed" in plan) features.push(`↑ ${(plan as any).uploadSpeed}`);
      if ("features" in plan) (plan as any).features.forEach((f: string) => features.push(f));
    }
    if (plan.type === "addon" && "features" in plan) {
      (plan as any).features.forEach((f: string) => features.push(f));
    }
    if (plan.type === "tv") {
      features.push(t("HD quality", "جودة عالية"));
    }
    return features;
  };

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
          <Button size="sm" variant="outline" onClick={() => setShowQuote(true)}>
            {t("Request a Quote", "طلب عرض سعر")}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowContact(true)}>
            {t("Contact Sales", "اتصل بالمبيعات")}
          </Button>
        </div>
      </div>

      <div className="relative">
        <SearchNormal size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search plans...", "ابحث عن الباقات...")} className="ps-9" />
      </div>

      <Tabs defaultValue="all" dir={dir}>
        <TabsList>
          <TabsTrigger value="all">{t("All", "الكل")}</TabsTrigger>
          <TabsTrigger value="internet">{t("Internet", "الإنترنت")}</TabsTrigger>
          <TabsTrigger value="addon">{t("Add-ons", "الإضافات")}</TabsTrigger>
        </TabsList>

        {["all", "internet", "addon"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.filter((p) => tab === "all" || p.type === tab).map((plan) => {
                const Icon = typeIcons[plan.type] || Box;
                const isComparing = compareList.includes(plan.id);
                return (
                  <Card key={plan.id} className={cn("transition-colors cursor-pointer hover:shadow-md", isComparing && "border-primary")} onClick={() => setSelectedPlan(plan)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleCompare(plan.id); }} className={cn("text-xs px-2 py-1 rounded border transition-colors", isComparing ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/30")}>
                          {isComparing ? <TickCircle size={12} className="inline me-0.5" /> : null}
                          {t("Compare", "مقارنة")}
                        </button>
                      </div>
                      <h3 className="font-semibold text-sm">{t(plan.name, plan.nameAr)}</h3>
                      {plan.speed && <p className="text-xs text-muted-foreground">{plan.speed}</p>}
                      {"channels" in plan && <p className="text-xs text-muted-foreground">{(plan as any).channels} {t("channels", "قناة")}</p>}
                      {"includes" in plan && (
                        <div className="mt-1">{((plan as any).includes as string[]).map((inc, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] me-1">{inc}</Badge>
                        ))}</div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-bold">{plan.price} <span className="text-xs font-normal text-muted-foreground">{t("OMR/mo", "ر.ع/شهر")}</span></p>
                        <Button size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); setShowCheckout(plan); }}>{t("Subscribe", "اشترك")} <ArrowRight2 size={14} className="ms-1" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Plan Detail Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(o) => !o && setSelectedPlan(null)}>
        <DialogContent className="max-w-md">
          {selectedPlan && (() => {
            const Icon = typeIcons[selectedPlan.type] || Box;
            const features = planFeatures(selectedPlan);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    {t(selectedPlan.name, selectedPlan.nameAr)}
                  </DialogTitle>
                  <DialogDescription>
                    {t(`${selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)} Plan`, `باقة ${selectedPlan.type === "internet" ? "إنترنت" : selectedPlan.type === "addon" ? "إضافة" : "تلفزيون"}`)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-center py-4 bg-muted/30 rounded-lg">
                    <p className="text-3xl font-bold">{selectedPlan.price} <span className="text-sm font-normal text-muted-foreground">{t("OMR/month", "ر.ع/شهر")}</span></p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">{t("Features", "المميزات")}</p>
                    <ul className="space-y-1.5">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <TickCircle size={14} className="text-success shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => { setSelectedPlan(null); setShowCheckout(selectedPlan); }}>
                      {t("Subscribe Now", "اشترك الآن")}
                    </Button>
                    <Button variant="outline" onClick={() => { setSelectedPlan(null); setShowQuote(true); setQuoteForm((p) => ({ ...p, plan: selectedPlan.name })); }}>
                      {t("Request Quote", "طلب عرض سعر")}
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Subscribe Checkout Dialog */}
      <Dialog open={!!showCheckout} onOpenChange={(o) => { if (!o) { setShowCheckout(null); setCheckoutForm({ name: "", phone: "", address: "", notes: "" }); setCheckoutErrors({}); } }}>
        <DialogContent className="max-w-md">
          {showCheckout && (
            <>
              <DialogHeader>
                <DialogTitle>{t("Subscribe to", "الاشتراك في")} {t(showCheckout.name, showCheckout.nameAr)}</DialogTitle>
                <DialogDescription>
                  {showCheckout.price} {t("OMR/month", "ر.ع/شهر")} {showCheckout.speed ? `— ${showCheckout.speed}` : ""}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCheckout} className="space-y-3">
                <div className="space-y-1">
                  <Label>{t("Full Name", "الاسم الكامل")} *</Label>
                  <Input value={checkoutForm.name} onChange={(e) => { setCheckoutForm((p) => ({ ...p, name: e.target.value })); setCheckoutErrors((p) => ({ ...p, name: "" })); }} className={checkoutErrors.name ? "border-destructive" : ""} />
                  {checkoutErrors.name && <p className="text-xs text-destructive">{checkoutErrors.name}</p>}
                </div>
                <div className="space-y-1">
                  <Label>{t("Phone Number", "رقم الهاتف")} *</Label>
                  <Input type="tel" value={checkoutForm.phone} onChange={(e) => { setCheckoutForm((p) => ({ ...p, phone: e.target.value })); setCheckoutErrors((p) => ({ ...p, phone: "" })); }} className={checkoutErrors.phone ? "border-destructive" : ""} placeholder="+968 9XXX XXXX" />
                  {checkoutErrors.phone && <p className="text-xs text-destructive">{checkoutErrors.phone}</p>}
                </div>
                <div className="space-y-1">
                  <Label>{t("Installation Address", "عنوان التركيب")} *</Label>
                  <Textarea value={checkoutForm.address} onChange={(e) => { setCheckoutForm((p) => ({ ...p, address: e.target.value })); setCheckoutErrors((p) => ({ ...p, address: "" })); }} className={checkoutErrors.address ? "border-destructive" : ""} rows={2} />
                  {checkoutErrors.address && <p className="text-xs text-destructive">{checkoutErrors.address}</p>}
                </div>
                <div className="space-y-1">
                  <Label>{t("Notes (optional)", "ملاحظات (اختياري)")}</Label>
                  <Textarea value={checkoutForm.notes} onChange={(e) => setCheckoutForm((p) => ({ ...p, notes: e.target.value }))} rows={2} maxLength={300} />
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t("Plan", "الباقة")}</span>
                    <span className="font-medium">{t(showCheckout.name, showCheckout.nameAr)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span>{t("Monthly Cost", "التكلفة الشهرية")}</span>
                    <span className="font-bold">{showCheckout.price} {t("OMR", "ر.ع")}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" type="button" onClick={() => setShowCheckout(null)}>{t("Cancel", "إلغاء")}</Button>
                  <Button type="submit">{t("Confirm Subscription", "تأكيد الاشتراك")}</Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Request a Quote Dialog */}
      <Dialog open={showQuote} onOpenChange={(o) => { if (!o) { setShowQuote(false); setQuoteForm({ name: "", phone: "", email: "", company: "", plan: "", message: "" }); setQuoteErrors({}); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Request a Quote", "طلب عرض سعر")}</DialogTitle>
            <DialogDescription>{t("Fill in your details and we'll prepare a custom quote for you.", "املأ بياناتك وسنعد لك عرض سعر مخصص.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuote} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{t("Name", "الاسم")} *</Label>
                <Input value={quoteForm.name} onChange={(e) => { setQuoteForm((p) => ({ ...p, name: e.target.value })); setQuoteErrors((p) => ({ ...p, name: "" })); }} className={quoteErrors.name ? "border-destructive" : ""} />
                {quoteErrors.name && <p className="text-xs text-destructive">{quoteErrors.name}</p>}
              </div>
              <div className="space-y-1">
                <Label>{t("Phone", "الهاتف")} *</Label>
                <Input type="tel" value={quoteForm.phone} onChange={(e) => { setQuoteForm((p) => ({ ...p, phone: e.target.value })); setQuoteErrors((p) => ({ ...p, phone: "" })); }} className={quoteErrors.phone ? "border-destructive" : ""} />
                {quoteErrors.phone && <p className="text-xs text-destructive">{quoteErrors.phone}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label>{t("Email", "البريد الإلكتروني")} *</Label>
              <Input type="email" value={quoteForm.email} onChange={(e) => { setQuoteForm((p) => ({ ...p, email: e.target.value })); setQuoteErrors((p) => ({ ...p, email: "" })); }} className={quoteErrors.email ? "border-destructive" : ""} />
              {quoteErrors.email && <p className="text-xs text-destructive">{quoteErrors.email}</p>}
            </div>
            <div className="space-y-1">
              <Label>{t("Company (optional)", "الشركة (اختياري)")}</Label>
              <Input value={quoteForm.company} onChange={(e) => setQuoteForm((p) => ({ ...p, company: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>{t("Interested Plan", "الباقة المطلوبة")}</Label>
              <Select value={quoteForm.plan} onValueChange={(v) => setQuoteForm((p) => ({ ...p, plan: v }))}>
                <SelectTrigger><SelectValue placeholder={t("Select a plan", "اختر باقة")} /></SelectTrigger>
                <SelectContent>
                  {plans.map((p) => <SelectItem key={p.id} value={p.name}>{t(p.name, p.nameAr)} — {p.price} {t("OMR", "ر.ع")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>{t("Message", "الرسالة")} *</Label>
              <Textarea value={quoteForm.message} onChange={(e) => { setQuoteForm((p) => ({ ...p, message: e.target.value })); setQuoteErrors((p) => ({ ...p, message: "" })); }} className={quoteErrors.message ? "border-destructive" : ""} rows={3} maxLength={500} placeholder={t("Describe your requirements...", "صف متطلباتك...")} />
              {quoteErrors.message && <p className="text-xs text-destructive">{quoteErrors.message}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" type="button" onClick={() => setShowQuote(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">{t("Submit Request", "إرسال الطلب")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Compare dialog */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("Plan Comparison", "مقارنة الباقات")}</DialogTitle>
            <DialogDescription>{t("Compare selected plans side by side.", "قارن الباقات المختارة جنباً إلى جنب.")}</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-2 text-muted-foreground font-medium">{t("Feature", "الميزة")}</th>
                  {comparePlans.map((p) => (
                    <th key={p.id} className="text-center p-2 font-semibold">{t(p.name, p.nameAr)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 text-muted-foreground">{t("Price", "السعر")}</td>
                  {comparePlans.map((p) => <td key={p.id} className="p-2 text-center font-bold">{p.price} {t("OMR", "ر.ع")}</td>)}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 text-muted-foreground">{t("Type", "النوع")}</td>
                  {comparePlans.map((p) => <td key={p.id} className="p-2 text-center capitalize">{p.type}</td>)}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 text-muted-foreground">{t("Speed", "السرعة")}</td>
                  {comparePlans.map((p) => <td key={p.id} className="p-2 text-center">{p.speed || "—"}</td>)}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 text-muted-foreground">{t("Channels", "القنوات")}</td>
                  {comparePlans.map((p) => <td key={p.id} className="p-2 text-center">{"channels" in p ? (p as any).channels : "—"}</td>)}
                </tr>
                <tr>
                  <td className="p-2"></td>
                  {comparePlans.map((p) => (
                    <td key={p.id} className="p-2 text-center">
                      <Button size="sm" className="text-xs" onClick={() => { setShowCompare(false); setShowCheckout(p); }}>
                        {t("Subscribe", "اشترك")}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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
