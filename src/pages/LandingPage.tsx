import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Global, HambergerMenu, CloseCircle, ShieldTick,
  VideoPlay, Book1, Headphone, Wifi, ArrowRight, Call, MessageText1,
  Timer1, TickCircle, Flash, Data, Crown,
  ArrowUp, ArrowUp2, Map1
} from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { plans, networkStatus } from "@/data/mockData";
import OmrSymbol from "@/components/OmrSymbol";
import ChatbotWidget from "@/components/ChatbotWidget";
import awasrLogo from "@/assets/awasr-logo.png";
import heroIllustration from "@/assets/hero-illustration.png";

const internetPlans = plans.filter((p) => p.type === "internet");

const features = [
  { icon: Data, en: "Unlimited Data", ar: "بيانات غير محدودة", descEn: "No data caps or throttling. Ever.", descAr: "بدون حدود أو تقييد. أبداً." },
  { icon: ShieldTick, en: "SafeNet", ar: "سيف نت", descEn: "Malware protection & parental controls built into your connection.", descAr: "حماية من البرمجيات الخبيثة ومراقبة أبوية مدمجة في اتصالك." },
  { icon: VideoPlay, en: "Shahid VIP Lite", ar: "شاهد VIP لايت", descEn: "Arabic & international movies, series, and 150+ live channels.", descAr: "أفلام ومسلسلات عربية ودولية وأكثر من 150 قناة مباشرة." },
  { icon: Book1, en: "Ashal Education", ar: "أسهل تعليم", descEn: "Free curriculum-aligned learning platform for students.", descAr: "منصة تعليمية مجانية متوافقة مع المنهج للطلاب." },
  { icon: Headphone, en: "24/7 Support", ar: "دعم متواصل", descEn: "Call 80001000 or WhatsApp us anytime.", descAr: "اتصل بـ 80001000 أو راسلنا واتساب في أي وقت." },
  { icon: Map1, en: "Barqi Coverage", ar: "تغطية برقي", descEn: "Growing fiber network across Oman's major cities.", descAr: "شبكة ألياف متنامية عبر المدن الرئيسية في عُمان." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-600 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { t, language, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contractTerm, setContractTerm] = useState<"1" | "2">("2");
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#plans", en: "Plans", ar: "الباقات" },
    { href: "#features", en: "Why Awasr", ar: "لماذا أوامر" },
    { href: "#coverage", en: "Coverage", ar: "التغطية" },
    { href: "#contact", en: "Contact", ar: "تواصل" },
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const statusBg = (s: string) =>
    s === "operational" ? "bg-success" : s === "degraded" ? "bg-warning" : "bg-destructive";
  const statusText = (s: string) =>
    s === "operational" ? t("Live", "تعمل") : s === "degraded" ? t("Slow", "بطيئة") : t("Down", "متوقفة");

  return (
    <div className="min-h-screen bg-background">

      {/* ── NAVBAR ── */}
      <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-card/95 backdrop-blur-xl border-b border-border" : "bg-card border-b border-border"}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14 md:h-16">
          <Link to="/" className="shrink-0">
            <img src={awasrLogo} alt="Awasr" className="h-8 md:h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Global size={14} className="inline me-1" />
              {language === "en" ? "عربي" : "EN"}
            </button>
            <Link to="/login" className="hidden md:inline-flex px-4 py-2 rounded-lg text-xs font-semibold text-primary-foreground gradient-primary hover:opacity-90 transition-opacity">
              {t("My Awasr", "حسابي")}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
              {menuOpen ? <CloseCircle size={20} /> : <HambergerMenu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 pb-4 pt-1 animate-fade-in">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-start px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground gradient-primary mt-2">
              {t("Login", "الدخول")}
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-white/60 text-sm font-medium tracking-wide mb-4">
                {t("FIBER INTERNET • OMAN", "إنترنت ألياف • عُمان")}
              </p>
              <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white mb-5">
                {t("Internet that actually keeps up.", "إنترنت يواكب سرعتك.")}
              </h1>
              <p className="text-base md:text-lg text-white/70 max-w-md mb-8">
                {t(
                  "Fiber speeds from 300 Mbps to 1 Gbps. Unlimited data. No surprises on your bill. Plans start at 27 OMR.",
                  "سرعات ألياف من 300 ميجا إلى 1 جيجا. بيانات غير محدودة. بدون مفاجآت في فاتورتك. الباقات تبدأ من 27 ر.ع."
                )}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => scrollTo("#plans")} className="group px-6 py-3 rounded-lg bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-colors flex items-center gap-2">
                  {t("See plans", "شاهد الباقات")}
                  <ArrowRight size={15} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <Link to="/login" className="px-6 py-3 rounded-lg border border-white/25 text-white font-medium text-sm hover:bg-white/10 transition-colors">
                  {t("Sign in", "تسجيل الدخول")}
                </Link>
              </div>
              {/* Quick numbers */}
              <div className="flex flex-wrap gap-6 text-white/50 text-sm">
                <span><strong className="text-white font-semibold">1 Gbps</strong> {t("max speed", "أقصى سرعة")}</span>
                <span><strong className="text-white font-semibold">8+</strong> {t("cities", "مدن")}</span>
                <span><strong className="text-white font-semibold">80001000</strong> {t("support", "الدعم")}</span>
              </div>
            </div>
            {/* Illustration */}
            <div className="hidden md:flex justify-center">
              <img
                src={heroIllustration}
                alt=""
                className="w-full max-w-xs lg:max-w-sm object-contain drop-shadow-2xl"
                style={{ animation: "float 6s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="plans" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{t("Fibernet Home Plans", "باقات فايبرنت المنزلية")}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{t("All plans include unlimited data. No data caps, ever.", "جميع الباقات تشمل بيانات غير محدودة.")}</p>
            </div>
            {/* Contract toggle */}
            <div className="inline-flex items-center bg-muted rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => setContractTerm("1")}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${contractTerm === "1" ? "bg-card card-shadow text-foreground" : "text-muted-foreground"}`}
              >
                {t("1 Year", "سنة")}
              </button>
              <button
                onClick={() => setContractTerm("2")}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${contractTerm === "2" ? "bg-card card-shadow text-foreground" : "text-muted-foreground"}`}
              >
                {t("2 Years", "سنتان")} <span className="text-primary ms-1">✦</span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internetPlans.map((plan) => {
            const isPopular = plan.id === "PLN-04";
            const isTop = plan.id === "PLN-07";
            return (
              <Reveal key={plan.id}>
                <div className={`relative rounded-xl bg-card card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-1 h-full flex flex-col ${isPopular ? "ring-2 ring-primary" : ""} ${isTop ? "ring-2 ring-secondary" : ""}`}>
                  {isPopular && (
                    <div className="absolute -top-2.5 start-4 px-2 py-0.5 rounded-md gradient-primary text-white text-[10px] font-semibold flex items-center gap-1">
                      <Crown size={10} />{t("Popular", "الأشهر")}
                    </div>
                  )}
                  {isTop && (
                    <div className="absolute -top-2.5 start-4 px-2 py-0.5 rounded-md bg-secondary text-white text-[10px] font-semibold flex items-center gap-1">
                      <Flash size={10} />{t("Fastest", "الأسرع")}
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{t(plan.name, plan.nameAr)}</p>

                    {/* Speed */}
                    <div className="mb-1">
                      <span className="text-3xl font-bold tabular-nums">{plan.speed.replace(" Mbps", "").replace(" Gbps", "")}</span>
                      <span className="text-xs font-medium text-muted-foreground ms-1">{plan.speed.includes("Gbps") ? "Gbps" : "Mbps"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-4 flex items-center gap-1">
                      <ArrowUp size={10} className="text-secondary" />
                      {plan.uploadSpeed} {t("upload", "رفع")}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <OmrSymbol className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">/{t("mo", "شهر")}</span>
                      <span className="text-[10px] text-muted-foreground ms-auto">{t("incl. VAT", "شامل الضريبة")}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <TickCircle size={12} className="text-success shrink-0" variant="Bold" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/login"
                      className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isPopular
                          ? "gradient-primary text-white hover:opacity-90"
                          : isTop
                          ? "bg-secondary text-white hover:opacity-90"
                          : "bg-muted text-foreground hover:bg-muted/70"
                      }`}
                    >
                      {t("Subscribe", "اشترك")}
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-6">{t("Prices include 5% VAT. Installation: 15 OMR (1yr) or 10 OMR (2yr).", "الأسعار شاملة 5% ضريبة. التركيب: 15 ر.ع (سنة) أو 10 ر.ع (سنتين).")}</p>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-muted/40 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("What's included", "ماذا يشمل الاشتراك")}</h2>
            <p className="text-muted-foreground text-sm mb-10 max-w-md">{t("Every Fibernet Home plan comes with more than just speed.", "كل باقة فايبرنت هوم تأتي مع أكثر من مجرد سرعة.")}</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Reveal key={i}>
                <div className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all duration-200 h-full flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{t(f.en, f.ar)}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(f.descEn, f.descAr)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section id="coverage" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("Where we are", "أين نحن")}</h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{t("Fiber coverage across Oman's major cities — and we're expanding fast. If you don't see your area, check back soon.", "تغطية ألياف عبر المدن الرئيسية في عُمان — ونحن نتوسع بسرعة. إذا لم ترَ منطقتك، تابعنا قريباً.")}</p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {t("Check your address", "تحقق من عنوانك")}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-3">
            <Reveal>
              <div className="grid grid-cols-2 gap-2.5">
                {networkStatus.map((r, i) => (
                  <div key={i} className="bg-card rounded-lg p-3 card-shadow flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${statusBg(r.status)}`} />
                    <span className="text-sm font-medium flex-1 truncate">{t(r.region, r.regionAr)}</span>
                    <span className={`text-[10px] font-medium ${r.status === "operational" ? "text-success" : r.status === "degraded" ? "text-warning" : "text-destructive"}`}>{statusText(r.status)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="gradient-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t("Ready to switch?", "جاهز للتحول؟")}</h2>
            <p className="text-white/65 text-sm">{t("Pick a plan and get connected — installation takes a few days.", "اختر باقة واتصل — التركيب يستغرق أيام قليلة.")}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => scrollTo("#plans")} className="group px-6 py-3 rounded-lg bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-colors flex items-center gap-2">
              {t("View plans", "الباقات")}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </button>
            <a href="tel:80001000" className="px-6 py-3 rounded-lg border border-white/25 text-white font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
              <Call size={14} /> 80001000
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <img src={awasrLogo} alt="Awasr" className="h-8 w-auto object-contain mb-3" />
              <p className="text-xs text-muted-foreground leading-relaxed">{t("Fiber internet for homes across Oman.", "إنترنت ألياف للمنازل في جميع أنحاء عُمان.")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">{t("Links", "روابط")}</h4>
              <div className="space-y-2">
                <button onClick={() => scrollTo("#plans")} className="block text-sm text-foreground/80 hover:text-primary transition-colors">{t("Plans", "الباقات")}</button>
                <button onClick={() => scrollTo("#features")} className="block text-sm text-foreground/80 hover:text-primary transition-colors">{t("Features", "المميزات")}</button>
                <button onClick={() => scrollTo("#coverage")} className="block text-sm text-foreground/80 hover:text-primary transition-colors">{t("Coverage", "التغطية")}</button>
                <Link to="/login" className="block text-sm text-foreground/80 hover:text-primary transition-colors">{t("My Awasr", "حسابي")}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">{t("Support", "الدعم")}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/80"><Call size={13} className="text-primary" /> 80001000</div>
                <div className="flex items-center gap-2 text-foreground/80"><MessageText1 size={13} className="text-primary" /> WhatsApp</div>
                <div className="flex items-center gap-2 text-foreground/80"><Timer1 size={13} className="text-primary" /> 24/7</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-3">{t("Legal", "قانوني")}</h4>
              <div className="space-y-2 text-sm text-foreground/80">
                <p>{t("Terms & Conditions", "الشروط والأحكام")}</p>
                <p>{t("Privacy Policy", "سياسة الخصوصية")}</p>
                <p>{t("Fair Usage", "الاستخدام العادل")}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>© {new Date().getFullYear()} Awasr. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</span>
            <span>{t("Licensed by TRA Oman", "مرخصة من هيئة تنظيم الاتصالات")}</span>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed z-40 bottom-20 md:bottom-6 end-4 md:end-20 h-10 w-10 rounded-full bg-card card-shadow-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:card-shadow-hover transition-all duration-300 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <ArrowUp2 size={18} />
      </button>

      <ChatbotWidget />
    </div>
  );
}
