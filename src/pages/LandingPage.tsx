import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Global, HambergerMenu, CloseCircle, Speedometer, ShieldTick,
  VideoPlay, Book1, Headphone, Wifi, ArrowRight, Call, MessageText1,
  Location, Timer1, TickCircle
} from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { plans, networkStatus } from "@/data/mockData";
import OmrSymbol from "@/components/OmrSymbol";
import ChatbotWidget from "@/components/ChatbotWidget";
import awasrLogo from "@/assets/awasr-logo.png";

const internetPlans = plans.filter((p) => p.type === "internet");

const features = [
  { icon: Wifi, en: "Unlimited Data", ar: "بيانات غير محدودة", descEn: "No caps, no throttling — browse, stream, and download without limits.", descAr: "بدون حدود أو تقييد — تصفح وشاهد وحمّل بدون قيود." },
  { icon: ShieldTick, en: "SafeNet Security", ar: "حماية سيف نت", descEn: "Built-in malware protection and parental controls for your home.", descAr: "حماية مدمجة من البرمجيات الخبيثة ومراقبة أبوية لمنزلك." },
  { icon: VideoPlay, en: "Jawwy TV", ar: "جوّي تي في", descEn: "150+ live channels, movies, series and kids content included.", descAr: "أكثر من 150 قناة مباشرة وأفلام ومسلسلات ومحتوى أطفال." },
  { icon: Book1, en: "Ashal Education", ar: "أسهل تعليم", descEn: "Free educational platform access for students across Oman.", descAr: "وصول مجاني لمنصة تعليمية للطلاب في جميع أنحاء عُمان." },
  { icon: Headphone, en: "24/7 Support", ar: "دعم على مدار الساعة", descEn: "Call 80001000 anytime or chat with us via WhatsApp.", descAr: "اتصل بـ 80001000 في أي وقت أو تواصل معنا عبر واتساب." },
  { icon: Location, en: "Wide Coverage", ar: "تغطية واسعة", descEn: "Fiber coverage across Muscat, Seeb, Sohar, Salalah and more.", descAr: "تغطية ألياف في مسقط والسيب وصحار وصلالة والمزيد." },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { t, language, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#plans", en: "Plans", ar: "الباقات" },
    { href: "#features", en: "Features", ar: "المميزات" },
    { href: "#coverage", en: "Coverage", ar: "التغطية" },
    { href: "#contact", en: "Contact", ar: "تواصل معنا" },
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const statusColor = (s: string) =>
    s === "operational" ? "text-success" : s === "degraded" ? "text-warning" : "text-destructive";
  const statusLabel = (s: string) =>
    s === "operational" ? t("Operational", "تعمل") : s === "degraded" ? t("Degraded", "متدهورة") : t("Outage", "انقطاع");

  return (
    <div className="min-h-screen bg-background">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <img src={awasrLogo} alt="Awasr" className="h-9 w-auto object-contain" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Global size={16} />
              {language === "en" ? "عربي" : "EN"}
            </button>
            <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground gradient-primary hover:opacity-90 transition-opacity">
              {t("My Awasr", "حسابي")}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              {menuOpen ? <CloseCircle size={22} /> : <HambergerMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2 space-y-1 animate-fade-in">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-primary-foreground gradient-primary mt-2">
              {t("My Awasr Login", "تسجيل الدخول")}
            </Link>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center text-white">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm mb-6">
              <Speedometer size={16} />
              {t("Up to 1 Gbps Fiber Speed", "سرعة ألياف تصل إلى 1 جيجا")}
            </div>
          </FadeIn>
          <FadeIn>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {t("Oman's Fastest", "أسرع إنترنت ألياف")}<br />
              {t("Fiber Internet", "في عُمان")}
            </h1>
          </FadeIn>
          <FadeIn>
            <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8">
              {t(
                "Experience blazing-fast connectivity with unlimited data, SafeNet security, and Jawwy TV — all in one plan.",
                "استمتع باتصال فائق السرعة مع بيانات غير محدودة وحماية سيف نت وجوّي تي في — كل ذلك في باقة واحدة."
              )}
            </p>
          </FadeIn>
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => scrollTo("#plans")} className="px-6 py-3 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
                {t("Browse Plans", "تصفح الباقات")}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </button>
              <Link to="/login" className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                {t("My Awasr Login", "تسجيل الدخول")}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section id="plans" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("Fibernet Home Plans", "باقات فايبرنت المنزلية")}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("Choose the perfect speed for your home — all plans include unlimited data.", "اختر السرعة المثالية لمنزلك — جميع الباقات تشمل بيانات غير محدودة.")}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {internetPlans.map((plan, i) => {
            const isPopular = plan.id === "PLN-04"; // Home 35
            return (
              <FadeIn key={plan.id}>
                <div className={`relative rounded-2xl p-5 bg-card border-0 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 h-full flex flex-col ${isPopular ? "ring-2 ring-primary" : ""}`}>
                  {isPopular && (
                    <div className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-0.5 rounded-full gradient-primary text-white text-xs font-medium">
                      {t("Most Popular", "الأكثر شعبية")}
                    </div>
                  )}
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm">{t(plan.name, plan.nameAr)}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Speedometer size={14} className="text-secondary" />
                      <span className="text-xs text-muted-foreground">{plan.speed} ↓ / {plan.uploadSpeed} ↑</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <OmrSymbol className="ms-1" />
                    <span className="text-xs text-muted-foreground">/{t("mo", "شهر")}</span>
                  </div>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <TickCircle size={14} className="text-success shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/login" className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all ${isPopular ? "gradient-primary text-white hover:opacity-90" : "bg-muted hover:bg-muted/70 text-foreground"}`}>
                    {t("Subscribe", "اشترك الآن")}
                  </Link>
                </div>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <p className="text-center text-xs text-muted-foreground mt-6">{t("All prices include 5% VAT.", "جميع الأسعار تشمل 5% ضريبة القيمة المضافة.")}</p>
        </FadeIn>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("Why Choose Awasr?", "لماذا تختار أوامر؟")}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{t("More than just fast internet — we deliver a complete connected home experience.", "أكثر من مجرد إنترنت سريع — نقدم تجربة منزل متصل متكاملة.")}</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i}>
                <div className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 h-full">
                  <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center text-white mb-4">
                    <f.icon size={22} variant="Bold" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{t(f.en, f.ar)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descEn, f.descAr)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COVERAGE ===== */}
      <section id="coverage" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("Network Coverage", "تغطية الشبكة")}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("Awasr fiber is available across major cities and regions in Oman.", "ألياف أوامر متوفرة في جميع المدن والمناطق الرئيسية في عُمان.")}</p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {networkStatus.map((r, i) => (
            <FadeIn key={i}>
              <div className="bg-card rounded-xl p-4 card-shadow flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${r.status === "operational" ? "bg-success" : r.status === "degraded" ? "bg-warning" : "bg-destructive"}`} />
                <div>
                  <p className="text-sm font-medium">{t(r.region, r.regionAr)}</p>
                  <p className={`text-xs ${statusColor(r.status)}`}>{statusLabel(r.status)}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("Ready to Get Connected?", "جاهز للاتصال؟")}</h2>
            <p className="text-white/80 mb-6 max-w-md mx-auto">{t("Join thousands of Omani homes enjoying ultra-fast fiber internet.", "انضم لآلاف المنازل العُمانية التي تستمتع بإنترنت ألياف فائق السرعة.")}</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors">
              {t("Get Started", "ابدأ الآن")}
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src={awasrLogo} alt="Awasr" className="h-10 w-auto object-contain mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{t("Oman's fastest fiber internet provider, delivering high-speed connectivity to homes across the Sultanate.", "أسرع مزود إنترنت ألياف في عُمان، نقدم اتصالاً عالي السرعة للمنازل في جميع أنحاء السلطنة.")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t("Quick Links", "روابط سريعة")}</h4>
              <div className="space-y-2">
                <button onClick={() => scrollTo("#plans")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Plans & Pricing", "الباقات والأسعار")}</button>
                <button onClick={() => scrollTo("#features")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Features", "المميزات")}</button>
                <button onClick={() => scrollTo("#coverage")} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Coverage", "التغطية")}</button>
                <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t("My Awasr", "حسابي")}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">{t("Contact Us", "تواصل معنا")}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Call size={16} className="text-primary shrink-0" />
                  <span>80001000</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageText1 size={16} className="text-primary shrink-0" />
                  <span>{t("WhatsApp: 80001000", "واتساب: 80001000")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer1 size={16} className="text-primary shrink-0" />
                  <span>{t("24/7 Support", "دعم على مدار الساعة")}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Awasr. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatbotWidget />
    </div>
  );
}
