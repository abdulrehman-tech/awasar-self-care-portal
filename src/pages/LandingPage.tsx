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

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
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

      {/* ── NAVBAR — Glass Morphism ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav" : "bg-card/50 backdrop-blur-sm border-b border-border/50"}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14 md:h-16">
          <Link to="/" className="shrink-0">
            <img src={awasrLogo} alt="Awasr" className="h-8 md:h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all duration-200">
                {t(l.en, l.ar)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200">
              <Global size={14} className="inline me-1" />
              {language === "en" ? "عربي" : "EN"}
            </button>
            <Link to="/login" className="hidden md:inline-flex px-5 py-2 rounded-xl text-xs font-semibold text-primary-foreground gradient-primary hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
              {t("My Awasr", "حسابي")}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
              {menuOpen ? <CloseCircle size={20} /> : <HambergerMenu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 px-4 pb-4 pt-1 animate-fade-in">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-start px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground gradient-primary mt-2">
              {t("Login", "الدخول")}
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO — Cinematic Depth ── */}
      <section className="relative overflow-hidden gradient-mesh grain-overlay">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.06] z-[2]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Decorative glowing orbs */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-secondary/20 rounded-full blur-[100px] z-[1]" />
        <div className="absolute bottom-10 left-[5%] w-96 h-96 bg-primary/15 rounded-full blur-[120px] z-[1]" />

        <div className="relative z-[3] max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-32 md:pt-36 md:pb-40">
          <div className="max-w-3xl">
            {/* Speed pill badge */}
            <Reveal>
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.08] backdrop-blur-lg border border-white/[0.12] mb-8 shadow-lg shadow-black/5">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-warning/20">
                  <Flash size={11} className="text-warning" variant="Bold" />
                </div>
                <span className="text-white/90 text-[13px] font-medium tracking-wide">
                  {t("Up to 1 Gbps fiber speed", "سرعة ألياف تصل إلى 1 جيجا")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[0.98] text-white mb-7" style={{ letterSpacing: "-0.035em" }}>
                {t("Internet that", "إنترنت")}
                <br />
                <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                  {t("actually keeps up.", "يواكب سرعتك.")}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-[15px] md:text-lg text-white/55 max-w-xl mb-12 leading-[1.7]">
                {t(
                  "Fiber speeds from 300 Mbps to 1 Gbps. Unlimited data. No surprises on your bill. Plans start at 27 OMR.",
                  "سرعات ألياف من 300 ميجا إلى 1 جيجا. بيانات غير محدودة. بدون مفاجآت في فاتورتك. الباقات تبدأ من 27 ر.ع."
                )}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-3.5">
                <button onClick={() => scrollTo("#plans")} className="group px-8 py-4 rounded-2xl bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-all duration-300 flex items-center gap-2.5 shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5">
                  {t("See plans", "شاهد الباقات")}
                  <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <Link to="/login" className="px-8 py-4 rounded-2xl border border-white/15 text-white/90 font-medium text-sm hover:bg-white/10 hover:border-white/25 transition-all duration-300 backdrop-blur-sm">
                  {t("Sign in", "تسجيل الدخول")}
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Stats — frosted glass cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-20 max-w-2xl">
            {[
              { icon: Flash, val: "1 Gbps", label: t("Max speed", "أقصى سرعة") },
              { icon: Map1, val: "8+", label: t("Cities covered", "مدن مغطاة") },
              { icon: Headphone, val: "24/7", label: t("Support", "الدعم") },
            ].map((s, i) => (
              <Reveal key={i} delay={400 + i * 120}>
                <div className="flex flex-col items-center md:flex-row md:items-center gap-2.5 md:gap-3.5 px-4 py-4 md:px-5 md:py-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 shrink-0">
                    <s.icon size={19} className="text-white/85" variant="Bold" />
                  </div>
                  <div className="text-center md:text-start">
                    <p className="text-white font-bold text-lg md:text-xl leading-tight">{s.val}</p>
                    <p className="text-white/40 text-[11px] md:text-xs mt-0.5">{s.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS — Elevated Cards ── */}
      <section id="plans" className="relative">
        {/* Subtle radial gradient bg */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(316, 70%, 95% / 0.4), transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{t("Fibernet Home Plans", "باقات فايبرنت المنزلية")}</h2>
                <p className="text-muted-foreground mt-2 text-sm max-w-md">{t("All plans include unlimited data. No data caps, ever.", "جميع الباقات تشمل بيانات غير محدودة.")}</p>
              </div>
              {/* Contract toggle — pill style */}
              <div className="inline-flex items-center bg-muted rounded-xl p-1 shrink-0 shadow-inner">
                <button
                  onClick={() => setContractTerm("1")}
                  className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${contractTerm === "1" ? "bg-card card-shadow text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t("1 Year", "سنة")}
                </button>
                <button
                  onClick={() => setContractTerm("2")}
                  className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${contractTerm === "2" ? "bg-card card-shadow text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t("2 Years", "سنتان")} <span className="text-primary ms-1">✦</span>
                </button>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {internetPlans.map((plan, idx) => {
              const isPopular = plan.id === "PLN-04";
              const isTop = plan.id === "PLN-07";
              return (
                <Reveal key={plan.id} delay={idx * 80}>
                  <div
                    className={`relative rounded-2xl bg-card border border-border/50 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col overflow-hidden ${
                      isPopular ? "shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15" :
                      isTop ? "shadow-lg shadow-secondary/10 hover:shadow-xl hover:shadow-secondary/15" :
                      "card-shadow hover:card-shadow-hover"
                    }`}
                  >
                    {/* Gradient top border for popular/top */}
                    {isPopular && <div className="h-1 w-full gradient-primary" />}
                    {isTop && <div className="h-1 w-full bg-secondary" />}

                    {isPopular && (
                      <div className="absolute top-3 end-4 px-2.5 py-1 rounded-full gradient-primary text-white text-[10px] font-semibold flex items-center gap-1">
                        <Crown size={10} />{t("Popular", "الأشهر")}
                      </div>
                    )}
                    {isTop && (
                      <div className="absolute top-3 end-4 px-2.5 py-1 rounded-full bg-secondary text-white text-[10px] font-semibold flex items-center gap-1">
                        <Flash size={10} />{t("Fastest", "الأسرع")}
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">{t(plan.name, plan.nameAr)}</p>

                      {/* Speed — larger for elegance */}
                      <div className="mb-1">
                        <span className="text-4xl font-light tabular-nums tracking-tight">{plan.speed.replace(" Mbps", "").replace(" Gbps", "")}</span>
                        <span className="text-sm font-medium text-muted-foreground ms-1.5">{plan.speed.includes("Gbps") ? "Gbps" : "Mbps"}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-5 flex items-center gap-1">
                        <ArrowUp size={10} className="text-secondary" />
                        {plan.uploadSpeed} {t("upload", "رفع")}
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mb-5">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <OmrSymbol className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">/{t("mo", "شهر")}</span>
                        <span className="text-[10px] text-muted-foreground ms-auto">{t("incl. VAT", "شامل الضريبة")}</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6 flex-1">
                        {plan.features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TickCircle size={13} className="text-success shrink-0" variant="Bold" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/login"
                        className={`block text-center py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isPopular
                            ? "gradient-primary text-white hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
                            : isTop
                            ? "bg-secondary text-white hover:opacity-90 hover:shadow-lg hover:shadow-secondary/20"
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
          <p className="text-[11px] text-muted-foreground mt-8">{t("Prices include 5% VAT. Installation: 15 OMR (1yr) or 10 OMR (2yr).", "الأسعار شاملة 5% ضريبة. التركيب: 15 ر.ع (سنة) أو 10 ر.ع (سنتين).")}</p>
        </div>
      </section>

      {/* ── FEATURES — Asymmetric Grid ── */}
      <section id="features" className="bg-muted/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <Reveal>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{t("What's included", "ماذا يشمل الاشتراك")}</h2>
            <p className="text-muted-foreground text-sm mb-12 max-w-md">{t("Every Fibernet Home plan comes with more than just speed.", "كل باقة فايبرنت هوم تأتي مع أكثر من مجرد سرعة.")}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const isHero = i === 0;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className={`bg-card rounded-2xl border border-border/40 card-shadow hover:card-shadow-hover transition-all duration-300 h-full ${
                    isHero ? "md:col-span-2 p-8 flex gap-6 items-start" : "p-6 flex gap-4"
                  }`}>
                    <div className={`rounded-xl flex items-center justify-center shrink-0 ${
                      isHero
                        ? "h-14 w-14 bg-gradient-to-br from-primary/15 to-secondary/10"
                        : "h-12 w-12 bg-gradient-to-br from-primary/10 to-primary/5"
                    }`}>
                      <f.icon size={isHero ? 26 : 22} className="text-primary" />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1.5 ${isHero ? "text-lg" : "text-sm"}`}>{t(f.en, f.ar)}</h3>
                      <p className={`text-muted-foreground leading-relaxed ${isHero ? "text-sm" : "text-xs"}`}>{t(f.descEn, f.descAr)}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COVERAGE — Cleaner Visual ── */}
      <section id="coverage" className="relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 70% 50%, hsl(202, 85%, 95% / 0.3), transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{t("Where we are", "أين نحن")}</h2>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{t("Fiber coverage across Oman's major cities — and we're expanding fast. If you don't see your area, check back soon.", "تغطية ألياف عبر المدن الرئيسية في عُمان — ونحن نتوسع بسرعة. إذا لم ترَ منطقتك، تابعنا قريباً.")}</p>
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  {t("Check your address", "تحقق من عنوانك")}
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-3">
              <Reveal delay={100}>
                <div className="grid grid-cols-2 gap-3">
                  {networkStatus.map((r, i) => (
                    <div key={i} className="bg-card rounded-xl p-4 card-shadow border border-border/30 hover:card-shadow-hover transition-all duration-200 flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${statusBg(r.status)} ${r.status === "operational" ? "animate-pulse-dot" : ""}`} />
                      <span className="text-sm font-medium flex-1 truncate">{t(r.region, r.regionAr)}</span>
                      <span className={`text-[10px] font-medium ${r.status === "operational" ? "text-success" : r.status === "degraded" ? "text-warning" : "text-destructive"}`}>{statusText(r.status)}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — More Dramatic ── */}
      <section className="gradient-mesh grain-overlay relative overflow-hidden">
        <div className="relative z-[3] max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{t("Ready to switch?", "جاهز للتحول؟")}</h2>
            <p className="text-white/60 text-sm max-w-md">{t("Pick a plan and get connected — installation takes a few days.", "اختر باقة واتصل — التركيب يستغرق أيام قليلة.")}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={() => scrollTo("#plans")} className="group px-7 py-3.5 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/10">
              {t("View plans", "الباقات")}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </button>
            <a href="tel:80001000" className="px-7 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm flex items-center gap-2">
              <Call size={14} /> 80001000
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER — Refined Spacing ── */}
      <footer id="contact" className="bg-card border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            <div className="col-span-2 md:col-span-1">
              <img src={awasrLogo} alt="Awasr" className="h-8 w-auto object-contain mb-4" />
              <p className="text-xs text-muted-foreground/80 leading-relaxed">{t("Fiber internet for homes across Oman.", "إنترنت ألياف للمنازل في جميع أنحاء عُمان.")}</p>
            </div>
            <div className="border-s border-border/40 ps-6 md:border-0 md:ps-0">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">{t("Links", "روابط")}</h4>
              <div className="space-y-2.5">
                <button onClick={() => scrollTo("#plans")} className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("Plans", "الباقات")}</button>
                <button onClick={() => scrollTo("#features")} className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("Features", "المميزات")}</button>
                <button onClick={() => scrollTo("#coverage")} className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("Coverage", "التغطية")}</button>
                <Link to="/login" className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("My Awasr", "حسابي")}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">{t("Support", "الدعم")}</h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-foreground/70"><Call size={13} className="text-primary" /> 80001000</div>
                <div className="flex items-center gap-2 text-foreground/70"><MessageText1 size={13} className="text-primary" /> WhatsApp</div>
                <div className="flex items-center gap-2 text-foreground/70"><Timer1 size={13} className="text-primary" /> 24/7</div>
              </div>
            </div>
            <div className="border-s border-border/40 ps-6 md:border-0 md:ps-0">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground/60 mb-4">{t("Legal", "قانوني")}</h4>
              <div className="space-y-2.5 text-sm text-foreground/70">
                <p className="hover:text-primary transition-colors cursor-pointer">{t("Terms & Conditions", "الشروط والأحكام")}</p>
                <p className="hover:text-primary transition-colors cursor-pointer">{t("Privacy Policy", "سياسة الخصوصية")}</p>
                <p className="hover:text-primary transition-colors cursor-pointer">{t("Fair Usage", "الاستخدام العادل")}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/60">
            <span>© {new Date().getFullYear()} Awasr. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</span>
            <span>{t("Licensed by TRA Oman", "مرخصة من هيئة تنظيم الاتصالات")}</span>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed z-40 bottom-20 md:bottom-6 end-4 md:end-20 h-11 w-11 rounded-full bg-card/90 backdrop-blur-md card-shadow-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:card-shadow-hover transition-all duration-300 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <ArrowUp2 size={18} />
      </button>

      <ChatbotWidget />
    </div>
  );
}
