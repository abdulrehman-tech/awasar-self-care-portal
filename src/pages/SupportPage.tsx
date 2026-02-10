import { useState } from "react";
import { Add, Send2, Paperclip } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { tickets } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const [reply, setReply] = useState("");

  const statusColor = (s: string) =>
    s === "open" ? "text-warning border-warning/20" :
    s === "in_progress" ? "text-info border-info/20" :
    s === "resolved" ? "text-success border-success/20" :
    "text-muted-foreground border-border";

  const statusLabel = (s: string) =>
    t(s === "open" ? "Open" : s === "in_progress" ? "In Progress" : s === "resolved" ? "Resolved" : "Closed",
      s === "open" ? "مفتوح" : s === "in_progress" ? "قيد المعالجة" : s === "resolved" ? "تم الحل" : "مغلق");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreate(false);
    toast({ title: t("Ticket Created", "تم إنشاء التذكرة"), description: t("Reference: TKT-1005", "المرجع: TKT-1005") });
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    toast({ title: t("Reply Sent", "تم إرسال الرد") });
    setReply("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("Support Tickets", "تذاكر الدعم")}</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Add size={16} className="mr-1" />{t("New Ticket", "تذكرة جديدة")}
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("All", "الكل")}</TabsTrigger>
          <TabsTrigger value="open">{t("Open", "مفتوح")}</TabsTrigger>
          <TabsTrigger value="in_progress">{t("In Progress", "قيد المعالجة")}</TabsTrigger>
          <TabsTrigger value="resolved">{t("Resolved", "تم الحل")}</TabsTrigger>
        </TabsList>

        {["all", "open", "in_progress", "resolved", "closed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            {tickets
              .filter((tk) => tab === "all" || tk.status === tab)
              .map((ticket) => (
                <Card key={ticket.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedTicket(ticket)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">{ticket.id}</span>
                          <Badge variant="outline" className={cn("text-[10px]", statusColor(ticket.status))}>{statusLabel(ticket.status)}</Badge>
                          <Badge variant="outline" className="text-[10px]">{t(ticket.category, ticket.categoryAr)}</Badge>
                        </div>
                        <p className="font-medium text-sm">{t(ticket.subject, ticket.subjectAr)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Ticket detail */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">{selectedTicket?.id} — {selectedTicket && t(selectedTicket.subject, selectedTicket.subjectAr)}</DialogTitle>
            <DialogDescription>
              <Badge variant="outline" className={cn("text-[10px]", selectedTicket && statusColor(selectedTicket.status))}>
                {selectedTicket && statusLabel(selectedTicket.status)}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {selectedTicket?.messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.sender === "customer" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", msg.sender === "customer" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p>{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", msg.sender === "customer" ? "text-primary-foreground/70" : "text-muted-foreground")}>{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder={t("Type your reply...", "اكتب ردك...")} onKeyDown={(e) => e.key === "Enter" && handleReply()} />
            <Button size="icon" onClick={handleReply}><Send2 size={16} /></Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create ticket */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Create Support Ticket", "إنشاء تذكرة دعم")}</DialogTitle>
            <DialogDescription>{t("Describe your issue and we'll help you.", "صف مشكلتك وسنساعدك.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Category", "الفئة")}</Label>
              <Select><SelectTrigger><SelectValue placeholder={t("Select", "اختر")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internet">{t("Internet", "الإنترنت")}</SelectItem>
                  <SelectItem value="tv">{t("TV", "التلفزيون")}</SelectItem>
                  <SelectItem value="billing">{t("Billing", "الفواتير")}</SelectItem>
                  <SelectItem value="installation">{t("Installation", "التركيب")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("Subject", "الموضوع")}</Label>
              <Input placeholder={t("Brief description", "وصف مختصر")} />
            </div>
            <div className="space-y-2">
              <Label>{t("Description", "الوصف")}</Label>
              <Textarea placeholder={t("Provide details...", "قدم التفاصيل...")} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>{t("Priority", "الأولوية")}</Label>
              <Select><SelectTrigger><SelectValue placeholder={t("Select", "اختر")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("Low", "منخفض")}</SelectItem>
                  <SelectItem value="medium">{t("Medium", "متوسط")}</SelectItem>
                  <SelectItem value="high">{t("High", "عالي")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" type="button"><Paperclip size={16} className="mr-1" />{t("Attach", "إرفاق")}</Button>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">{t("Submit", "إرسال")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
