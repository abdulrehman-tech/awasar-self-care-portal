import { useState } from "react";
import { DocumentDownload, TickCircle, Warning2, Card as CardIcon, Eye, EyeSlash, ReceiptItem, CloseCircle, Flash, ArrowRight2 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { invoices, invoiceLineItems } from "@/data/mockData";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", nameAr: "بطاقة ائتمان/خصم", icon: "/icons/visa.svg" },
  { id: "apple", name: "Apple Pay", nameAr: "آبل باي", icon: "/icons/apple.svg" },
  { id: "samsung", name: "Samsung Pay", nameAr: "سامسونج باي", icon: "/icons/samsung-pay.svg" },
];

const rechargeAmounts = [5, 10, 15, 20, 25, 50];

export default function BillingPage() {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState<string | null>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showAutoPayConfirm, setShowAutoPayConfirm] = useState(false);
  const [autoPay, setAutoPay] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<"idle" | "success" | "error">("idle");
  const [discount, setDiscount] = useState(0);
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | "paid" | "unpaid">("all");

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  // Recharge state
  const [rechargeAmount, setRechargeAmount] = useState<number | null>(null);

  // Payment receipt state
  const [receiptData, setReceiptData] = useState({ amount: 0, method: "", ref: "" });

  const outstanding = invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const finalAmount = Math.max(0, outstanding - discount);

  const filteredInvoices = invoices.filter((i) => invoiceFilter === "all" || i.status === invoiceFilter);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePay = () => {
    if (selectedMethod === "card") {
      setShowCardForm(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast({ title: t("Invalid card number", "رقم البطاقة غير صالح"), variant: "destructive" });
      return;
    }
    setShowCardForm(false);
    setShowConfirmation(true);
  };

  const confirmPayment = () => {
    const ref = `PAY-${Date.now().toString().slice(-8)}`;
    setReceiptData({
      amount: finalAmount,
      method: paymentMethods.find((m) => m.id === selectedMethod)?.name || "",
      ref,
    });
    setShowConfirmation(false);
    setShowReceipt(true);
    setCardNumber(""); setCardExpiry(""); setCardCvv(""); setCardName("");
  };

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === "AWASR20" || promoCode.toUpperCase() === "SUMMER10") {
      const d = promoCode.toUpperCase() === "AWASR20" ? outstanding * 0.2 : 10;
      setDiscount(d);
      setPromoStatus("success");
      toast({ title: t("Promo applied!", "تم تطبيق الرمز!"), description: t(`Discount: OMR ${d.toFixed(2)}`, `الخصم: ${d.toFixed(2)} ر.ع`) });
    } else {
      setPromoStatus("error");
      toast({ title: t("Invalid promo code", "رمز ترويجي غير صالح"), variant: "destructive" });
    }
  };

  const handleAutoPayToggle = (checked: boolean) => {
    if (checked) {
      setShowAutoPayConfirm(true);
    } else {
      setAutoPay(false);
      toast({ title: t("Auto-Pay disabled", "تم إلغاء الدفع التلقائي") });
    }
  };

  const confirmAutoPay = () => {
    setAutoPay(true);
    setShowAutoPayConfirm(false);
    toast({ title: t("Auto-Pay enabled!", "تم تفعيل الدفع التلقائي!"), description: t("Your bills will be paid automatically each month.", "سيتم دفع فواتيرك تلقائياً كل شهر.") });
  };

  const handleRecharge = () => {
    if (!rechargeAmount) return;
    const ref = `RCH-${Date.now().toString().slice(-8)}`;
    setReceiptData({ amount: rechargeAmount, method: paymentMethods.find((m) => m.id === selectedMethod)?.name || "", ref });
    setShowRecharge(false);
    setShowReceipt(true);
    setRechargeAmount(null);
  };

  const handleDownloadInvoice = (id: string) => {
    toast({ title: t(`Downloading ${id}...`, `جاري تحميل ${id}...`), description: t("PDF will be ready shortly.", "سيكون ملف PDF جاهزاً قريباً.") });
  };

  const selectedInvoice = invoices.find((i) => i.id === showInvoiceDetail);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">{t("Billing & Payments", "الفواتير والمدفوعات")}</h1>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className={`card-shadow border-0 ${outstanding > 0 ? "bg-gradient-to-br from-warning/5 to-transparent" : "bg-gradient-to-br from-success/5 to-transparent"}`}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("Outstanding Balance", "الرصيد المستحق")}</p>
            <p className="text-2xl font-bold">
              {discount > 0 ? (
                <>
                  <span className="line-through text-muted-foreground text-lg me-2">{outstanding.toFixed(2)}</span>
                  {finalAmount.toFixed(2)}
                </>
              ) : outstanding.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ms-1">{t("OMR", "ر.ع")}</span>
            </p>
            {discount > 0 && <p className="text-xs text-success mt-0.5">{t(`Discount: OMR ${discount.toFixed(2)}`, `الخصم: ${discount.toFixed(2)} ر.ع`)}</p>}
            {outstanding > 0 && (
              <Button size="sm" className="w-full mt-3" onClick={handlePay}>
                {t("Pay Now", "ادفع الآن")}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{t("Total Paid (YTD)", "إجمالي المدفوعات")}</p>
            <p className="text-2xl font-bold">{totalPaid.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{t("OMR", "ر.ع")}</span></p>
            <p className="text-xs text-muted-foreground mt-1">{invoices.filter(i => i.status === "paid").length} {t("invoices", "فواتير")}</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">{t("Auto-Pay", "الدفع التلقائي")}</p>
              <Switch checked={autoPay} onCheckedChange={handleAutoPayToggle} />
            </div>
            <p className="text-sm font-medium mt-1">{autoPay ? t("Enabled", "مفعّل") : t("Disabled", "معطّل")}</p>
            <p className="text-xs text-muted-foreground">{t("Monthly on the 5th", "شهرياً في الخامس")}</p>
            <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setShowRecharge(true)}>
              <Flash size={14} className="me-1" />{t("Recharge", "إعادة شحن")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method & Promo in a clean layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Methods - takes 2 cols */}
        <Card className="lg:col-span-2 card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("Payment Method", "طريقة الدفع")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-2.5 relative",
                    selectedMethod === m.id 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  )}
                >
                  {selectedMethod === m.id && (
                    <div className="absolute top-2 end-2">
                      <TickCircle size={16} className="text-primary" variant="Bold" />
                    </div>
                  )}
                  <img src={m.icon} alt={m.name} className="h-8 w-auto object-contain" />
                  <span className="text-xs font-medium">{t(m.name, m.nameAr)}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Promo Code */}
        <Card className="card-shadow border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("Promo Code", "رمز ترويجي")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value); setPromoStatus("idle"); setDiscount(0); }}
                placeholder={t("Enter code", "أدخل الرمز")}
                className={cn(
                  promoStatus === "success" && "border-success",
                  promoStatus === "error" && "border-destructive"
                )}
                maxLength={20}
              />
              <Button variant="outline" className="w-full" onClick={handlePromoApply} disabled={!promoCode.trim()}>
                {t("Apply Code", "تطبيق الرمز")}
              </Button>
              {promoStatus === "success" && <p className="text-xs text-success">{t("✓ Code applied!", "✓ تم تطبيق الرمز!")}</p>}
              {promoStatus === "error" && <p className="text-xs text-destructive">{t("✗ Invalid code", "✗ رمز غير صالح")}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History with filters */}
      <Card className="card-shadow border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">{t("Invoice History", "سجل الفواتير")}</CardTitle>
            <div className="flex gap-1">
              {(["all", "unpaid", "paid"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setInvoiceFilter(f)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full border transition-colors",
                    invoiceFilter === f ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {t(
                    f === "all" ? "All" : f === "paid" ? "Paid" : "Unpaid",
                    f === "all" ? "الكل" : f === "paid" ? "مدفوع" : "غير مدفوع"
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-card card-shadow hover:card-shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setShowInvoiceDetail(inv.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center",
                    inv.status === "paid" ? "bg-success/8" : "bg-warning/8"
                  )}>
                    {inv.status === "paid" ? <TickCircle size={16} className="text-success" /> : <Warning2 size={16} className="text-warning" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-sm font-semibold">{inv.amount.toFixed(2)} {t("OMR", "ر.ع")}</p>
                  <Badge variant="outline" className={cn("text-[10px]", inv.status === "paid" ? "text-success border-success/20" : "text-warning border-warning/20")}>
                    {t(inv.status === "paid" ? "Paid" : "Unpaid", inv.status === "paid" ? "مدفوع" : "غير مدفوع")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card Entry Form Dialog */}
      <Dialog open={showCardForm} onOpenChange={setShowCardForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CardIcon size={20} />{t("Enter Card Details", "أدخل بيانات البطاقة")}</DialogTitle>
            <DialogDescription>{t("Your card details are encrypted and secure.", "بيانات بطاقتك مشفرة وآمنة.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCardSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Cardholder Name", "اسم حامل البطاقة")}</Label>
              <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Ahmed Al-Balushi" required maxLength={50} />
            </div>
            <div className="space-y-2">
              <Label>{t("Card Number", "رقم البطاقة")}</Label>
              <Input value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" required inputMode="numeric" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("Expiry", "تاريخ الانتهاء")}</Label>
                <Input value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" required inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <div className="relative">
                  <Input
                    type={showCvv ? "text" : "password"}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    required
                    inputMode="numeric"
                  />
                  <button type="button" className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCvv(!showCvv)}>
                    {showCvv ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setShowCardForm(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit">{t("Continue", "متابعة")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Payment", "تأكيد الدفع")}</DialogTitle>
            <DialogDescription>{t("Review your payment details below.", "راجع تفاصيل الدفع أدناه.")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Amount", "المبلغ")}</span><span className="font-semibold">{finalAmount.toFixed(2)} {t("OMR", "ر.ع")}</span></div>
            {discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Discount", "الخصم")}</span><span className="text-success">-{discount.toFixed(2)} {t("OMR", "ر.ع")}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Method", "الطريقة")}</span><span>{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span></div>
            {selectedMethod === "card" && cardNumber && <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Card", "البطاقة")}</span><span>•••• {cardNumber.slice(-4)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Account", "الحساب")}</span><span>AWR-98765432</span></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>{t("Cancel", "إلغاء")}</Button>
            <Button onClick={confirmPayment}><TickCircle size={16} className="me-1" />{t("Confirm & Pay", "تأكيد والدفع")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <div className="text-center py-4">
            <TickCircle size={48} className="text-success mx-auto mb-3" variant="Bold" />
            <h3 className="font-semibold text-lg">{t("Payment Successful!", "تمت عملية الدفع بنجاح!")}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t("Reference", "المرجع")}: {receiptData.ref}</p>
          </div>
          <Separator />
          <div className="space-y-2 py-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Amount Paid", "المبلغ المدفوع")}</span><span className="font-semibold">{receiptData.amount.toFixed(2)} {t("OMR", "ر.ع")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Payment Method", "طريقة الدفع")}</span><span>{receiptData.method}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Date", "التاريخ")}</span><span>{new Date().toLocaleDateString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Account", "الحساب")}</span><span>AWR-98765432</span></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => handleDownloadInvoice(receiptData.ref)}>
              <DocumentDownload size={16} className="me-1" />{t("Download Receipt", "تحميل الإيصال")}
            </Button>
            <Button onClick={() => setShowReceipt(false)}>{t("Done", "تم")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!showInvoiceDetail} onOpenChange={() => setShowInvoiceDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ReceiptItem size={20} />{t("Invoice Details", "تفاصيل الفاتورة")}</DialogTitle>
            <DialogDescription>{selectedInvoice?.id}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">{t("Date", "التاريخ")}</span><p className="font-medium">{selectedInvoice.date}</p></div>
                <div><span className="text-muted-foreground">{t("Due Date", "تاريخ الاستحقاق")}</span><p className="font-medium">{selectedInvoice.dueDate}</p></div>
                <div><span className="text-muted-foreground">{t("Status", "الحالة")}</span>
                  <Badge variant="outline" className={cn("text-[10px] mt-1", selectedInvoice.status === "paid" ? "text-success border-success/20" : "text-warning border-warning/20")}>
                    {t(selectedInvoice.status === "paid" ? "Paid" : "Unpaid", selectedInvoice.status === "paid" ? "مدفوع" : "غير مدفوع")}
                  </Badge>
                </div>
                <div><span className="text-muted-foreground">{t("Account", "الحساب")}</span><p className="font-medium">AWR-98765432</p></div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold mb-2">{t("Line Items", "البنود")}</p>
                <div className="space-y-2">
                  {invoiceLineItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{t(item.description, item.descriptionAr)}</span>
                      <span>{item.amount.toFixed(2)} {t("OMR", "ر.ع")}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-bold">
                  <span>{t("Total", "الإجمالي")}</span>
                  <span>{selectedInvoice.amount.toFixed(2)} {t("OMR", "ر.ع")}</span>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(selectedInvoice.id)}>
                  <DocumentDownload size={16} className="me-1" />{t("Download PDF", "تحميل PDF")}
                </Button>
                {selectedInvoice.status === "unpaid" && (
                  <Button size="sm" onClick={() => { setShowInvoiceDetail(null); handlePay(); }}>{t("Pay Now", "ادفع الآن")}</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recharge Dialog */}
      <Dialog open={showRecharge} onOpenChange={setShowRecharge}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Recharge", "إعادة شحن")}</DialogTitle>
            <DialogDescription>{t("Select an amount to recharge your prepaid balance.", "اختر مبلغاً لإعادة شحن رصيدك المسبق الدفع.")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {rechargeAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setRechargeAmount(amt)}
                className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  rechargeAmount === amt ? "border-primary bg-primary/5 font-semibold" : "border-border hover:border-primary/30"
                )}
              >
                <span className="text-lg font-bold">{amt}</span>
                <span className="text-xs text-muted-foreground block">{t("OMR", "ر.ع")}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => setShowRecharge(false)}>{t("Cancel", "إلغاء")}</Button>
            <Button onClick={handleRecharge} disabled={!rechargeAmount}>{t("Recharge Now", "إعادة الشحن الآن")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto-Pay Confirmation Dialog */}
      <Dialog open={showAutoPayConfirm} onOpenChange={setShowAutoPayConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Enable Auto-Pay?", "تفعيل الدفع التلقائي؟")}</DialogTitle>
            <DialogDescription>{t("Your selected payment method will be charged automatically each month.", "سيتم خصم المبلغ تلقائياً من طريقة الدفع المحددة كل شهر.")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Payment Method", "طريقة الدفع")}</span><span>{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Billing Cycle", "دورة الفوترة")}</span><span>{t("Monthly (5th)", "شهرياً (الخامس)")}</span></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAutoPayConfirm(false)}>{t("Cancel", "إلغاء")}</Button>
            <Button onClick={confirmAutoPay}>{t("Enable Auto-Pay", "تفعيل الدفع التلقائي")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
