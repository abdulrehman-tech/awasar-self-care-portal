import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Global } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import awasrLogo from "@/assets/awasr-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      {/* Language toggle */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors bg-card border border-border"
      >
        <Global size={16} />
        {language === "en" ? "عربي" : "EN"}
      </button>

      <Card className="w-full max-w-sm">
        {/* Gradient accent bar */}
        <div className="h-1.5 gradient-primary rounded-t-lg" />
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
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("ahmed@email.com", "ahmed@email.com")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("Password", "كلمة المرور")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <button type="button" className="text-sm text-secondary hover:underline">
                {t("Forgot Password?", "نسيت كلمة المرور؟")}
              </button>
            </div>
            <Button type="submit" className="w-full">
              {t("Sign In", "تسجيل الدخول")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
