import { useState, useRef } from "react";
import { Add, Send2, Paperclip, TickCircle, CloseCircle, Star1, Trash, DocumentText } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { tickets as initialTickets } from "@/data/mockData";
import { cn } from "@/lib/utils";

type Message = { sender: string; text: string; timestamp: string };
type Ticket = Omit<typeof initialTickets[0], 'priority' | 'status'> & { priority: string; status: string; attachments?: string[]; satisfaction?: number };

export default function SupportPage() {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detailFileRef = useRef<HTMLInputElement>(null);

  const [ticketList, setTicketList] = useState<Ticket[]>(initialTickets as Ticket[]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyTicketId, setSurveyTicketId] = useState<string | null>(null);
  const [surveyRating, setSurveyRating] = useState(0);

  // Create form state
  const [formCategory, setFormCategory] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState("");
  const [formAttachments, setFormAttachments] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedTicket = ticketList.find((tk) => tk.id === selectedTicketId) || null;

  const statusColor = (s: string) =>
    s === "open" ? "text-warning border-warning/20" :
    s === "in_progress" ? "text-info border-info/20" :
    s === "resolved" ? "text-success border-success/20" :
    "text-muted-foreground border-border";

  const statusLabel = (s: string) =>
    t(s === "open" ? "Open" : s === "in_progress" ? "In Progress" : s === "resolved" ? "Resolved" : "Closed",
      s === "open" ? "مفتوح" : s === "in_progress" ? "قيد المعالجة" : s === "resolved" ? "تم الحل" : "مغلق");

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formCategory) errors.category = t("Category is required", "الفئة مطلوبة");
    if (!formSubject.trim()) errors.subject = t("Subject is required", "الموضوع مطلوب");
    else if (formSubject.trim().length < 5) errors.subject = t("Subject must be at least 5 characters", "الموضوع يجب أن يكون 5 أحرف على الأقل");
    if (!formDescription.trim()) errors.description = t("Description is required", "الوصف مطلوب");
    else if (formDescription.trim().length < 10) errors.description = t("Description must be at least 10 characters", "الوصف يجب أن يكون 10 أحرف على الأقل");
    if (!formPriority) errors.priority = t("Priority is required", "الأولوية مطلوبة");
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTicket: Ticket = {
      id: `TKT-${1005 + ticketList.length - initialTickets.length}`,
      category: formCategory.charAt(0).toUpperCase() + formCategory.slice(1),
      categoryAr: formCategory === "internet" ? "الإنترنت" : formCategory === "tv" ? "التلفزيون" : formCategory === "billing" ? "الفواتير" : "التركيب",
      subject: formSubject,
      subjectAr: formSubject,
      status: "open" as const,
      priority: formPriority as "low" | "medium" | "high",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{ sender: "customer", text: formDescription, timestamp: new Date().toISOString() }],
      attachments: formAttachments,
    };

    setTicketList([newTicket, ...ticketList]);
    setShowCreate(false);
    resetForm();
    toast({ title: t("Ticket Created", "تم إنشاء التذكرة"), description: t(`Reference: ${newTicket.id}`, `المرجع: ${newTicket.id}`) });
  };

  const resetForm = () => {
    setFormCategory(""); setFormSubject(""); setFormDescription(""); setFormPriority("");
    setFormAttachments([]); setFormErrors({});
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isDetail?: boolean) => {
    const files = e.target.files;
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    if (isDetail && selectedTicketId) {
      // Show attachment in toast for detail view
      toast({ title: t("File attached", "تم إرفاق الملف"), description: names.join(", ") });
    } else {
      setFormAttachments((prev) => [...prev, ...names]);
    }
    e.target.value = "";
  };

  const handleReply = () => {
    if (!reply.trim() || !selectedTicketId) return;
    setTicketList((prev) =>
      prev.map((tk) =>
        tk.id === selectedTicketId
          ? { ...tk, messages: [...tk.messages, { sender: "customer", text: reply, timestamp: new Date().toISOString() }], updatedAt: new Date().toISOString() }
          : tk
      )
    );
    setReply("");
    toast({ title: t("Reply Sent", "تم إرسال الرد") });
  };

  const handleStatusChange = (ticketId: string, newStatus: "closed" | "open") => {
    setTicketList((prev) =>
      prev.map((tk) => tk.id === ticketId ? { ...tk, status: newStatus as any, updatedAt: new Date().toISOString() } : tk)
    );
    if (newStatus === "closed") {
      setSelectedTicketId(null);
      setSurveyTicketId(ticketId);
      setShowSurvey(true);
    } else {
      toast({ title: t("Ticket Reopened", "تم إعادة فتح التذكرة") });
    }
  };

  const handleSurveySubmit = () => {
    if (surveyTicketId) {
      setTicketList((prev) => prev.map((tk) => tk.id === surveyTicketId ? { ...tk, satisfaction: surveyRating } : tk));
    }
    setShowSurvey(false);
    setSurveyTicketId(null);
    setSurveyRating(0);
    toast({ title: t("Thank you for your feedback!", "شكراً لملاحظاتك!") });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">{t("Support Tickets", "تذاكر الدعم")}</h1>
        <Button size="sm" className="rounded-xl" onClick={() => { resetForm(); setShowCreate(true); }}>
          <Add size={16} className="me-1" />{t("New Ticket", "تذكرة جديدة")}
        </Button>
      </div>

      <Tabs defaultValue="all" dir={dir}>
        <TabsList>
          <TabsTrigger value="all">{t("All", "الكل")} ({ticketList.length})</TabsTrigger>
          <TabsTrigger value="open">{t("Open", "مفتوح")} ({ticketList.filter((t) => t.status === "open").length})</TabsTrigger>
          <TabsTrigger value="in_progress">{t("In Progress", "قيد المعالجة")} ({ticketList.filter((t) => t.status === "in_progress").length})</TabsTrigger>
          <TabsTrigger value="resolved">{t("Resolved", "تم الحل")} ({ticketList.filter((t) => t.status === "resolved").length})</TabsTrigger>
        </TabsList>

        {["all", "open", "in_progress", "resolved", "closed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            {ticketList
              .filter((tk) => tab === "all" || tk.status === tab)
              .map((ticket) => (
                <Card key={ticket.id} className="cursor-pointer card-shadow border-0 hover:card-shadow-md transition-all duration-200" onClick={() => setSelectedTicketId(ticket.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">{ticket.id}</span>
                          <Badge variant="outline" className={cn("text-[10px]", statusColor(ticket.status))}>{statusLabel(ticket.status)}</Badge>
                          <Badge variant="outline" className="text-[10px]">{t(ticket.category, ticket.categoryAr)}</Badge>
                          {ticket.priority === "high" && <Badge variant="destructive" className="text-[10px]">{t("High", "عالي")}</Badge>}
                        </div>
                        <p className="font-medium text-sm">{t(ticket.subject, ticket.subjectAr)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                      {ticket.satisfaction && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star1 key={s} size={12} variant={s <= ticket.satisfaction! ? "Bold" : "Linear"} className={s <= ticket.satisfaction! ? "text-warning" : "text-muted-foreground/30"} />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            {ticketList.filter((tk) => tab === "all" || tk.status === tab).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">{t("No tickets found", "لا توجد تذاكر")}</p>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Ticket detail dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicketId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm">{selectedTicket?.id} — {selectedTicket && t(selectedTicket.subject, selectedTicket.subjectAr)}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn("text-[10px]", selectedTicket && statusColor(selectedTicket.status))}>
                  {selectedTicket && statusLabel(selectedTicket.status)}
                </Badge>
                <Badge variant="outline" className="text-[10px]">{selectedTicket && t(selectedTicket.category, selectedTicket.categoryAr)}</Badge>
                <span className="text-xs text-muted-foreground">{selectedTicket && new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Messages thread */}
          <div className="space-y-3 max-h-60 overflow-y-auto pe-1">
            {selectedTicket?.messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.sender === "customer" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-lg px-3 py-2 text-sm", msg.sender === "customer" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  <p className="text-[10px] font-medium mb-0.5 opacity-70">{msg.sender === "customer" ? t("You", "أنت") : t("Support Agent", "وكيل الدعم")}</p>
                  <p>{msg.text}</p>
                  <p className={cn("text-[10px] mt-1", msg.sender === "customer" ? "text-primary-foreground/70" : "text-muted-foreground")}>{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attachments display */}
          {selectedTicket?.attachments && selectedTicket.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTicket.attachments.map((f, i) => (
                <Badge key={i} variant="secondary" className="text-xs gap-1"><DocumentText size={12} />{f}</Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Reply + actions */}
          {selectedTicket?.status !== "closed" ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder={t("Type your reply...", "اكتب ردك...")} onKeyDown={(e) => e.key === "Enter" && handleReply()} maxLength={500} />
                <input ref={detailFileRef} type="file" className="hidden" onChange={(e) => handleFileSelect(e, true)} />
                <Button variant="ghost" size="icon" onClick={() => detailFileRef.current?.click()}><Paperclip size={16} /></Button>
                <Button size="icon" onClick={handleReply} disabled={!reply.trim()}><Send2 size={16} /></Button>
              </div>
              <div className="flex gap-2 justify-end">
                {(selectedTicket?.status === "resolved" || selectedTicket?.status === "open" || selectedTicket?.status === "in_progress") && (
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => selectedTicket && handleStatusChange(selectedTicket.id, "closed")}>
                    <CloseCircle size={14} className="me-1" />{t("Close Ticket", "إغلاق التذكرة")}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">{t("This ticket is closed.", "هذه التذكرة مغلقة.")}</p>
              <Button variant="outline" size="sm" onClick={() => selectedTicket && handleStatusChange(selectedTicket.id, "open")}>
                {t("Reopen Ticket", "إعادة فتح التذكرة")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create ticket with validation */}
      <Dialog open={showCreate} onOpenChange={(open) => { setShowCreate(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Create Support Ticket", "إنشاء تذكرة دعم")}</DialogTitle>
            <DialogDescription>{t("Describe your issue and we'll help you.", "صف مشكلتك وسنساعدك.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Category", "الفئة")} <span className="text-destructive">*</span></Label>
              <Select value={formCategory} onValueChange={(v) => { setFormCategory(v); setFormErrors((e) => ({ ...e, category: "" })); }}>
                <SelectTrigger className={formErrors.category ? "border-destructive" : ""}><SelectValue placeholder={t("Select category", "اختر الفئة")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internet">{t("Internet", "الإنترنت")}</SelectItem>
                  <SelectItem value="tv">{t("TV", "التلفزيون")}</SelectItem>
                  <SelectItem value="billing">{t("Billing", "الفواتير")}</SelectItem>
                  <SelectItem value="installation">{t("Installation", "التركيب")}</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.category && <p className="text-xs text-destructive">{formErrors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("Subject", "الموضوع")} <span className="text-destructive">*</span></Label>
              <Input
                value={formSubject}
                onChange={(e) => { setFormSubject(e.target.value); setFormErrors((err) => ({ ...err, subject: "" })); }}
                placeholder={t("Brief description of your issue", "وصف مختصر لمشكلتك")}
                className={formErrors.subject ? "border-destructive" : ""}
                maxLength={100}
              />
              {formErrors.subject && <p className="text-xs text-destructive">{formErrors.subject}</p>}
              <p className="text-xs text-muted-foreground text-end">{formSubject.length}/100</p>
            </div>

            <div className="space-y-2">
              <Label>{t("Description", "الوصف")} <span className="text-destructive">*</span></Label>
              <Textarea
                value={formDescription}
                onChange={(e) => { setFormDescription(e.target.value); setFormErrors((err) => ({ ...err, description: "" })); }}
                placeholder={t("Provide detailed information about your issue...", "قدم معلومات تفصيلية عن مشكلتك...")}
                rows={3}
                className={formErrors.description ? "border-destructive" : ""}
                maxLength={500}
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
              <p className="text-xs text-muted-foreground text-end">{formDescription.length}/500</p>
            </div>

            <div className="space-y-2">
              <Label>{t("Priority", "الأولوية")} <span className="text-destructive">*</span></Label>
              <Select value={formPriority} onValueChange={(v) => { setFormPriority(v); setFormErrors((e) => ({ ...e, priority: "" })); }}>
                <SelectTrigger className={formErrors.priority ? "border-destructive" : ""}><SelectValue placeholder={t("Select priority", "اختر الأولوية")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("Low", "منخفض")}</SelectItem>
                  <SelectItem value="medium">{t("Medium", "متوسط")}</SelectItem>
                  <SelectItem value="high">{t("High", "عالي")}</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.priority && <p className="text-xs text-destructive">{formErrors.priority}</p>}
            </div>

            {/* File attachment */}
            <div className="space-y-2">
              <Label>{t("Attachments", "المرفقات")}</Label>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFileSelect(e)} accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" />
              <Button variant="outline" size="sm" type="button" onClick={() => fileInputRef.current?.click()}>
                <Paperclip size={16} className="me-1" />{t("Attach Files", "إرفاق ملفات")}
              </Button>
              <p className="text-xs text-muted-foreground">{t("JPG, PNG, PDF, DOC (max 5MB each)", "JPG, PNG, PDF, DOC (بحد أقصى 5 ميجا لكل ملف)")}</p>
              {formAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {formAttachments.map((f, i) => (
                    <Badge key={i} variant="secondary" className="text-xs gap-1">
                      <DocumentText size={12} />{f}
                      <button type="button" onClick={() => setFormAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="ms-1 hover:text-destructive"><Trash size={10} /></button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => { setShowCreate(false); resetForm(); }}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">{t("Submit Ticket", "إرسال التذكرة")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Satisfaction Survey Dialog */}
      <Dialog open={showSurvey} onOpenChange={setShowSurvey}>
        <DialogContent>
          <div className="text-center py-2">
            <TickCircle size={40} className="text-success mx-auto mb-2" variant="Bold" />
            <h3 className="font-semibold text-lg">{t("Ticket Closed", "تم إغلاق التذكرة")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("How would you rate your support experience?", "كيف تقيم تجربة الدعم الخاصة بك؟")}</p>
          </div>
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setSurveyRating(s)} className="transition-transform hover:scale-110">
                <Star1 size={32} variant={s <= surveyRating ? "Bold" : "Linear"} className={s <= surveyRating ? "text-warning" : "text-muted-foreground/30"} />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {surveyRating === 0 ? t("Tap a star to rate", "انقر على نجمة للتقييم") :
             surveyRating <= 2 ? t("We're sorry to hear that", "نأسف لسماع ذلك") :
             surveyRating <= 3 ? t("Thank you for the feedback", "شكراً لملاحظاتك") :
             t("Glad we could help!", "سعداء أننا استطعنا المساعدة!")}
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => { setShowSurvey(false); setSurveyRating(0); }}>{t("Skip", "تخطي")}</Button>
            <Button onClick={handleSurveySubmit} disabled={surveyRating === 0}>{t("Submit Rating", "إرسال التقييم")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}