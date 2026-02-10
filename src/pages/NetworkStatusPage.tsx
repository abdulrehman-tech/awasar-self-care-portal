import { useState } from "react";
import { Wifi, Warning2, Clock, Notification, MessageQuestion, TickCircle, CloseCircle, Send2, Timer1 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { networkStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

type NotifyState = Record<string, boolean>;

const historicalOutages = [
  { id: 1, region: "Seeb", regionAr: "السيب", issue: "Fiber cut on main trunk", issueAr: "قطع في الألياف الرئيسية", start: "2024-07-20T08:00:00", end: "2024-07-20T14:30:00", duration: "6h 30m", status: "resolved" },
  { id: 2, region: "Muscat", regionAr: "مسقط", issue: "Power outage affecting equipment", issueAr: "انقطاع كهرباء أثر على المعدات", start: "2024-07-10T22:00:00", end: "2024-07-11T02:00:00", duration: "4h", status: "resolved" },
  { id: 3, region: "Salalah", regionAr: "صلالة", issue: "Weather-related service disruption", issueAr: "انقطاع خدمة بسبب الطقس", start: "2024-06-28T06:00:00", end: "2024-06-28T18:00:00", duration: "12h", status: "resolved" },
  { id: 4, region: "Sohar", regionAr: "صحار", issue: "Scheduled maintenance overrun", issueAr: "تجاوز وقت الصيانة المجدولة", start: "2024-06-15T01:00:00", end: "2024-06-15T05:00:00", duration: "4h", status: "resolved" },
  { id: 5, region: "Nizwa", regionAr: "نزوى", issue: "Hardware failure at local node", issueAr: "عطل في المعدات بالعقدة المحلية", start: "2024-06-01T10:00:00", end: "2024-06-01T16:00:00", duration: "6h", status: "resolved" },
];

export default function NetworkStatusPage() {
  const { t, dir } = useLanguage();
  const { toast } = useToast();

  const [notifyState, setNotifyState] = useState<NotifyState>({});
  const [confirmRegion, setConfirmRegion] = useState<string | null>(null);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [reportRegion, setReportRegion] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportErrors, setReportErrors] = useState<Record<string, string>>({});

  const statusConfig = {
    operational: { color: "bg-success", label: t("Operational", "يعمل"), badge: "text-success border-success/20" },
    degraded: { color: "bg-warning", label: t("Degraded", "متدهور"), badge: "text-warning border-warning/20" },
    outage: { color: "bg-destructive", label: t("Outage", "انقطاع"), badge: "text-destructive border-destructive/20" },
  };

  const outages = networkStatus.filter((n) => n.status !== "operational");

  const handleNotifyToggle = (region: string) => {
    const isCurrentlyOn = notifyState[region];
    if (isCurrentlyOn) {
      // Turn off directly
      setNotifyState((prev) => ({ ...prev, [region]: false }));
      toast({ title: t("Notifications disabled", "تم تعطيل الإشعارات"), description: t(`You won't receive alerts for ${region}.`, `لن تتلقى تنبيهات لمنطقة ${region}.`) });
    } else {
      // Show confirmation dialog
      setConfirmRegion(region);
    }
  };

  const confirmNotify = () => {
    if (confirmRegion) {
      setNotifyState((prev) => ({ ...prev, [confirmRegion]: true }));
      toast({ title: t("Notifications enabled", "تم تفعيل الإشعارات"), description: t(`You'll receive alerts for ${confirmRegion} outages.`, `ستتلقى تنبيهات لانقطاعات منطقة ${confirmRegion}.`) });
    }
    setConfirmRegion(null);
  };

  const validateReport = () => {
    const errors: Record<string, string> = {};
    if (!reportRegion) errors.region = t("Region is required", "المنطقة مطلوبة");
    if (!reportType) errors.type = t("Issue type is required", "نوع المشكلة مطلوب");
    if (!reportDescription.trim()) errors.description = t("Description is required", "الوصف مطلوب");
    else if (reportDescription.trim().length < 10) errors.description = t("At least 10 characters", "10 أحرف على الأقل");
    setReportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReport()) return;
    setShowReportIssue(false);
    setReportRegion(""); setReportType(""); setReportDescription(""); setReportErrors({});
    toast({ title: t("Issue Reported", "تم الإبلاغ عن المشكلة"), description: t("Thank you. Our team will investigate and update you.", "شكراً لك. سيقوم فريقنا بالتحقيق وتحديثك.") });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("Network Status", "حالة الشبكة")}</h1>
        <Button size="sm" variant="outline" onClick={() => { setReportErrors({}); setShowReportIssue(true); }}>
          <MessageQuestion size={16} className="me-1" />{t("Report Issue", "الإبلاغ عن مشكلة")}
        </Button>
      </div>

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
                    <Switch
                      checked={!!notifyState[n.region]}
                      onCheckedChange={() => handleNotifyToggle(n.region)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Outage Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Timer1 size={16} className="text-muted-foreground" />
            {t("Outage History", "سجل الانقطاعات")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {historicalOutages.map((outage) => (
              <div key={outage.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className="mt-1 h-2 w-2 rounded-full bg-success shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{t(outage.region, outage.regionAr)}</p>
                    <Badge variant="outline" className="text-[10px] text-success border-success/20 shrink-0">{t("Resolved", "تم الحل")}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t(outage.issue, outage.issueAr)}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{new Date(outage.start).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{t("Duration:", "المدة:")} {outage.duration}</span>
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

      {/* Notification Opt-in Confirmation Dialog */}
      <Dialog open={!!confirmRegion} onOpenChange={() => setConfirmRegion(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("Enable Notifications", "تفعيل الإشعارات")}</DialogTitle>
            <DialogDescription>
              {t(
                `You'll receive SMS and email alerts when there are outages or maintenance in ${confirmRegion}.`,
                `ستتلقى تنبيهات عبر الرسائل والبريد عند وجود انقطاعات أو صيانة في ${confirmRegion}.`
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Notification size={14} className="text-primary" />
                <span>{t("SMS to +968 9123 4567", "رسالة نصية إلى +968 9123 4567")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Notification size={14} className="text-primary" />
                <span>{t("Email to ahmed.balushi@email.com", "بريد إلى ahmed.balushi@email.com")}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setConfirmRegion(null)}>{t("Cancel", "إلغاء")}</Button>
              <Button size="sm" onClick={confirmNotify}>
                <TickCircle size={14} className="me-1" />{t("Enable", "تفعيل")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={showReportIssue} onOpenChange={(open) => { setShowReportIssue(open); if (!open) { setReportRegion(""); setReportType(""); setReportDescription(""); setReportErrors({}); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Report a Network Issue", "الإبلاغ عن مشكلة في الشبكة")}</DialogTitle>
            <DialogDescription>{t("Help us identify issues in your area.", "ساعدنا في تحديد المشاكل في منطقتك.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Region", "المنطقة")} <span className="text-destructive">*</span></Label>
              <Select value={reportRegion} onValueChange={(v) => { setReportRegion(v); setReportErrors((e) => ({ ...e, region: "" })); }}>
                <SelectTrigger className={reportErrors.region ? "border-destructive" : ""}><SelectValue placeholder={t("Select your region", "اختر منطقتك")} /></SelectTrigger>
                <SelectContent>
                  {networkStatus.map((n) => (
                    <SelectItem key={n.region} value={n.region}>{t(n.region, n.regionAr)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {reportErrors.region && <p className="text-xs text-destructive">{reportErrors.region}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("Issue Type", "نوع المشكلة")} <span className="text-destructive">*</span></Label>
              <Select value={reportType} onValueChange={(v) => { setReportType(v); setReportErrors((e) => ({ ...e, type: "" })); }}>
                <SelectTrigger className={reportErrors.type ? "border-destructive" : ""}><SelectValue placeholder={t("Select issue type", "اختر نوع المشكلة")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_connection">{t("No Connection", "لا يوجد اتصال")}</SelectItem>
                  <SelectItem value="slow_speed">{t("Slow Speed", "سرعة بطيئة")}</SelectItem>
                  <SelectItem value="intermittent">{t("Intermittent Connection", "اتصال متقطع")}</SelectItem>
                  <SelectItem value="tv_issues">{t("TV Service Issues", "مشاكل خدمة التلفزيون")}</SelectItem>
                  <SelectItem value="other">{t("Other", "أخرى")}</SelectItem>
                </SelectContent>
              </Select>
              {reportErrors.type && <p className="text-xs text-destructive">{reportErrors.type}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("Description", "الوصف")} <span className="text-destructive">*</span></Label>
              <Textarea
                value={reportDescription}
                onChange={(e) => { setReportDescription(e.target.value); setReportErrors((err) => ({ ...err, description: "" })); }}
                placeholder={t("Describe the issue you're experiencing...", "صف المشكلة التي تواجهها...")}
                rows={3}
                className={reportErrors.description ? "border-destructive" : ""}
                maxLength={500}
              />
              {reportErrors.description && <p className="text-xs text-destructive">{reportErrors.description}</p>}
              <p className="text-xs text-muted-foreground text-end">{reportDescription.length}/500</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setShowReportIssue(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">
                <Send2 size={14} className="me-1" />{t("Submit Report", "إرسال البلاغ")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
