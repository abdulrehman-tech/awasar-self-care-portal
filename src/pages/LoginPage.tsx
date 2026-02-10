import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Global, ArrowLeft, Call, Lock, ShieldTick } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import awasrLogo from "@/assets/awasr-logo.png";

type AuthView = "phone" | "otp" | "success";

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 4) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return digits;
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\s/g, "");
    if (digits.length < 8) {
      toast({ title: t("Error", "خطأ"), description: t("Please enter a valid 8-digit phone number.", "يرجى إدخال رقم هاتف صالح من 8 أرقام."), variant: "destructive" });
      return;
    }
    toast({ title: t("Code Sent", "تم إرسال الرمز"), description: t("A verification code has been sent to your phone.", "تم إرسال رمز التحقق إلى هاتفك.") });
    setView("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast({ title: t("Error", "خطأ"), description: t("Please enter the 4-digit code.", "يرجى إدخال الرمز المكون من 4 أرقام."), variant: "destructive" });
      return;
    }
    toast({ title: t("Welcome!", "مرحباً!"), description: t("Logging you in...", "جاري تسجيل الدخول...") });
    setTimeout(() => navigate("/"), 800);
  };

  const handleResend = () => {
    toast({ title: t("Code Resent", "تم إعادة إرسال الرمز"), description: t("A new verification code has been sent.", "تم إرسال رمز تحقق جديد.") });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 end-4 flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors bg-card border border-border"
      >
        <Global size={16} />
        {language === "en" ? "عربي" : "EN"}
      </button>

      <Card className="w-full max-w-sm">
        <div className="h-1.5 gradient-primary rounded-t-lg" />

        {/* === PHONE NUMBER VIEW === */}
        {view === "phone" && (
          <>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <img src={awasrLogo} alt="Awasr" className="h-16 w-auto mx-auto object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">{t("Sign in with your phone number", "سجل الدخول برقم هاتفك")}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("Phone Number", "رقم الهاتف")}</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-md border border-input bg-muted/50 text-sm text-muted-foreground shrink-0">
                      +968
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="9123 4567"
                      className="font-mono"
                      maxLength={9}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Call size={16} className="me-1" />
                  {t("Send Verification Code", "إرسال رمز التحقق")}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {/* === OTP VIEW === */}
        {view === "otp" && (
          <>
            <CardHeader className="pb-2">
              <button onClick={() => { setView("phone"); setOtp(""); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
                <ArrowLeft size={16} />{t("Back", "رجوع")}
              </button>
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock size={24} className="text-primary" />
              </div>
              <p className="text-lg font-semibold text-center">{t("Enter Verification Code", "أدخل رمز التحقق")}</p>
              <p className="text-sm text-muted-foreground text-center">
                {t(`We sent a code to +968 ${phone}`, `أرسلنا رمزاً إلى 968+ ${phone}`)}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("4-Digit Code", "رمز من 4 أرقام")}</Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="0000"
                    className="text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={4}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">{t("Verify & Sign In", "تحقق وسجل الدخول")}</Button>
                <button type="button" onClick={handleResend} className="w-full text-sm text-secondary hover:underline text-center">
                  {t("Resend Code", "إعادة إرسال الرمز")}
                </button>
              </form>
            </CardContent>
          </>
        )}

        {/* === SUCCESS VIEW (unused but kept for flow completeness) === */}
        {view === "success" && (
          <>
            <CardHeader className="pb-2 text-center">
              <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldTick size={28} className="text-success" />
              </div>
              <p className="text-lg font-semibold">{t("Welcome Back!", "مرحباً بعودتك!")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("You have been successfully authenticated.", "تم التحقق من هويتك بنجاح.")}
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/")}>
                {t("Go to Dashboard", "الذهاب للرئيسية")}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
