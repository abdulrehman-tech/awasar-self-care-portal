import { useState } from "react";
import { Box, Call, User, TickCircle, Calendar, Star1, MessageText, CloseCircle, Add } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { orders as initialOrders, plans } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import OmrSymbol from "@/components/OmrSymbol";

type Order = typeof initialOrders[0] & { feedback?: { rating: number; comment: string } };

export default function OrdersPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState<Order[]>(initialOrders as Order[]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrderStep, setNewOrderStep] = useState(0);

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");

  // Contact technician state
  const [contactMessage, setContactMessage] = useState("");

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");

  // New order state
  const [selectedPlan, setSelectedPlan] = useState("");
  const [newOrderName, setNewOrderName] = useState("");
  const [newOrderPhone, setNewOrderPhone] = useState("");
  const [newOrderAddress, setNewOrderAddress] = useState("");

  const selectedOrder = orderList.find((o) => o.id === selectedOrderId);
  const selectedPlanObj = plans.find((p) => p.id === selectedPlan);

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleSlot) return;
    toast({
      title: t("Installation Rescheduled", "تم إعادة جدولة التركيب"),
      description: t(`New date: ${rescheduleDate}, ${rescheduleSlot}`, `التاريخ الجديد: ${rescheduleDate}، ${rescheduleSlot}`),
    });
    setShowReschedule(false);
    setRescheduleDate("");
    setRescheduleSlot("");
  };

  const handleContactTech = () => {
    if (!contactMessage.trim()) return;
    toast({ title: t("Message Sent to Technician", "تم إرسال الرسالة للفني"), description: t("They will respond shortly.", "سيتم الرد قريباً.") });
    setShowContact(false);
    setContactMessage("");
  };

  const handleFeedback = () => {
    if (!feedbackRating || !selectedOrderId) return;
    setOrderList((prev) => prev.map((o) => o.id === selectedOrderId ? { ...o, feedback: { rating: feedbackRating, comment: feedbackComment } } : o));
    toast({ title: t("Thank you for your feedback!", "شكراً لملاحظاتك!") });
    setShowFeedback(false);
    setFeedbackRating(0);
    setFeedbackComment("");
  };

  const handleNewOrder = () => {
    if (!selectedPlanObj || !newOrderName.trim() || !newOrderAddress.trim()) return;
    const newOrder: Order = {
      id: `ORD-${5002 + orderList.length - initialOrders.length}`,
      type: "New Installation",
      typeAr: "تركيب جديد",
      service: selectedPlanObj.name,
      status: "technician_assigned" as any,
      steps: [
        { label: "Placed", labelAr: "تم الطلب", date: new Date().toISOString().split("T")[0], completed: true },
        { label: "Confirmed", labelAr: "تم التأكيد", date: "", completed: false },
        { label: "Scheduled", labelAr: "تم الجدولة", date: "", completed: false },
        { label: "Technician Assigned", labelAr: "تم تعيين فني", date: "", completed: false },
        { label: "Installed", labelAr: "تم التركيب", date: "", completed: false },
        { label: "Active", labelAr: "نشط", date: "", completed: false },
      ],
      technician: null as any,
    };
    setOrderList([newOrder, ...orderList]);
    setShowNewOrder(false);
    setNewOrderStep(0);
    setSelectedPlan("");
    setNewOrderName("");
    setNewOrderPhone("");
    setNewOrderAddress("");
    toast({ title: t("Order Placed!", "تم تقديم الطلب!"), description: t(`Reference: ${newOrder.id}`, `المرجع: ${newOrder.id}`) });
  };

  const isInstallationComplete = (order: Order) => order.steps.every((s) => s.completed);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("Order & Installation Tracking", "تتبع الطلبات والتركيب")}</h1>
        <Button size="sm" className="rounded-xl" onClick={() => { setNewOrderStep(0); setShowNewOrder(true); }}>
          <Add size={16} className="me-1" />{t("New Order", "طلب جديد")}
        </Button>
      </div>

      {orderList.length === 0 && (
        <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">{t("No orders yet.", "لا توجد طلبات بعد.")}</CardContent></Card>
      )}

      {orderList.map((order) => (
        <Card key={order.id} className="cursor-pointer card-shadow border-0 hover:card-shadow-md transition-all duration-200" onClick={() => setSelectedOrderId(order.id)}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{order.id} — {t(order.type, order.typeAr)}</CardTitle>
              <Badge variant="outline" className={cn("text-[10px]", isInstallationComplete(order) ? "text-success border-success/20" : "text-info border-info/20")}>
                {isInstallationComplete(order) ? t("Completed", "مكتمل") : t("In Progress", "قيد التنفيذ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.service}</p>
          </CardHeader>
          <CardContent>
            {/* Step progress bar */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center min-w-[500px]">
                {order.steps.map((step, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center text-center">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                        step.completed ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                      )}>
                        {step.completed ? <TickCircle size={16} variant="Bold" /> : i + 1}
                      </div>
                      <p className={cn("text-[10px] mt-1 max-w-[70px]", step.completed ? "font-medium" : "text-muted-foreground")}>
                        {t(step.label, step.labelAr)}
                      </p>
                      {step.date && <p className="text-[9px] text-muted-foreground">{step.date}</p>}
                    </div>
                    {i < order.steps.length - 1 && (
                      <div className={cn("flex-1 h-0.5 mx-1", step.completed ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            {order.feedback && (
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star1 key={s} size={12} variant={s <= order.feedback!.rating ? "Bold" : "Linear"} className={s <= order.feedback!.rating ? "text-warning" : "text-muted-foreground/30"} />
                ))}
                <span className="text-xs text-muted-foreground ms-1">{t("Feedback submitted", "تم إرسال الملاحظات")}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrderId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedOrder?.id} — {selectedOrder && t(selectedOrder.type, selectedOrder.typeAr)}</DialogTitle>
            <DialogDescription>{selectedOrder?.service}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5">
              {/* Progress */}
              <div className="overflow-x-auto pb-2">
                <div className="flex items-center min-w-[450px]">
                  {selectedOrder.steps.map((step, i) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center text-center">
                        <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium border-2", step.completed ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card text-muted-foreground")}>
                          {step.completed ? <TickCircle size={14} variant="Bold" /> : i + 1}
                        </div>
                        <p className={cn("text-[9px] mt-1 max-w-[60px]", step.completed ? "font-medium" : "text-muted-foreground")}>{t(step.label, step.labelAr)}</p>
                        {step.date && <p className="text-[8px] text-muted-foreground">{step.date}</p>}
                      </div>
                      {i < selectedOrder.steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-1", step.completed ? "bg-primary" : "bg-border")} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technician info */}
              {selectedOrder.technician && (
                <Card className="bg-muted/50">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t(selectedOrder.technician.name, selectedOrder.technician.nameAr)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Call size={12} /> {selectedOrder.technician.phone}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setShowContact(true); }}>
                      <MessageText size={14} className="me-1" />{t("Message", "رسالة")}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Audit trail */}
              <div>
                <p className="text-sm font-semibold mb-2">{t("Order Timeline", "الجدول الزمني")}</p>
                <div className="space-y-0">
                  {selectedOrder.steps.filter((s) => s.completed).map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
                        {i < selectedOrder.steps.filter((s) => s.completed).length - 1 && <div className="w-0.5 h-6 bg-success/30" />}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-medium">{t(step.label, step.labelAr)}</p>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 justify-end">
                {!isInstallationComplete(selectedOrder) && (
                  <Button variant="outline" size="sm" onClick={() => setShowReschedule(true)}>
                    <Calendar size={14} className="me-1" />{t("Reschedule", "إعادة الجدولة")}
                  </Button>
                )}
                {isInstallationComplete(selectedOrder) && !selectedOrder.feedback && (
                  <Button variant="outline" size="sm" onClick={() => setShowFeedback(true)}>
                    <Star1 size={14} className="me-1" />{t("Give Feedback", "أعط ملاحظات")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar size={20} />{t("Reschedule Installation", "إعادة جدولة التركيب")}</DialogTitle>
            <DialogDescription>{t("Choose a new date and time slot for your installation.", "اختر تاريخاً وفترة زمنية جديدة للتركيب.")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Preferred Date", "التاريخ المفضل")}</Label>
              <Input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="space-y-2">
              <Label>{t("Time Slot", "الفترة الزمنية")}</Label>
              <Select value={rescheduleSlot} onValueChange={setRescheduleSlot}>
                <SelectTrigger><SelectValue placeholder={t("Select time slot", "اختر الفترة")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">{t("Morning (8 AM - 12 PM)", "صباحاً (8 ص - 12 م)")}</SelectItem>
                  <SelectItem value="afternoon">{t("Afternoon (12 PM - 4 PM)", "ظهراً (12 م - 4 م)")}</SelectItem>
                  <SelectItem value="evening">{t("Evening (4 PM - 8 PM)", "مساءً (4 م - 8 م)")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowReschedule(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleSlot}>{t("Confirm Reschedule", "تأكيد إعادة الجدولة")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Technician Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MessageText size={20} />{t("Message Technician", "مراسلة الفني")}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.technician && t(selectedOrder.technician.name, selectedOrder.technician.nameAr)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder={t("Type your message to the technician...", "اكتب رسالتك للفني...")} rows={3} maxLength={300} />
            <p className="text-xs text-muted-foreground text-right">{contactMessage.length}/300</p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowContact(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button onClick={handleContactTech} disabled={!contactMessage.trim()}><MessageText size={14} className="me-1" />{t("Send", "إرسال")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Installation Feedback", "ملاحظات التركيب")}</DialogTitle>
            <DialogDescription>{t("How was your installation experience?", "كيف كانت تجربة التركيب؟")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setFeedbackRating(s)} className="transition-transform hover:scale-110">
                  <Star1 size={32} variant={s <= feedbackRating ? "Bold" : "Linear"} className={s <= feedbackRating ? "text-warning" : "text-muted-foreground/30"} />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {feedbackRating === 0 ? t("Tap a star to rate", "انقر على نجمة للتقييم") :
               feedbackRating <= 2 ? t("We're sorry to hear that", "نأسف لسماع ذلك") :
               feedbackRating <= 3 ? t("Thank you for the feedback", "شكراً لملاحظاتك") :
               t("Glad the installation went well!", "سعداء أن التركيب تم بنجاح!")}
            </p>
            <Textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)} placeholder={t("Any comments? (optional)", "أي تعليقات؟ (اختياري)")} rows={2} maxLength={300} />
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => { setShowFeedback(false); setFeedbackRating(0); setFeedbackComment(""); }}>{t("Skip", "تخطي")}</Button>
              <Button onClick={handleFeedback} disabled={feedbackRating === 0}>{t("Submit Feedback", "إرسال الملاحظات")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Order Flow Dialog */}
      <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Place New Order", "تقديم طلب جديد")}</DialogTitle>
            <DialogDescription>
              {newOrderStep === 0 && t("Select a plan to order.", "اختر باقة لطلبها.")}
              {newOrderStep === 1 && t("Enter your installation details.", "أدخل تفاصيل التركيب.")}
              {newOrderStep === 2 && t("Review and confirm your order.", "راجع وأكد طلبك.")}
            </DialogDescription>
          </DialogHeader>

          {/* Step 0: Select plan */}
          {newOrderStep === 0 && (
            <div className="space-y-3">
              {plans.filter((p) => p.type === "internet" || p.type === "bundle").map((p) => (
                <button key={p.id} onClick={() => { setSelectedPlan(p.id); setNewOrderStep(1); }}
                  className={cn("w-full p-3 rounded-lg border text-left flex justify-between items-center transition-colors hover:border-primary/30", selectedPlan === p.id && "border-primary bg-primary/5")}>
                  <div>
                    <p className="font-medium text-sm">{t(p.name, p.nameAr)}</p>
                    <p className="text-xs text-muted-foreground">{p.speed}</p>
                  </div>
                  <span className="text-sm font-semibold">{p.price} <OmrSymbol />/{t("mo", "شهر")}</span>
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => navigate("/catalog")}>{t("Browse Full Catalog", "تصفح الكتالوج الكامل")}</Button>
            </div>
          )}

          {/* Step 1: Installation details */}
          {newOrderStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("Full Name", "الاسم الكامل")} <span className="text-destructive">*</span></Label>
                <Input value={newOrderName} onChange={(e) => setNewOrderName(e.target.value)} placeholder="Ahmed Al-Balushi" maxLength={50} />
              </div>
              <div className="space-y-2">
                <Label>{t("Phone Number", "رقم الهاتف")}</Label>
                <Input value={newOrderPhone} onChange={(e) => setNewOrderPhone(e.target.value)} placeholder="+968 9123 4567" maxLength={15} />
              </div>
              <div className="space-y-2">
                <Label>{t("Installation Address", "عنوان التركيب")} <span className="text-destructive">*</span></Label>
                <Textarea value={newOrderAddress} onChange={(e) => setNewOrderAddress(e.target.value)} placeholder={t("Full address including area, building/villa...", "العنوان الكامل بما في ذلك المنطقة والمبنى/الفيلا...")} rows={2} maxLength={200} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setNewOrderStep(0)}>{t("Back", "رجوع")}</Button>
                <Button onClick={() => setNewOrderStep(2)} disabled={!newOrderName.trim() || !newOrderAddress.trim()}>{t("Review", "مراجعة")}</Button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {newOrderStep === 2 && selectedPlanObj && (
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{t("Plan", "الباقة")}</span><span className="font-semibold">{t(selectedPlanObj.name, selectedPlanObj.nameAr)}</span></div>
                {selectedPlanObj.speed && <div className="flex justify-between"><span className="text-muted-foreground">{t("Speed", "السرعة")}</span><span>{selectedPlanObj.speed}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">{t("Monthly Cost", "التكلفة الشهرية")}</span><span className="font-semibold">{selectedPlanObj.price} <OmrSymbol /></span></div>
                <Separator />
                <div className="flex justify-between"><span className="text-muted-foreground">{t("Name", "الاسم")}</span><span>{newOrderName}</span></div>
                {newOrderPhone && <div className="flex justify-between"><span className="text-muted-foreground">{t("Phone", "الهاتف")}</span><span>{newOrderPhone}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">{t("Address", "العنوان")}</span><span className="text-right max-w-[60%]">{newOrderAddress}</span></div>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-3 text-xs text-muted-foreground">
                  {t("A technician will be assigned within 2-3 business days. You will receive an SMS with the scheduled date.", "سيتم تعيين فني خلال 2-3 أيام عمل. ستتلقى رسالة نصية بالتاريخ المحدد.")}
                </CardContent>
              </Card>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setNewOrderStep(1)}>{t("Back", "رجوع")}</Button>
                <Button onClick={handleNewOrder}><TickCircle size={14} className="me-1" />{t("Place Order", "تقديم الطلب")}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}