import { useState } from "react";
import { DocumentDownload, TickCircle, Warning2 } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { invoices } from "@/data/mockData";
import { cn } from "@/lib/utils";

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", nameAr: "بطاقة ائتمان/خصم", icon: "/icons/visa.svg" },
  { id: "omannet", name: "Omannet", nameAr: "عُمان نت", icon: null, emoji: "🏦" },
  { id: "apple", name: "Apple Pay", nameAr: "آبل باي", icon: "/icons/apple.svg" },
  { id: "samsung", name: "Samsung Pay", nameAr: "سامسونج باي", icon: null, emoji: "📱" },
];

export default function BillingPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [autoPay, setAutoPay] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const outstanding = invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);

  const handlePay = () => {
    setShowConfirmation(true);
  };

  const confirmPayment = () => {
    setShowConfirmation(false);
    toast({ title: t("Payment Successful!", "تمت عملية الدفع بنجاح!"), description: t(`OMR ${outstanding.toFixed(2)} has been paid.`, `تم دفع ${outstanding.toFixed(2)} ر.ع.`) });
  };

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
                <p className="text-2xl font-bold">{outstanding.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{t("OMR", "ر.ع")}</span></p>
              </div>
            </div>
            <Button onClick={handlePay}>{t("Pay Now", "ادفع الآن")}</Button>
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
              <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder={t("Enter code", "أدخل الرمز")} />
              <Button variant="outline" size="sm">{t("Apply", "تطبيق")}</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("Auto-Pay", "الدفع التلقائي")}</p>
              <p className="text-xs text-muted-foreground">{t("Automatically pay monthly bills", "دفع الفواتير الشهرية تلقائياً")}</p>
            </div>
            <Switch checked={autoPay} onCheckedChange={setAutoPay} />
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
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-sm">{inv.id}</TableCell>
                  <TableCell className="text-sm">{inv.date}</TableCell>
                  <TableCell className="text-sm">{inv.amount.toFixed(2)} {t("OMR", "ر.ع")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px]", inv.status === "paid" ? "text-success border-success/20" : "text-warning border-warning/20")}>
                      {t(inv.status === "paid" ? "Paid" : "Unpaid", inv.status === "paid" ? "مدفوع" : "غير مدفوع")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><DocumentDownload size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Payment", "تأكيد الدفع")}</DialogTitle>
            <DialogDescription>{t("Review your payment details below.", "راجع تفاصيل الدفع أدناه.")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Amount", "المبلغ")}</span><span className="font-semibold">{outstanding.toFixed(2)} {t("OMR", "ر.ع")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Method", "الطريقة")}</span><span>{paymentMethods.find((m) => m.id === selectedMethod)?.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Account", "الحساب")}</span><span>AWR-98765432</span></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>{t("Cancel", "إلغاء")}</Button>
            <Button onClick={confirmPayment}><TickCircle size={16} className="mr-1" />{t("Confirm & Pay", "تأكيد والدفع")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
