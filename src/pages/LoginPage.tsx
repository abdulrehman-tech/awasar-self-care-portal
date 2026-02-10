import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Global, ArrowLeft, Sms, Lock, ShieldTick } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import awasrLogo from "@/assets/awasr-logo.png";

type AuthView = "login" | "forgot" | "otp" | "reset-success";

export default function LoginPage() {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: t("Error", "خطأ"), description: t("Please fill in all fields.", "يرجى ملء جميع الحقول."), variant: "destructive" });
      return;
    }
    toast({ title: t("Welcome back!", "مرحباً بعودتك!"), description: t("Logging you in...", "جاري تسجيل الدخول...") });
    setTimeout(() => navigate("/"), 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast({ title: t("Error", "خطأ"), description: t("Please enter your email.", "يرجى إدخال بريدك الإلكتروني."), variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      toast({ title: t("Error", "خطأ"), description: t("Please enter a valid email.", "يرجى إدخال بريد إلكتروني صالح."), variant: "destructive" });
      return;
    }
    toast({ title: t("Code Sent", "تم إرسال الرمز"), description: t("Check your email for the verification code.", "تحقق من بريدك الإلكتروني للحصول على رمز التحقق.") });
    setView("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast({ title: t("Error", "خطأ"), description: t("Please enter the 4-digit code.", "يرجى إدخال الرمز المكون من 4 أرقام."), variant: "destructive" });
      return;
    }
    setView("reset-success");
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

        {/* === LOGIN VIEW === */}
        {view === "login" && (
          <>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <img src={awasrLogo} alt="Awasr" className="h-16 w-auto mx-auto object-contain" />
              </div>
              <p className="text-sm text-muted-foreground">{t("Sign in to your account", "تسجيل الدخول إلى حسابك")}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("Email or Phone", "البريد الإلكتروني أو الهاتف")}</Label>
                  <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("ahmed@email.com", "ahmed@email.com")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("Password", "كلمة المرور")}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="text-end">
                  <button type="button" onClick={() => { setView("forgot"); setResetEmail(email.includes("@") ? email : ""); }} className="text-sm text-secondary hover:underline">
                    {t("Forgot Password?", "نسيت كلمة المرور؟")}
                  </button>
                </div>
                <Button type="submit" className="w-full">{t("Sign In", "تسجيل الدخول")}</Button>
              </form>
            </CardContent>
          </>
        )}

        {/* === FORGOT PASSWORD VIEW === */}
        {view === "forgot" && (
          <>
            <CardHeader className="pb-2">
              <button onClick={() => setView("login")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
                <ArrowLeft size={16} />{t("Back to login", "العودة لتسجيل الدخول")}
              </button>
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Sms size={24} className="text-secondary" />
              </div>
              <p className="text-lg font-semibold text-center">{t("Reset Password", "إعادة تعيين كلمة المرور")}</p>
              <p className="text-sm text-muted-foreground text-center">{t("Enter your email to receive a verification code.", "أدخل بريدك الإلكتروني لتلقي رمز التحقق.")}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Email", "البريد الإلكتروني")}</Label>
                  <Input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="ahmed@email.com" />
                </div>
                <Button type="submit" className="w-full">{t("Send Code", "إرسال الرمز")}</Button>
              </form>
            </CardContent>
          </>
        )}

        {/* === OTP VIEW === */}
        {view === "otp" && (
          <>
            <CardHeader className="pb-2">
              <button onClick={() => setView("forgot")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
                <ArrowLeft size={16} />{t("Back", "رجوع")}
              </button>
              <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock size={24} className="text-primary" />
              </div>
              <p className="text-lg font-semibold text-center">{t("Enter Verification Code", "أدخل رمز التحقق")}</p>
              <p className="text-sm text-muted-foreground text-center">
                {t(`We sent a code to ${resetEmail}`, `أرسلنا رمزاً إلى ${resetEmail}`)}
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
                  />
                </div>
                <Button type="submit" className="w-full">{t("Verify", "تحقق")}</Button>
                <button type="button" onClick={handleForgotSubmit} className="w-full text-sm text-secondary hover:underline text-center">
                  {t("Resend Code", "إعادة إرسال الرمز")}
                </button>
              </form>
            </CardContent>
          </>
        )}

        {/* === RESET SUCCESS VIEW === */}
        {view === "reset-success" && (
          <>
            <CardHeader className="pb-2 text-center">
              <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldTick size={28} className="text-success" />
              </div>
              <p className="text-lg font-semibold">{t("Password Reset Link Sent", "تم إرسال رابط إعادة التعيين")}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t(
                  "Check your email for a link to reset your password. If it doesn't appear, check your spam folder.",
                  "تحقق من بريدك الإلكتروني للحصول على رابط لإعادة تعيين كلمة المرور. إذا لم يظهر، تحقق من مجلد البريد العشوائي."
                )}
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => { setView("login"); setOtp(""); setResetEmail(""); }}>
                {t("Back to Login", "العودة لتسجيل الدخول")}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
