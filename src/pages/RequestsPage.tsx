import { useState } from "react";
import { Add, Paperclip, TickCircle, ArrowUp2, ArrowDown2, AddCircle, Location, Timer1, CloseCircle, DocumentText, Trash, ArrowRight2 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OmrSymbol from "@/components/OmrSymbol";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { plans, services } from "@/data/mockData";
import { cn } from "@/lib/utils";

const addons = [
  { id: "addon-1", name: "Extra 100GB Data", nameAr: "100 جيجا بيانات إضافية", price: 5, type: "data" },
  { id: "addon-2", name: "Static IP Address", nameAr: "عنوان IP ثابت", price: 3, type: "network" },
  { id: "addon-3", name: "Parental Controls", nameAr: "الرقابة الأبوية", price: 2, type: "security" },
  { id: "addon-4", name: "Premium Sports Channels", nameAr: "قنوات رياضية مميزة", price: 8, type: "tv" },
  { id: "addon-5", name: "Cloud Storage 50GB", nameAr: "تخزين سحابي 50 جيجا", price: 2, type: "cloud" },
];

type Request = {
  id: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date: string;
  description: string;
  descriptionAr: string;
  timeline: { label: string; labelAr: string; date: string; completed: boolean }[];
};

const initialRequests: Request[] = [
  {
    id: "REQ-3001", type: "upgrade", status: "in_progress", date: "2024-07-25",
    description: "Upgrade from Fiber 100 to Fiber 200",
    descriptionAr: "ترقية من فايبر 100 إلى فايبر 200",
    timeline: [
      { label: "Submitted", labelAr: "تم الإرسال", date: "2024-07-25", completed: true },
      { label: "Under Review", labelAr: "قيد المراجعة", date: "2024-07-26", completed: true },
      { label: "Processing", labelAr: "قيد المعالجة", date: "2024-07-27", completed: false },
      { label: "Completed", labelAr: "مكتمل", date: "", completed: false },
    ],
  },
  {
    id: "REQ-3002", type: "relocation", status: "completed", date: "2024-06-10",
    description: "Move service to new villa in Al Ghubra",
    descriptionAr: "نقل الخدمة إلى فيلا جديدة في الغبرة",
    timeline: [
      { label: "Submitted", labelAr: "تم الإرسال", date: "2024-06-10", completed: true },
      { label: "Under Review", labelAr: "قيد المراجعة", date: "2024-06-11", completed: true },
      { label: "Scheduled", labelAr: "تم الجدولة", date: "2024-06-15", completed: true },
      { label: "Completed", labelAr: "مكتمل", date: "2024-06-18", completed: true },
    ],
  },
];

export default function RequestsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [showFlow, setShowFlow] = useState<"upgrade" | "downgrade" | "addon" | "relocation" | null>(null);
  const [flowStep, setFlowStep] = useState(0);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  // Upgrade/Downgrade state
  const [selectedCurrentPlan, setSelectedCurrentPlan] = useState("");
  const [selectedNewPlan, setSelectedNewPlan] = useState("");

  // Add-on state
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Relocation state
  const [relocAddress, setRelocAddress] = useState("");
  const [relocCity, setRelocCity] = useState("");
  const [relocAvailable, setRelocAvailable] = useState<boolean | null>(null);
  const [relocNotes, setRelocNotes] = useState("");

  const currentService = services.find((s) => s.id === selectedCurrentPlan);
  const internetPlans = plans.filter((p) => p.type === "internet");
  const newPlanObj = plans.find((p) => p.id === selectedNewPlan);
  const selectedDetailReq = requests.find((r) => r.id === showDetail);

  const statusColor = (s: string) =>
    s === "completed" ? "text-success border-success/20" :
    s === "in_progress" ? "text-info border-info/20" :
    s === "cancelled" ? "text-destructive border-destructive/20" :
    "text-warning border-warning/20";

  const statusLabel = (s: string) =>
    t(
      s === "completed" ? "Completed" : s === "in_progress" ? "In Progress" : s === "cancelled" ? "Cancelled" : "Pending",
      s === "completed" ? "مكتمل" : s === "in_progress" ? "قيد التنفيذ" : s === "cancelled" ? "ملغي" : "معلق"
    );

  const typeIcon = (type: string) => {
    switch (type) {
      case "upgrade": return <ArrowUp2 size={16} className="text-success" />;
      case "downgrade": return <ArrowDown2 size={16} className="text-warning" />;
      case "addon": return <AddCircle size={16} className="text-info" />;
      case "relocation": return <Location size={16} className="text-primary" />;
      default: return null;
    }
  };

  const typeLabel = (type: string) =>
    t(
      type === "upgrade" ? "Upgrade" : type === "downgrade" ? "Downgrade" : type === "addon" ? "Add-on" : "Relocation",
      type === "upgrade" ? "ترقية" : type === "downgrade" ? "تخفيض" : type === "addon" ? "خدمة إضافية" : "نقل الخدمة"
    );

  const resetFlow = () => {
    setFlowStep(0);
    setSelectedCurrentPlan("");
    setSelectedNewPlan("");
    setSelectedAddons([]);
    setRelocAddress("");
    setRelocCity("");
    setRelocAvailable(null);
    setRelocNotes("");
  };

  const openFlow = (type: "upgrade" | "downgrade" | "addon" | "relocation") => {
    resetFlow();
    setShowFlow(type);
  };

  const submitRequest = (type: string, desc: string, descAr: string) => {
    const newReq: Request = {
      id: `REQ-${3003 + requests.length - initialRequests.length}`,
      type,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      description: desc,
      descriptionAr: descAr,
      timeline: [
        { label: "Submitted", labelAr: "تم الإرسال", date: new Date().toISOString().split("T")[0], completed: true },
        { label: "Under Review", labelAr: "قيد المراجعة", date: "", completed: false },
        { label: "Processing", labelAr: "قيد المعالجة", date: "", completed: false },
        { label: "Completed", labelAr: "مكتمل", date: "", completed: false },
      ],
    };
    setRequests([newReq, ...requests]);
    setShowFlow(null);
    resetFlow();
    toast({ title: t("Request Submitted!", "تم إرسال الطلب!"), description: t(`Reference: ${newReq.id}`, `المرجع: ${newReq.id}`) });
  };

  const cancelRequest = (id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "cancelled" as const } : r));
    setShowDetail(null);
    toast({ title: t("Request Cancelled", "تم إلغاء الطلب") });
  };

  const checkCoverage = () => {
    setRelocAvailable(relocCity.toLowerCase().includes("muscat") || relocCity.toLowerCase().includes("مسقط") || relocCity.toLowerCase().includes("seeb") || relocCity.toLowerCase().includes("السيب"));
  };

  // Upgrade/Downgrade flow renderer
  const renderPlanFlow = (isUpgrade: boolean) => {
    const filteredPlans = isUpgrade
      ? internetPlans.filter((p) => currentService ? p.price > currentService.monthlyCost : true)
      : internetPlans.filter((p) => currentService ? p.price < currentService.monthlyCost : true);

    if (flowStep === 0) return (
      <div className="space-y-4">
        <Label>{t("Select Your Current Service", "اختر خدمتك الحالية")}</Label>
        <div className="space-y-2">
          {services.filter((s) => s.type === "internet").map((s) => (
            <button key={s.id} onClick={() => { setSelectedCurrentPlan(s.id); setFlowStep(1); }}
              className={cn("w-full p-3 rounded-lg border text-start flex justify-between items-center transition-colors hover:border-primary/30", selectedCurrentPlan === s.id && "border-primary bg-primary/5")}>
              <div>
                <p className="font-medium text-sm">{t(s.name, s.nameAr)}</p>
                <p className="text-xs text-muted-foreground">{s.speed}</p>
              </div>
              <span className="text-sm font-semibold">{s.monthlyCost} <OmrSymbol />/{t("mo", "شهر")}</span>
            </button>
          ))}
        </div>
      </div>
    );

    if (flowStep === 1) return (
      <div className="space-y-4">
        <Label>{t(isUpgrade ? "Select New Plan" : "Select Lower Plan", isUpgrade ? "اختر الباقة الجديدة" : "اختر باقة أقل")}</Label>
        {filteredPlans.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{t("No available plans", "لا توجد باقات متاحة")}</p>
        ) : (
          <div className="space-y-2">
            {filteredPlans.map((p) => (
              <button key={p.id} onClick={() => { setSelectedNewPlan(p.id); setFlowStep(2); }}
                className={cn("w-full p-3 rounded-lg border text-start flex justify-between items-center transition-colors hover:border-primary/30", selectedNewPlan === p.id && "border-primary bg-primary/5")}>
                <div>
                  <p className="font-medium text-sm">{t(p.name, p.nameAr)}</p>
                  <p className="text-xs text-muted-foreground">{p.speed}</p>
                </div>
                <span className="text-sm font-semibold">{p.price} <OmrSymbol />/{t("mo", "شهر")}</span>
              </button>
            ))}
          </div>
        )}
        <Button variant="outline" size="sm" onClick={() => setFlowStep(0)}>{t("Back", "رجوع")}</Button>
      </div>
    );

    // Review step
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold">{t("Review Your Request", "راجع طلبك")}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("Current Plan", "الباقة الحالية")}</span><span>{currentService && t(currentService.name, currentService.nameAr)}</span></div>
          <ArrowRight2 size={16} className="mx-auto text-muted-foreground" />
          <div className="flex justify-between"><span className="text-muted-foreground">{t("New Plan", "الباقة الجديدة")}</span><span className="font-semibold">{newPlanObj && t(newPlanObj.name, newPlanObj.nameAr)}</span></div>
          <Separator />
          <div className="flex justify-between"><span className="text-muted-foreground">{t("Price Change", "تغيير السعر")}</span>
            <span className={isUpgrade ? "text-warning" : "text-success"}>
              {currentService && newPlanObj && <>{isUpgrade ? "+" : ""}{(newPlanObj.price - currentService.monthlyCost).toFixed(2)} <OmrSymbol />/{t("mo", "شهر")}</>}
            </span>
          </div>
        </div>
        {!isUpgrade && (
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-3 text-sm text-warning">
              {t("⚠ Downgrading may reduce your speeds and features. Consider our retention offer: stay on your current plan and get 10% off for 3 months!", "⚠ التخفيض قد يقلل من سرعاتك وميزاتك. فكر في عرض الاحتفاظ: ابق على باقتك الحالية واحصل على خصم 10% لمدة 3 أشهر!")}
            </CardContent>
          </Card>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setFlowStep(1)}>{t("Back", "رجوع")}</Button>
          <Button onClick={() => submitRequest(isUpgrade ? "upgrade" : "downgrade",
            `${isUpgrade ? "Upgrade" : "Downgrade"} from ${currentService?.name} to ${newPlanObj?.name}`,
            `${isUpgrade ? "ترقية" : "تخفيض"} من ${currentService?.nameAr} إلى ${newPlanObj?.nameAr}`
          )}>{t("Submit Request", "إرسال الطلب")}</Button>
        </div>
      </div>
    );
  };

  // Add-on flow
  const renderAddonFlow = () => {
    if (flowStep === 0) return (
      <div className="space-y-4">
        <Label>{t("Select Add-ons", "اختر الخدمات الإضافية")}</Label>
        <div className="space-y-2">
          {addons.map((a) => (
            <button key={a.id} onClick={() => setSelectedAddons((prev) => prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id])}
              className={cn("w-full p-3 rounded-lg border text-start flex justify-between items-center transition-colors", selectedAddons.includes(a.id) ? "border-primary bg-primary/5" : "hover:border-primary/30")}>
              <div>
                <p className="font-medium text-sm">{t(a.name, a.nameAr)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{a.price} <OmrSymbol />/{t("mo", "شهر")}</span>
                {selectedAddons.includes(a.id) && <TickCircle size={16} className="text-success" variant="Bold" />}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowFlow(null)}>{t("Cancel", "إلغاء")}</Button>
          <Button disabled={selectedAddons.length === 0} onClick={() => setFlowStep(1)}>{t("Review", "مراجعة")} ({selectedAddons.length})</Button>
        </div>
      </div>
    );

    const selected = addons.filter((a) => selectedAddons.includes(a.id));
    const total = selected.reduce((s, a) => s + a.price, 0);
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold">{t("Review Add-ons", "مراجعة الخدمات الإضافية")}</p>
        <div className="space-y-2">
          {selected.map((a) => (
            <div key={a.id} className="flex justify-between text-sm"><span>{t(a.name, a.nameAr)}</span><span>{a.price} <OmrSymbol />/{t("mo", "شهر")}</span></div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm font-bold"><span>{t("Total", "الإجمالي")}</span><span>+{total} <OmrSymbol />/{t("mo", "شهر")}</span></div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setFlowStep(0)}>{t("Back", "رجوع")}</Button>
          <Button onClick={() => submitRequest("addon",
            `Add-ons: ${selected.map((a) => a.name).join(", ")}`,
            `خدمات إضافية: ${selected.map((a) => a.nameAr).join("، ")}`
          )}>{t("Confirm", "تأكيد")}</Button>
        </div>
      </div>
    );
  };

  // Relocation flow
  const renderRelocationFlow = () => {
    if (flowStep === 0) return (
      <div className="space-y-4">
        <Label>{t("New Address", "العنوان الجديد")}</Label>
        <Input value={relocAddress} onChange={(e) => setRelocAddress(e.target.value)} placeholder={t("Street / Villa / Building", "الشارع / الفيلا / المبنى")} maxLength={100} />
        <Label>{t("City / Area", "المدينة / المنطقة")}</Label>
        <Input value={relocCity} onChange={(e) => { setRelocCity(e.target.value); setRelocAvailable(null); }} placeholder={t("e.g. Muscat, Seeb", "مثال: مسقط، السيب")} maxLength={50} />
        {relocCity.trim() && (
          <Button variant="outline" size="sm" type="button" onClick={checkCoverage}>{t("Check Availability", "تحقق من التوفر")}</Button>
        )}
        {relocAvailable === true && <p className="text-sm text-success">✓ {t("Service available in this area!", "الخدمة متوفرة في هذه المنطقة!")}</p>}
        {relocAvailable === false && <p className="text-sm text-destructive">✗ {t("Service not yet available in this area.", "الخدمة غير متوفرة بعد في هذه المنطقة.")}</p>}
        <Label>{t("Additional Notes", "ملاحظات إضافية")}</Label>
        <Textarea value={relocNotes} onChange={(e) => setRelocNotes(e.target.value)} placeholder={t("Any special instructions...", "أي تعليمات خاصة...")} rows={2} maxLength={300} />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowFlow(null)}>{t("Cancel", "إلغاء")}</Button>
          <Button disabled={!relocAddress.trim() || !relocCity.trim() || relocAvailable !== true} onClick={() => setFlowStep(1)}>{t("Review", "مراجعة")}</Button>
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold">{t("Review Relocation", "مراجعة النقل")}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("New Address", "العنوان الجديد")}</span><span className="text-end max-w-[60%]">{relocAddress}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("City", "المدينة")}</span><span>{relocCity}</span></div>
          {relocNotes && <div className="flex justify-between"><span className="text-muted-foreground">{t("Notes", "ملاحظات")}</span><span className="text-right max-w-[60%]">{relocNotes}</span></div>}
          <Separator />
          <p className="text-xs text-muted-foreground">{t("A technician will be scheduled to visit your new location within 3-5 business days.", "سيتم جدولة زيارة فني لموقعك الجديد خلال 3-5 أيام عمل.")}</p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setFlowStep(0)}>{t("Back", "رجوع")}</Button>
          <Button onClick={() => submitRequest("relocation",
            `Relocate service to ${relocAddress}, ${relocCity}`,
            `نقل الخدمة إلى ${relocAddress}، ${relocCity}`
          )}>{t("Submit Request", "إرسال الطلب")}</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">{t("Service Requests", "طلبات الخدمة")}</h1>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { type: "upgrade" as const, icon: <ArrowUp2 size={20} />, label: t("Upgrade", "ترقية"), color: "text-success" },
          { type: "downgrade" as const, icon: <ArrowDown2 size={20} />, label: t("Downgrade", "تخفيض"), color: "text-warning" },
          { type: "addon" as const, icon: <AddCircle size={20} />, label: t("Add-on", "إضافة"), color: "text-info" },
          { type: "relocation" as const, icon: <Location size={20} />, label: t("Relocate", "نقل"), color: "text-primary" },
        ].map((action) => (
          <Card key={action.type} className="cursor-pointer card-shadow border-0 hover:card-shadow-md transition-all duration-200" onClick={() => openFlow(action.type)}>
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <span className={action.color}>{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Requests list */}
      <div>
        <h2 className="text-base font-semibold mb-3">{t("Your Requests", "طلباتك")} ({requests.length})</h2>
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="cursor-pointer card-shadow border-0 hover:card-shadow-md transition-all duration-200" onClick={() => setShowDetail(req.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {typeIcon(req.type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-sm">{req.id}</p>
                        <Badge variant="outline" className={cn("text-[10px]", statusColor(req.status))}>{statusLabel(req.status)}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{typeLabel(req.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(req.description, req.descriptionAr)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Request Detail with Timeline */}
      <Dialog open={!!selectedDetailReq} onOpenChange={() => setShowDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">{typeIcon(selectedDetailReq?.type || "")}{selectedDetailReq?.id}</DialogTitle>
            <DialogDescription>{selectedDetailReq && t(selectedDetailReq.description, selectedDetailReq.descriptionAr)}</DialogDescription>
          </DialogHeader>
          {selectedDetailReq && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-[10px]", statusColor(selectedDetailReq.status))}>{statusLabel(selectedDetailReq.status)}</Badge>
                <Badge variant="secondary" className="text-[10px]">{typeLabel(selectedDetailReq.type)}</Badge>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-1"><Timer1 size={14} />{t("Timeline", "الجدول الزمني")}</p>
                <div className="space-y-0">
                  {selectedDetailReq.timeline.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn("w-3 h-3 rounded-full border-2 shrink-0", step.completed ? "bg-success border-success" : "bg-background border-muted-foreground/30")} />
                        {i < selectedDetailReq.timeline.length - 1 && <div className={cn("w-0.5 h-8", step.completed ? "bg-success" : "bg-muted-foreground/20")} />}
                      </div>
                      <div className="pb-4">
                        <p className={cn("text-sm font-medium", !step.completed && "text-muted-foreground")}>{t(step.label, step.labelAr)}</p>
                        {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel button for pending/in_progress */}
              {(selectedDetailReq.status === "pending" || selectedDetailReq.status === "in_progress") && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => cancelRequest(selectedDetailReq.id)}>
                    <CloseCircle size={14} className="me-1" />{t("Cancel Request", "إلغاء الطلب")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade Flow */}
      <Dialog open={showFlow === "upgrade"} onOpenChange={() => setShowFlow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ArrowUp2 size={20} className="text-success" />{t("Upgrade Plan", "ترقية الباقة")}</DialogTitle>
            <DialogDescription>{t("Select your current service and choose a higher plan.", "اختر خدمتك الحالية واختر باقة أعلى.")}</DialogDescription>
          </DialogHeader>
          {renderPlanFlow(true)}
        </DialogContent>
      </Dialog>

      {/* Downgrade Flow */}
      <Dialog open={showFlow === "downgrade"} onOpenChange={() => setShowFlow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ArrowDown2 size={20} className="text-warning" />{t("Downgrade Plan", "تخفيض الباقة")}</DialogTitle>
            <DialogDescription>{t("Select your current service and choose a lower plan.", "اختر خدمتك الحالية واختر باقة أقل.")}</DialogDescription>
          </DialogHeader>
          {renderPlanFlow(false)}
        </DialogContent>
      </Dialog>

      {/* Add-on Flow */}
      <Dialog open={showFlow === "addon"} onOpenChange={() => setShowFlow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AddCircle size={20} className="text-info" />{t("Add-on Services", "خدمات إضافية")}</DialogTitle>
            <DialogDescription>{t("Browse and select add-ons for your service.", "تصفح واختر الإضافات لخدمتك.")}</DialogDescription>
          </DialogHeader>
          {renderAddonFlow()}
        </DialogContent>
      </Dialog>

      {/* Relocation Flow */}
      <Dialog open={showFlow === "relocation"} onOpenChange={() => setShowFlow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Location size={20} className="text-primary" />{t("Service Relocation", "نقل الخدمة")}</DialogTitle>
            <DialogDescription>{t("Move your service to a new address.", "انقل خدمتك إلى عنوان جديد.")}</DialogDescription>
          </DialogHeader>
          {renderRelocationFlow()}
        </DialogContent>
      </Dialog>
    </div>
  );
}