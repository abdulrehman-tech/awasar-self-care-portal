import { useState } from "react";
import { Wifi, Monitor, Call, Box, Add, SearchNormal, TickCircle, Location } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { services, plans } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, any> = { internet: Wifi, tv: Monitor, voice: Call, bundle: Box };

export default function MyServices() {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dialog states
  const [showAddService, setShowAddService] = useState(false);
  const [addStep, setAddStep] = useState<"type" | "plan" | "confirm">("type");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const [showManage, setShowManage] = useState(false);
  const [managedService, setManagedService] = useState<typeof services[0] | null>(null);

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeService, setUpgradeService] = useState<typeof services[0] | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState("");
  const [upgradeStep, setUpgradeStep] = useState<"select" | "review" | "done">("select");

  const [showCoverage, setShowCoverage] = useState(false);
  const [coverageAddress, setCoverageAddress] = useState("");
  const [coverageResult, setCoverageResult] = useState<"idle" | "checking" | "available" | "unavailable">("idle");

  const statusColor = (s: string) =>
    s === "active" ? "bg-success/10 text-success border-success/20" :
    s === "suspended" ? "bg-warning/10 text-warning border-warning/20" :
    "bg-muted text-muted-foreground";

  // Add Service handlers
  const resetAddFlow = () => { setAddStep("type"); setSelectedType(""); setSelectedPlan(""); };
  const openAddService = () => { resetAddFlow(); setShowAddService(true); };
  const filteredPlans = plans.filter((p) => p.type === selectedType);

  const handleAddConfirm = () => {
    setShowAddService(false);
    toast({ title: t("Service Added!", "تمت إضافة الخدمة!"), description: t("Your new service will be activated within 24 hours.", "سيتم تفعيل خدمتك الجديدة خلال 24 ساعة.") });
  };

  // Manage handler
  const openManage = (service: typeof services[0]) => { setManagedService(service); setShowManage(true); };

  // Upgrade handlers
  const openUpgrade = (service: typeof services[0]) => {
    setUpgradeService(service);
    setUpgradeTarget("");
    setUpgradeStep("select");
    setShowUpgrade(true);
  };
  const availableUpgrades = upgradeService ? plans.filter((p) => p.type === upgradeService.type && p.price > upgradeService.monthlyCost) : [];

  const handleUpgradeConfirm = () => {
    setUpgradeStep("done");
  };
  const handleUpgradeDone = () => {
    setShowUpgrade(false);
    toast({ title: t("Upgrade Requested!", "تم طلب الترقية!"), description: t("Reference: REQ-3010. We'll process within 1-2 business days.", "المرجع: REQ-3010. سنقوم بالمعالجة خلال 1-2 أيام عمل.") });
  };

  // Coverage check
  const checkCoverage = () => {
    if (!coverageAddress.trim()) return;
    setCoverageResult("checking");
    setTimeout(() => {
      setCoverageResult(coverageAddress.toLowerCase().includes("muscat") || coverageAddress.toLowerCase().includes("مسقط") ? "available" : "unavailable");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("My Services", "خدماتي")}</h1>
        <Button size="sm" onClick={openAddService}><Add size={16} className="me-1" />{t("Add Service", "إضافة خدمة")}</Button>
      </div>

      <Tabs defaultValue="all" dir={dir}>
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
                        <div className="text-end">
                          <p className="font-bold text-sm">{service.monthlyCost.toFixed(2)} <span className="text-xs text-muted-foreground">{t("OMR/mo", "ر.ع/شهر")}</span></p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => openManage(service)}>{t("Manage", "إدارة")}</Button>
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => openUpgrade(service)}>{t("Upgrade", "ترقية")}</Button>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/requests")}>{t("Request Change", "طلب تغيير")}</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Coverage Check */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Location size={18} className="text-primary" />
            {t("Coverage Check", "فحص التغطية")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t("Check if Awasr services are available at your address.", "تحقق مما إذا كانت خدمات أوامر متوفرة في عنوانك.")}</p>
          <div className="flex gap-2">
            <Input
              value={coverageAddress}
              onChange={(e) => { setCoverageAddress(e.target.value); setCoverageResult("idle"); }}
              placeholder={t("Enter your address...", "أدخل عنوانك...")}
            />
            <Button onClick={checkCoverage} disabled={coverageResult === "checking"} size="sm">
              {coverageResult === "checking" ? t("Checking...", "جاري الفحص...") : t("Check", "فحص")}
            </Button>
          </div>
          {coverageResult === "available" && (
            <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20 flex items-center gap-2">
              <TickCircle size={18} className="text-success" variant="Bold" />
              <p className="text-sm text-success font-medium">{t("Great news! Awasr Fiber is available at your location.", "أخبار رائعة! فايبر أوامر متوفر في موقعك.")}</p>
            </div>
          )}
          {coverageResult === "unavailable" && (
            <div className="mt-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning font-medium">{t("Awasr services are not yet available at this location. We'll notify you when coverage expands.", "خدمات أوامر غير متوفرة حالياً في هذا الموقع. سنبلغك عند توسع التغطية.")}</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">{t("Notify Me", "أبلغني")}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* === ADD SERVICE DIALOG === */}
      <Dialog open={showAddService} onOpenChange={setShowAddService}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Add New Service", "إضافة خدمة جديدة")}</DialogTitle>
            <DialogDescription>
              {addStep === "type" && t("What type of service would you like?", "ما نوع الخدمة التي ترغب بها؟")}
              {addStep === "plan" && t("Choose a plan.", "اختر باقة.")}
              {addStep === "confirm" && t("Review and confirm.", "راجع وأكد.")}
            </DialogDescription>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-2">
            {["type", "plan", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={cn("h-6 w-6 rounded-full text-xs flex items-center justify-center font-medium",
                  addStep === s ? "bg-primary text-primary-foreground" :
                  (addStep === "plan" && i === 0) || (addStep === "confirm" && i <= 1) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>{i + 1}</div>
                {i < 2 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>

          {addStep === "type" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "internet", icon: Wifi, en: "Internet", ar: "الإنترنت" },
                { value: "tv", icon: Monitor, en: "TV", ar: "التلفزيون" },
                { value: "voice", icon: Call, en: "Voice", ar: "الصوت" },
                { value: "bundle", icon: Box, en: "Bundle", ar: "باقة" },
              ].map((type) => (
                <button key={type.value} onClick={() => { setSelectedType(type.value); setAddStep("plan"); }}
                  className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <type.icon size={24} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium">{t(type.en, type.ar)}</span>
                </button>
              ))}
            </div>
          )}

          {addStep === "plan" && (
            <div className="space-y-3">
              {filteredPlans.map((plan) => (
                <button key={plan.id} onClick={() => { setSelectedPlan(plan.id); setAddStep("confirm"); }}
                  className={cn("w-full p-3 rounded-lg border text-start transition-colors",
                    selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{t(plan.name, plan.nameAr)}</p>
                      {plan.speed && <p className="text-xs text-muted-foreground">{plan.speed}</p>}
                    </div>
                    <p className="font-bold text-sm">{plan.price} <span className="text-xs text-muted-foreground">{t("OMR/mo", "ر.ع/شهر")}</span></p>
                  </div>
                </button>
              ))}
              <Button variant="ghost" size="sm" onClick={() => setAddStep("type")}>{t("← Back", "→ رجوع")}</Button>
            </div>
          )}

          {addStep === "confirm" && (() => {
            const plan = plans.find((p) => p.id === selectedPlan);
            return (
              <div className="space-y-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Plan", "الباقة")}</span><span className="font-medium">{plan && t(plan.name, plan.nameAr)}</span></div>
                    {plan?.speed && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Speed", "السرعة")}</span><span>{plan.speed}</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Monthly Cost", "التكلفة الشهرية")}</span><span className="font-bold">{plan?.price} {t("OMR", "ر.ع")}</span></div>
                  </CardContent>
                </Card>
                <div className="flex gap-2 justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setAddStep("plan")}>{t("← Back", "→ رجوع")}</Button>
                  <Button onClick={handleAddConfirm}>{t("Confirm & Add", "تأكيد وإضافة")}</Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* === MANAGE SERVICE DIALOG === */}
      <Dialog open={showManage} onOpenChange={setShowManage}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{managedService && t(managedService.name, managedService.nameAr)}</DialogTitle>
            <DialogDescription>{t("Service details and usage.", "تفاصيل الخدمة والاستخدام.")}</DialogDescription>
          </DialogHeader>
          {managedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-muted/50"><CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">{t("Status", "الحالة")}</p>
                  <Badge variant="outline" className={cn("mt-1 text-xs", statusColor(managedService.status))}>
                    {t(managedService.status === "active" ? "Active" : "Suspended", managedService.status === "active" ? "نشط" : "معلق")}
                  </Badge>
                </CardContent></Card>
                <Card className="bg-muted/50"><CardContent className="p-3 text-center">
                  <p className="text-xs text-muted-foreground">{t("Monthly Cost", "التكلفة الشهرية")}</p>
                  <p className="font-bold text-sm mt-1">{managedService.monthlyCost.toFixed(2)} {t("OMR", "ر.ع")}</p>
                </CardContent></Card>
              </div>

              {managedService.speed && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("Speed", "السرعة")}</p>
                  <p className="text-sm font-medium">{managedService.speed}</p>
                </div>
              )}

              {managedService.type === "internet" && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{t("Data Used", "البيانات المستخدمة")}</span>
                    <span>{managedService.dataUsed} / {managedService.dataLimit} GB</span>
                  </div>
                  <Progress value={managedService.dataUsed && managedService.dataLimit ? (managedService.dataUsed / managedService.dataLimit) * 100 : 0} className="h-2" />
                </div>
              )}

              {"channels" in managedService && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("Channels", "القنوات")}</p>
                  <p className="text-sm font-medium">{(managedService as any).channels} {t("channels", "قناة")}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("Active Since", "نشط منذ")}</p>
                <p className="text-sm">{new Date(managedService.startDate).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setShowManage(false); openUpgrade(managedService); }}>
                  {t("Upgrade", "ترقية")}
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setShowManage(false); navigate("/requests"); }}>
                  {t("Request Change", "طلب تغيير")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* === UPGRADE DIALOG === */}
      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Upgrade Service", "ترقية الخدمة")}</DialogTitle>
            <DialogDescription>
              {upgradeStep === "select" && t("Choose a higher plan to upgrade to.", "اختر باقة أعلى للترقية إليها.")}
              {upgradeStep === "review" && t("Review your upgrade details.", "راجع تفاصيل الترقية.")}
              {upgradeStep === "done" && t("Upgrade requested successfully!", "تم طلب الترقية بنجاح!")}
            </DialogDescription>
          </DialogHeader>

          {upgradeStep === "select" && (
            <div className="space-y-3">
              <Card className="bg-muted/50">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{t("Current Plan", "الباقة الحالية")}</p>
                  <p className="font-semibold text-sm">{upgradeService && t(upgradeService.name, upgradeService.nameAr)}</p>
                  <p className="text-xs text-muted-foreground">{upgradeService?.speed} — {upgradeService?.monthlyCost.toFixed(2)} {t("OMR/mo", "ر.ع/شهر")}</p>
                </CardContent>
              </Card>

              <p className="text-sm font-medium">{t("Available Upgrades", "الترقيات المتاحة")}</p>
              {availableUpgrades.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("You're already on the highest plan!", "أنت بالفعل على أعلى باقة!")}</p>
              ) : (
                availableUpgrades.map((plan) => (
                  <button key={plan.id} onClick={() => { setUpgradeTarget(plan.id); setUpgradeStep("review"); }}
                    className="w-full p-3 rounded-lg border border-border hover:border-primary/30 transition-colors text-start flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{t(plan.name, plan.nameAr)}</p>
                      {plan.speed && <p className="text-xs text-muted-foreground">{plan.speed}</p>}
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-sm">{plan.price} {t("OMR/mo", "ر.ع/شهر")}</p>
                      <p className="text-xs text-success">+{(plan.price - (upgradeService?.monthlyCost || 0)).toFixed(2)} {t("OMR", "ر.ع")}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {upgradeStep === "review" && (() => {
            const target = plans.find((p) => p.id === upgradeTarget);
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Card className="flex-1 bg-muted/50"><CardContent className="p-3 text-center">
                    <p className="text-[10px] text-muted-foreground">{t("FROM", "من")}</p>
                    <p className="text-xs font-medium mt-1">{upgradeService && t(upgradeService.name, upgradeService.nameAr)}</p>
                    <p className="text-xs text-muted-foreground">{upgradeService?.monthlyCost.toFixed(2)} {t("OMR", "ر.ع")}</p>
                  </CardContent></Card>
                  <span className="text-muted-foreground shrink-0 text-lg">→</span>
                  <Card className="flex-1 border-primary"><CardContent className="p-3 text-center">
                    <p className="text-[10px] text-primary">{t("TO", "إلى")}</p>
                    <p className="text-xs font-medium mt-1">{target && t(target.name, target.nameAr)}</p>
                    <p className="text-xs text-primary font-bold">{target?.price.toFixed(2)} {t("OMR", "ر.ع")}</p>
                  </CardContent></Card>
                </div>
                <div className="flex gap-2 justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setUpgradeStep("select")}>{t("← Back", "→ رجوع")}</Button>
                  <Button onClick={handleUpgradeConfirm}>{t("Confirm Upgrade", "تأكيد الترقية")}</Button>
                </div>
              </div>
            );
          })()}

          {upgradeStep === "done" && (
            <div className="text-center py-4">
              <TickCircle size={48} className="text-success mx-auto mb-3" variant="Bold" />
              <h3 className="font-semibold text-lg">{t("Upgrade Requested!", "تم طلب الترقية!")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("Reference: REQ-3010", "المرجع: REQ-3010")}</p>
              <p className="text-sm text-muted-foreground">{t("We'll process your upgrade within 1-2 business days.", "سنقوم بمعالجة ترقيتك خلال 1-2 أيام عمل.")}</p>
              <Button className="mt-4" onClick={handleUpgradeDone}>{t("Done", "تم")}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
