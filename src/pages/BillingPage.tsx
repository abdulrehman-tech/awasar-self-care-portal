import { useState } from "react";
import { DocumentDownload, TickCircle, Warning2, Card as CardIcon, Eye, EyeSlash, ReceiptItem, CloseCircle } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { invoices, invoiceLineItems } from "@/data/mockData";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", nameAr: "بطاقة ائتمان/خصم", icon: "/icons/visa.svg" },
  { id: "omannet", name: "Omannet", nameAr: "عُمان نت", icon: null, emoji: "🏦" },
  { id: "apple", name: "Apple Pay", nameAr: "آبل باي", icon: "/icons/apple.svg" },
  { id: "samsung", name: "Samsung Pay", nameAr: "سامسونج باي", icon: null, emoji: "📱" },
];

const rechargeAmounts = [5, 10, 15, 20, 25, 50];

export default function BillingPage() {
  const { t } = useLanguage();
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
  const finalAmount = Math.max(0, outstanding - discount);

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
    // Reset card form
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Billing & Payments", "الفواتير والمدفوعات")}</h1>

      {/* Outstanding balance banner */}
      {outstanding > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Warning2 size={20} className="text-primary shrink-0" />
              <div>
                <p className="font-semibold">{t("Outstanding Balance", "الرصيد المستحق")}</p>
                <p className="text-2xl font-bold">
                  {discount > 0 ? (
                    <>
                      <span className="line-through text-muted-foreground text-lg mr-2">{outstanding.toFixed(2)}</span>
                      {finalAmount.toFixed(2)}
                    </>
                  ) : outstanding.toFixed(2)}
                  {" "}<span className="text-sm font-normal text-muted-foreground">{t("OMR", "ر.ع")}</span>
                </p>
                {discount > 0 && <p className="text-xs text-success">{t(`Discount: OMR ${discount.toFixed(2)}`, `الخصم: ${discount.toFixed(2)} ر.ع`)}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowRecharge(true)}>{t("Recharge", "إعادة شحن")}</Button>
              <Button onClick={handlePay}>{t("Pay Now", "ادفع الآن")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment methods */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{t("Payment Method", "طريقة الدفع")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={cn(
                  "p-3 rounded-lg border text-center text-sm transition-colors flex flex-col items-center gap-2",
                  selectedMethod === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                )}
              >
                {m.icon ? (
                  <img src={m.icon} alt={m.name} className="h-6 w-auto object-contain" />
                ) : (
                  <span className="text-xl">{m.emoji}</span>
                )}
                <span className="text-xs">{t(m.name, m.nameAr)}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Promo code + Auto-pay */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">{t("Promo Code", "رمز ترويجي")}</p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoStatus("idle"); setDiscount(0); }}
                  placeholder={t("e.g. AWASR20", "مثال: AWASR20")}
                  className={cn(
                    promoStatus === "success" && "border-success",
                    promoStatus === "error" && "border-destructive"
                  )}
                  maxLength={20}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handlePromoApply} disabled={!promoCode.trim()}>{t("Apply", "تطبيق")}</Button>
            </div>
            {promoStatus === "success" && <p className="text-xs text-success mt-1">{t("✓ Promo code applied successfully!", "✓ تم تطبيق الرمز الترويجي بنجاح!")}</p>}
            {promoStatus === "error" && <p className="text-xs text-destructive mt-1">{t("✗ Invalid promo code. Try AWASR20.", "✗ رمز غير صالح. جرّب AWASR20.")}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("Auto-Pay", "الدفع التلقائي")}</p>
              <p className="text-xs text-muted-foreground">{t("Automatically pay monthly bills", "دفع الفواتير الشهرية تلقائياً")}</p>
            </div>
            <Switch checked={autoPay} onCheckedChange={handleAutoPayToggle} />
          </CardContent>
        </Card>
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{t("Invoice History", "سجل الفواتير")}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Invoice", "الفاتورة")}</TableHead>
                <TableHead>{t("Date", "التاريخ")}</TableHead>
                <TableHead>{t("Amount", "المبلغ")}</TableHead>
                <TableHead>{t("Status", "الحالة")}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setShowInvoiceDetail(inv.id)}>
                  <TableCell className="font-medium text-sm">{inv.id}</TableCell>
                  <TableCell className="text-sm">{inv.date}</TableCell>
                  <TableCell className="text-sm">{inv.amount.toFixed(2)} {t("OMR", "ر.ع")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px]", inv.status === "paid" ? "text-success border-success/20" : "text-warning border-warning/20")}>
                      {t(inv.status === "paid" ? "Paid" : "Unpaid", inv.status === "paid" ? "مدفوع" : "غير مدفوع")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDownloadInvoice(inv.id); }}>
                      <DocumentDownload size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCvv(!showCvv)}>
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
            <Button onClick={confirmPayment}><TickCircle size={16} className="mr-1" />{t("Confirm & Pay", "تأكيد والدفع")}</Button>
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
              <DocumentDownload size={16} className="mr-1" />{t("Download Receipt", "تحميل الإيصال")}
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
                  <DocumentDownload size={16} className="mr-1" />{t("Download PDF", "تحميل PDF")}
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