import { useState } from "react";
import { Add, Paperclip, TickCircle } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const requestTypes = [
  { value: "upgrade", en: "Upgrade Plan", ar: "ترقية الباقة" },
  { value: "downgrade", en: "Downgrade Plan", ar: "تخفيض الباقة" },
  { value: "addon", en: "Add-on Service", ar: "خدمة إضافية" },
  { value: "relocation", en: "Service Relocation", ar: "نقل الخدمة" },
];

const mockRequests = [
  { id: "REQ-3001", type: "upgrade", status: "in_progress" as const, date: "2024-07-25", description: "Upgrade from Fiber 100 to Fiber 200" },
  { id: "REQ-3002", type: "relocation", status: "completed" as const, date: "2024-06-10", description: "Move service to new villa in Al Ghubra" },
];

export default function RequestsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setShowSuccess(true);
  };

  const statusColor = (s: string) =>
    s === "completed" ? "text-success border-success/20" :
    s === "in_progress" ? "text-info border-info/20" :
    "text-warning border-warning/20";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("Service Requests", "طلبات الخدمة")}</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Add size={16} className="mr-1" />{t("New Request", "طلب جديد")}
        </Button>
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {mockRequests.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{req.id}</p>
                    <Badge variant="outline" className={cn("text-[10px]", statusColor(req.status))}>
                      {t(req.status === "in_progress" ? "In Progress" : "Completed",
                        req.status === "in_progress" ? "قيد التنفيذ" : "مكتمل")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs shrink-0">{t("Track", "تتبع")}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New request dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("New Service Request", "طلب خدمة جديد")}</DialogTitle>
            <DialogDescription>{t("Select the type of change you'd like to make.", "اختر نوع التغيير الذي ترغب فيه.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Request Type", "نوع الطلب")}</Label>
              <Select><SelectTrigger><SelectValue placeholder={t("Select type", "اختر النوع")} /></SelectTrigger>
                <SelectContent>{requestTypes.map((r) => (<SelectItem key={r.value} value={r.value}>{t(r.en, r.ar)}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("Details", "التفاصيل")}</Label>
              <Textarea placeholder={t("Describe your request...", "صف طلبك...")} />
            </div>
            <div className="space-y-2">
              <Label>{t("Attachments", "المرفقات")}</Label>
              <Button variant="outline" size="sm" type="button"><Paperclip size={16} className="mr-1" />{t("Attach File", "إرفاق ملف")}</Button>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">{t("Submit Request", "إرسال الطلب")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <div className="text-center py-4">
            <TickCircle size={48} className="text-success mx-auto mb-3" variant="Bold" />
            <h3 className="font-semibold text-lg">{t("Request Submitted!", "تم إرسال الطلب!")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("Reference: REQ-3003", "المرجع: REQ-3003")}</p>
            <p className="text-sm text-muted-foreground">{t("We'll process your request within 2-3 business days.", "سنقوم بمعالجة طلبك خلال 2-3 أيام عمل.")}</p>
            <Button className="mt-4" onClick={() => setShowSuccess(false)}>{t("Done", "تم")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
