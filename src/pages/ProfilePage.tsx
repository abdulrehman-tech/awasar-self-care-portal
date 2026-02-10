import { useState, useMemo } from "react";
import { User, Sms, Call, Location, Lock, Logout, Card as CardIcon, Save2, CloseCircle, Add, Trash, ShieldTick, Warning2, Eye, EyeSlash, InfoCircle } from "iconsax-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { customer } from "@/data/mockData";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  brand: string;
}

const initialPaymentMethods: PaymentMethod[] = [
  { id: "pm-1", type: "visa", last4: "4521", expiry: "12/25", brand: "Visa" },
];

function getPasswordStrength(pw: string): { score: number; label: string; labelAr: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;

  if (score <= 1) return { score: 20, label: "Weak", labelAr: "ضعيفة", color: "bg-destructive" };
  if (score === 2) return { score: 40, label: "Fair", labelAr: "مقبولة", color: "bg-warning" };
  if (score === 3) return { score: 60, label: "Good", labelAr: "جيدة", color: "bg-info" };
  if (score === 4) return { score: 80, label: "Strong", labelAr: "قوية", color: "bg-success" };
  return { score: 100, label: "Very Strong", labelAr: "قوية جداً", color: "bg-success" };
}

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    addressAr: customer.addressAr,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Deactivation
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateConfirmText, setDeactivateConfirmText] = useState("");

  // Logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  // --- Profile edit ---
  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) errors.email = t("Email is required", "البريد الإلكتروني مطلوب");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = t("Invalid email", "بريد إلكتروني غير صالح");
    if (!formData.phone.trim()) errors.phone = t("Phone is required", "الهاتف مطلوب");
    if (!formData.address.trim()) errors.address = t("Address is required", "العنوان مطلوب");
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateProfile()) return;
    setEditing(false);
    setFormErrors({});
    toast({ title: t("Profile Updated", "تم تحديث الملف الشخصي") });
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ email: customer.email, phone: customer.phone, address: customer.address, addressAr: customer.addressAr });
    setFormErrors({});
  };

  // --- Payment methods ---
  const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validateCard = () => {
    const errors: Record<string, string> = {};
    const digits = newCard.number.replace(/\s/g, "");
    if (digits.length < 16) errors.number = t("Enter 16-digit card number", "أدخل رقم بطاقة من 16 رقم");
    if (newCard.expiry.length < 5) errors.expiry = t("Invalid expiry", "تاريخ انتهاء غير صالح");
    if (newCard.cvv.length < 3) errors.cvv = t("Invalid CVV", "CVV غير صالح");
    if (!newCard.name.trim()) errors.name = t("Name is required", "الاسم مطلوب");
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCard()) return;
    const digits = newCard.number.replace(/\s/g, "");
    const pm: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: "visa",
      last4: digits.slice(-4),
      expiry: newCard.expiry,
      brand: digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card",
    };
    setPaymentMethods((prev) => [...prev, pm]);
    setNewCard({ number: "", expiry: "", cvv: "", name: "" });
    setCardErrors({});
    setShowAddPayment(false);
    toast({ title: t("Payment method added", "تمت إضافة طريقة الدفع") });
  };

  const handleDeletePayment = () => {
    if (!deletePaymentId) return;
    setPaymentMethods((prev) => prev.filter((p) => p.id !== deletePaymentId));
    setDeletePaymentId(null);
    toast({ title: t("Payment method removed", "تمت إزالة طريقة الدفع") });
  };

  // --- Change password ---
  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.current = t("Current password is required", "كلمة المرور الحالية مطلوبة");
    if (newPassword.length < 8) errors.new = t("Minimum 8 characters", "8 أحرف على الأقل");
    if (newPassword !== confirmPassword) errors.confirm = t("Passwords don't match", "كلمات المرور غير متطابقة");
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setPasswordErrors({});
    toast({ title: t("Password Updated", "تم تحديث كلمة المرور"), description: t("Your password has been changed successfully.", "تم تغيير كلمة المرور بنجاح.") });
  };

  // --- Deactivation ---
  const handleDeactivateRequest = () => {
    if (deactivateConfirmText !== "DEACTIVATE") return;
    setShowDeactivate(false);
    setDeactivateReason("");
    setDeactivateConfirmText("");
    toast({ title: t("Deactivation Requested", "تم طلب إلغاء التفعيل"), description: t("Our team will review your request and contact you within 48 hours.", "سيراجع فريقنا طلبك ويتواصل معك خلال 48 ساعة.") });
  };

  // --- Logout ---
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    toast({ title: t("Logged out", "تم تسجيل الخروج") });
    setTimeout(() => navigate("/login"), 500);
  };

  const profileFields = [
    { icon: Sms, label: t("Email", "البريد الإلكتروني"), key: "email" as const, value: formData.email, type: "email" },
    { icon: Call, label: t("Phone", "الهاتف"), key: "phone" as const, value: formData.phone, type: "tel" },
    { icon: Location, label: t("Address", "العنوان"), key: "address" as const, value: language === "ar" ? formData.addressAr : formData.address, type: "text" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Profile & Settings", "الملف الشخصي والإعدادات")}</h1>

      {/* Personal info */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("Personal Information", "المعلومات الشخصية")}</CardTitle>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <CloseCircle size={16} className="me-1" />{t("Cancel", "إلغاء")}
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save2 size={16} className="me-1" />{t("Save", "حفظ")}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>{t("Edit", "تعديل")}</Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">A</div>
            <div>
              <p className="font-semibold">{t(customer.name, customer.nameAr)}</p>
              <p className="text-sm text-muted-foreground">{customer.accountNumber}</p>
            </div>
          </div>
          {profileFields.map((field) => (
            <div key={field.key} className="flex items-start gap-3">
              <field.icon size={16} className="text-muted-foreground shrink-0 mt-2.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{field.label}</Label>
                {editing ? (
                  <>
                    <Input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }));
                        setFormErrors((prev) => ({ ...prev, [field.key]: "" }));
                      }}
                      className={`mt-1 ${formErrors[field.key] ? "border-destructive" : ""}`}
                    />
                    {formErrors[field.key] && <p className="text-xs text-destructive mt-1">{formErrors[field.key]}</p>}
                  </>
                ) : (
                  <p className="text-sm">{field.value}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Notification Preferences", "تفضيلات الإشعارات")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: t("Email Notifications", "إشعارات البريد الإلكتروني"), default: true },
            { label: t("SMS Notifications", "إشعارات الرسائل"), default: true },
            { label: t("Push Notifications", "الإشعارات الفورية"), default: false },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <p className="text-sm">{pref.label}</p>
              <Switch defaultChecked={pref.default} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Language", "اللغة")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue={language}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("Payment Methods", "طرق الدفع")}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => { setCardErrors({}); setShowAddPayment(true); }}>
              <Add size={16} className="me-1" />{t("Add", "إضافة")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {paymentMethods.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">{t("No payment methods added.", "لم تتم إضافة طرق دفع.")}</p>
          )}
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <CardIcon size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-sm">•••• •••• •••• {pm.last4}</p>
                  <p className="text-xs text-muted-foreground">{pm.brand} — {t("Expires", "ينتهي")} {pm.expiry}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDeletePaymentId(pm.id)}>
                <Trash size={16} className="text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Change Password", "تغيير كلمة المرور")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="space-y-2">
              <Label>{t("Current Password", "كلمة المرور الحالية")}</Label>
              <div className="relative">
                <Input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordErrors((p) => ({ ...p, current: "" })); }}
                  className={passwordErrors.current ? "border-destructive" : ""}
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showCurrentPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordErrors.current && <p className="text-xs text-destructive">{passwordErrors.current}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("New Password", "كلمة المرور الجديدة")}</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors((p) => ({ ...p, new: "" })); }}
                  className={passwordErrors.new ? "border-destructive" : ""}
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showNewPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordErrors.new && <p className="text-xs text-destructive">{passwordErrors.new}</p>}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Progress value={passwordStrength.score} className={`h-1.5 flex-1 [&>div]:${passwordStrength.color}`} />
                    <span className="text-xs text-muted-foreground">{t(passwordStrength.label, passwordStrength.labelAr)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                    <span className={newPassword.length >= 8 ? "text-success" : ""}>✓ {t("8+ chars", "8+ أحرف")}</span>
                    <span className={/[A-Z]/.test(newPassword) ? "text-success" : ""}>✓ {t("Uppercase", "حرف كبير")}</span>
                    <span className={/[0-9]/.test(newPassword) ? "text-success" : ""}>✓ {t("Number", "رقم")}</span>
                    <span className={/[^A-Za-z0-9]/.test(newPassword) ? "text-success" : ""}>✓ {t("Symbol", "رمز")}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("Confirm Password", "تأكيد كلمة المرور")}</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => ({ ...p, confirm: "" })); }}
                className={passwordErrors.confirm ? "border-destructive" : ""}
              />
              {passwordErrors.confirm && <p className="text-xs text-destructive">{passwordErrors.confirm}</p>}
            </div>
            <Button type="submit" size="sm"><Lock size={16} className="me-1" />{t("Update Password", "تحديث كلمة المرور")}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Account deactivation */}
      <Card className="border-destructive/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <Warning2 size={16} />
            {t("Account Deactivation", "إلغاء تفعيل الحساب")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {t(
              "Deactivating your account will suspend all services. This action requires approval from our team.",
              "سيؤدي إلغاء تفعيل حسابك إلى تعليق جميع الخدمات. يتطلب هذا الإجراء موافقة فريقنا."
            )}
          </p>
          <Button variant="destructive" size="sm" onClick={() => setShowDeactivate(true)}>
            {t("Request Deactivation", "طلب إلغاء التفعيل")}
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button variant="destructive" className="w-full sm:w-auto" onClick={() => setShowLogoutConfirm(true)}>
        <Logout size={16} className="me-1" />{t("Logout", "تسجيل الخروج")}
      </Button>

      {/* === DIALOGS === */}

      {/* Add Payment Dialog */}
      <Dialog open={showAddPayment} onOpenChange={(o) => { setShowAddPayment(o); if (!o) { setNewCard({ number: "", expiry: "", cvv: "", name: "" }); setCardErrors({}); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("Add Payment Method", "إضافة طريقة دفع")}</DialogTitle>
            <DialogDescription>{t("Enter your card details.", "أدخل بيانات بطاقتك.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPayment} className="space-y-3">
            <div className="space-y-1">
              <Label>{t("Card Number", "رقم البطاقة")}</Label>
              <Input
                placeholder="0000 0000 0000 0000"
                value={newCard.number}
                onChange={(e) => setNewCard((p) => ({ ...p, number: formatCardNumber(e.target.value) }))}
                className={cardErrors.number ? "border-destructive" : ""}
                maxLength={19}
              />
              {cardErrors.number && <p className="text-xs text-destructive">{cardErrors.number}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{t("Expiry", "انتهاء الصلاحية")}</Label>
                <Input
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  className={cardErrors.expiry ? "border-destructive" : ""}
                  maxLength={5}
                />
                {cardErrors.expiry && <p className="text-xs text-destructive">{cardErrors.expiry}</p>}
              </div>
              <div className="space-y-1">
                <Label>CVV</Label>
                <Input
                  placeholder="123"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  className={cardErrors.cvv ? "border-destructive" : ""}
                  maxLength={4}
                />
                {cardErrors.cvv && <p className="text-xs text-destructive">{cardErrors.cvv}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label>{t("Cardholder Name", "اسم حامل البطاقة")}</Label>
              <Input
                value={newCard.name}
                onChange={(e) => setNewCard((p) => ({ ...p, name: e.target.value }))}
                className={cardErrors.name ? "border-destructive" : ""}
              />
              {cardErrors.name && <p className="text-xs text-destructive">{cardErrors.name}</p>}
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" type="button" onClick={() => setShowAddPayment(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button type="submit"><Add size={14} className="me-1" />{t("Add Card", "إضافة البطاقة")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Payment Confirmation */}
      <Dialog open={!!deletePaymentId} onOpenChange={() => setDeletePaymentId(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("Remove Payment Method", "إزالة طريقة الدفع")}</DialogTitle>
            <DialogDescription>{t("Are you sure? This cannot be undone.", "هل أنت متأكد؟ لا يمكن التراجع عن هذا.")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setDeletePaymentId(null)}>{t("Cancel", "إلغاء")}</Button>
            <Button variant="destructive" size="sm" onClick={handleDeletePayment}>
              <Trash size={14} className="me-1" />{t("Remove", "إزالة")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivation Dialog */}
      <Dialog open={showDeactivate} onOpenChange={(o) => { setShowDeactivate(o); if (!o) { setDeactivateReason(""); setDeactivateConfirmText(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Warning2 size={18} />{t("Account Deactivation", "إلغاء تفعيل الحساب")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "This will submit a deactivation request. All services will be suspended pending review.",
                "سيتم تقديم طلب إلغاء التفعيل. سيتم تعليق جميع الخدمات في انتظار المراجعة."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-start gap-2">
                <InfoCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">
                  <p className="font-medium">{t("This action:", "هذا الإجراء:")}</p>
                  <ul className="list-disc ms-4 mt-1 space-y-0.5 text-xs">
                    <li>{t("Suspends all active services", "يعلق جميع الخدمات النشطة")}</li>
                    <li>{t("Cancels pending orders", "يلغي الطلبات المعلقة")}</li>
                    <li>{t("May incur early termination fees", "قد يتضمن رسوم إنهاء مبكر")}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("Reason (optional)", "السبب (اختياري)")}</Label>
              <Textarea
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder={t("Tell us why you're leaving...", "أخبرنا لماذا تريد المغادرة...")}
                rows={3}
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Type "DEACTIVATE" to confirm', 'اكتب "DEACTIVATE" للتأكيد')}</Label>
              <Input
                value={deactivateConfirmText}
                onChange={(e) => setDeactivateConfirmText(e.target.value)}
                placeholder="DEACTIVATE"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeactivate(false)}>{t("Cancel", "إلغاء")}</Button>
              <Button variant="destructive" disabled={deactivateConfirmText !== "DEACTIVATE"} onClick={handleDeactivateRequest}>
                {t("Submit Request", "تقديم الطلب")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t("Logout", "تسجيل الخروج")}</DialogTitle>
            <DialogDescription>{t("Are you sure you want to log out?", "هل أنت متأكد أنك تريد تسجيل الخروج؟")}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowLogoutConfirm(false)}>{t("Cancel", "إلغاء")}</Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <Logout size={14} className="me-1" />{t("Logout", "تسجيل الخروج")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
