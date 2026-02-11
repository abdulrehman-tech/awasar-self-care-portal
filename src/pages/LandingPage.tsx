import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Global, HambergerMenu, CloseCircle, Speedometer, ShieldTick,
  VideoPlay, Book1, Headphone, Wifi, ArrowRight, Call, MessageText1,
  Location, Timer1, TickCircle, Flash, Data, Monitor, Crown,
  ArrowUp, Map1, StatusUp
} from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { plans, networkStatus } from "@/data/mockData";
import OmrSymbol from "@/components/OmrSymbol";
import ChatbotWidget from "@/components/ChatbotWidget";
import awasrLogo from "@/assets/awasr-logo.png";

const internetPlans = plans.filter((p) => p.type === "internet");

const features = [
  { icon: Data, en: "Unlimited Data", ar: "بيانات غير محدودة", descEn: "No caps, no throttling — browse, stream, and download without any limits on your usage.", descAr: "بدون حدود أو تقييد — تصفح وشاهد وحمّل بدون أي قيود على استخدامك." },
  { icon: ShieldTick, en: "SafeNet Security", ar: "حماية سيف نت", descEn: "Built-in malware protection and parental controls to keep your home network safe.", descAr: "حماية مدمجة من البرمجيات الخبيثة ومراقبة أبوية للحفاظ على أمان شبكتك المنزلية." },
  { icon: VideoPlay, en: "Shahid VIP Lite", ar: "شاهد VIP لايت", descEn: "Enjoy premium Arabic & international content — movies, series, and live TV channels.", descAr: "استمتع بمحتوى عربي ودولي مميز — أفلام ومسلسلات وقنوات مباشرة." },
  { icon: Book1, en: "Ashal Education", ar: "أسهل تعليم", descEn: "Free educational platform access for students across Oman with rich curriculum content.", descAr: "وصول مجاني لمنصة تعليمية للطلاب في جميع أنحاء عُمان بمحتوى منهجي غني." },
  { icon: Headphone, en: "24/7 Support", ar: "دعم على مدار الساعة", descEn: "Our dedicated team is always available. Call 80001000 or reach us via WhatsApp.", descAr: "فريقنا المتخصص متاح دائماً. اتصل بـ 80001000 أو تواصل معنا عبر واتساب." },
  { icon: Map1, en: "Barqi Coverage", ar: "تغطية برقي", descEn: "Extensive fiber coverage across Muscat, Seeb, Sohar, Salalah, and growing regions.", descAr: "تغطية ألياف واسعة في مسقط والسيب وصحار وصلالة والمناطق المتزايدة." },
];

const stats = [
  { value: "1 Gbps", en: "Max Speed", ar: "أقصى سرعة" },
  { value: "8+", en: "Cities Covered", ar: "مدن مغطاة" },
  { value: "99.9%", en: "Uptime SLA", ar: "وقت التشغيل" },
  { value: "24/7", en: "Support", ar: "دعم فني" },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    s === "operational" ? "bg-success" : s === "degraded" ? "bg-warning" : "bg-destructive";
  const statusLabel = (s: string) =>
    s === "operational" ? t("Operational", "تعمل") : s === "degraded" ? t("Degraded", "متدهورة") : t("Outage", "انقطاع");

  return (
    <div className="min-h-screen bg-background">
      {/* ===== NAVBAR ===== */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-xl shadow-sm" : "bg-transparent"}`}>
        {/* Top gradient line */}
        <div className="h-1 gradient-primary" />
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <img src={awasrLogo} alt="Awasr" className="h-9 w-auto object-contain" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border">
              <Global size={15} />
              {language === "en" ? "عربي" : "EN"}
            </button>
            <Link to="/login" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground gradient-primary hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
              {t("My Awasr", "حسابي")}
              <ArrowRight size={14} className="rtl:rotate-180" />
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
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-start px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-primary-foreground gradient-primary mt-2">
              {t("My Awasr Login", "تسجيل الدخول")}
            </Link>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        {/* Animated mesh overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px, 30px 30px" }} />
        {/* Glow orbs */}
        <div className="absolute top-20 start-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 end-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white mb-8">
                <Flash size={16} className="text-warning" />
                {t("Oman's Award-Winning Fiber Provider", "مزود الألياف الحائز على جوائز في عُمان")}
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] text-white mb-6">
                {t("Experience", "استمتع بأسرع")}<br />
                <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                  {t("Better Internet", "إنترنت في عُمان")}
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-lg md:text-xl text-white/75 max-w-xl mb-10 leading-relaxed">
                {t(
                  "Blazing-fast fiber speeds up to 1 Gbps with unlimited data, SafeNet security, and Shahid VIP Lite — all included.",
                  "سرعات ألياف فائقة تصل إلى 1 جيجا مع بيانات غير محدودة وحماية سيف نت وشاهد VIP لايت — كل ذلك مشمول."
                )}
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <button onClick={() => scrollTo("#plans")} className="group px-7 py-3.5 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-all shadow-lg shadow-black/10 flex items-center gap-2">
                  {t("Browse Plans", "تصفح الباقات")}
                  <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <Link to="/login" className="px-7 py-3.5 rounded-xl border-2 border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-all">
                  {t("My Awasr Login", "تسجيل الدخول")}
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Stats strip */}
          <FadeIn delay={400}>
            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
                  <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-white/60 mt-1">{t(s.en, s.ar)}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== PLANS ===== */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <FadeIn>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <StatusUp size={14} />
              {t("FIBERNET HOME", "فايبرنت هوم")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("Choose Your Plan", "اختر باقتك")}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("Select the perfect speed for your home. All plans include unlimited data with no caps.", "اختر السرعة المثالية لمنزلك. جميع الباقات تشمل بيانات غير محدودة بدون حدود.")}</p>
          </div>
        </FadeIn>

        {/* Contract term toggle */}
        <FadeIn>
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center bg-muted rounded-xl p-1">
              <button
                onClick={() => setContractTerm("1")}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${contractTerm === "1" ? "bg-card card-shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t("1 Year", "سنة واحدة")}
              </button>
              <button
                onClick={() => setContractTerm("2")}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative ${contractTerm === "2" ? "bg-card card-shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t("2 Years", "سنتان")}
                <span className="absolute -top-2 -end-2 px-1.5 py-0.5 rounded-full gradient-primary text-white text-[10px] font-semibold">{t("Best", "أفضل")}</span>
              </button>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {internetPlans.map((plan, i) => {
            const isPopular = plan.id === "PLN-04";
            const isUltra = plan.id === "PLN-07";
            return (
              <FadeIn key={plan.id} delay={i * 60}>
                <div className={`relative rounded-2xl bg-card border-0 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1.5 h-full flex flex-col overflow-hidden ${isPopular ? "ring-2 ring-primary" : ""} ${isUltra ? "ring-2 ring-secondary" : ""}`}>
                  {/* Top accent */}
                  {(isPopular || isUltra) && (
                    <div className={`h-1 w-full ${isPopular ? "gradient-primary" : "bg-secondary"}`} />
                  )}

                  {isPopular && (
                    <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full gradient-primary text-white text-[10px] font-semibold flex items-center gap-1">
                      <Crown size={10} />
                      {t("Popular", "الأكثر شعبية")}
                    </div>
                  )}
                  {isUltra && (
                    <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-secondary text-white text-[10px] font-semibold flex items-center gap-1">
                      <Flash size={10} />
                      {t("Ultra", "فائق")}
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">{t(plan.name, plan.nameAr)}</p>
                    
                    {/* Speed prominently displayed */}
                    <div className="mb-1">
                      <span className="text-4xl font-bold tracking-tight">{plan.speed.replace(" Mbps", "").replace(" Gbps", "")}</span>
                      <span className="text-sm font-medium text-muted-foreground ms-1">{plan.speed.includes("Gbps") ? "Gbps" : "Mbps"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
                      <ArrowUp size={12} className="text-secondary" />
                      <span>{plan.uploadSpeed} {t("Upload", "رفع")}</span>
                    </div>

                    {/* Price */}
                    <div className="bg-muted/50 rounded-xl px-4 py-3 mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <OmrSymbol className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">/{t("mo", "شهر")}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {t(`Total with VAT: ${plan.priceWithVat.toFixed(3)}`, `الإجمالي مع الضريبة: ${plan.priceWithVat.toFixed(3)}`)} <OmrSymbol size={8} className="text-muted-foreground" />
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-xs">
                          <TickCircle size={14} className={`shrink-0 mt-0.5 ${f.includes("not") ? "text-muted-foreground/40" : "text-success"}`} variant={f.includes("not") ? "Linear" : "Bold"} />
                          <span className={f.includes("not") ? "text-muted-foreground/60 line-through" : "text-muted-foreground"}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/login"
                      className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                        isPopular
                          ? "gradient-primary text-white hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
                          : isUltra
                          ? "bg-secondary text-white hover:opacity-90 hover:shadow-lg hover:shadow-secondary/20"
                          : "bg-muted hover:bg-muted/70 text-foreground"
                      }`}
                    >
                      {t("Subscribe Now", "اشترك الآن")}
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
        <FadeIn>
          <p className="text-center text-xs text-muted-foreground mt-8">{t("All prices include 5% VAT. Installation fee: 15 OMR (1-year) or 10 OMR (2-year contract).", "جميع الأسعار تشمل 5% ضريبة القيمة المضافة. رسوم التركيب: 15 ر.ع (سنة) أو 10 ر.ع (عقد سنتين).")}</p>
        </FadeIn>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/40" />
        <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4">
                <Monitor size={14} />
                {t("WHY AWASR", "لماذا أوامر")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("More Than Just Fast Internet", "أكثر من مجرد إنترنت سريع")}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{t("A complete connected home experience with security, entertainment, and education built in.", "تجربة منزل متصل متكاملة مع حماية وترفيه وتعليم مدمج.")}</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="group bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 h-full border border-transparent hover:border-primary/10">
                  <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300">
                    <f.icon size={24} variant="Bold" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t(f.en, f.ar)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descEn, f.descAr)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COVERAGE ===== */}
      <section id="coverage" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold mb-4">
                <Wifi size={14} />
                {t("BARQI COVERAGE", "تغطية برقي")}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("Available Across Oman", "متوفرة في جميع أنحاء عُمان")}</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{t("Our fiber network covers major cities and is rapidly expanding. Check if your area is covered and subscribe today.", "تغطي شبكة الألياف لدينا المدن الرئيسية وتتوسع بسرعة. تحقق مما إذا كانت منطقتك مغطاة واشترك اليوم.")}</p>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
                {t("Check Availability", "تحقق من التوفر")}
                <ArrowRight size={16} className="rtl:rotate-180" />
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="grid grid-cols-2 gap-3">
              {networkStatus.map((r, i) => (
                <div key={i} className="bg-card rounded-xl p-4 card-shadow hover:card-shadow-hover transition-all duration-200 flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${statusColor(r.status)} shrink-0`}>
                    {r.status === "operational" && <div className={`h-3 w-3 rounded-full ${statusColor(r.status)} animate-ping opacity-30`} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{t(r.region, r.regionAr)}</p>
                    <p className="text-[10px] text-muted-foreground">{statusLabel(r.status)}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "50px 50px, 35px 35px" }} />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center text-white">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t("Ready to Experience Better?", "جاهز لتجربة أفضل؟")}</h2>
            <p className="text-white/75 mb-8 max-w-md mx-auto text-lg">{t("Join thousands of Omani homes enjoying ultra-fast fiber internet with Awasr.", "انضم لآلاف المنازل العُمانية التي تستمتع بإنترنت ألياف فائق السرعة مع أوامر.")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => scrollTo("#plans")} className="group px-8 py-4 rounded-xl bg-white text-foreground font-bold text-sm hover:bg-white/95 transition-all shadow-lg shadow-black/10 flex items-center gap-2">
                {t("View Plans & Subscribe", "شاهد الباقات واشترك")}
                <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <a href="tel:80001000" className="px-8 py-4 rounded-xl border-2 border-white/25 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                <Call size={16} />
                80001000
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <img src={awasrLogo} alt="Awasr" className="h-10 w-auto object-contain mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t("Oman's fastest fiber internet provider. Experience better connectivity for your home.", "أسرع مزود إنترنت ألياف في عُمان. استمتع باتصال أفضل لمنزلك.")}</p>
            </div>
            {/* Quick links */}
            <div>
              <h4 className="font-bold text-sm mb-4">{t("Quick Links", "روابط سريعة")}</h4>
              <div className="space-y-2.5">
                {[
                  { fn: () => scrollTo("#plans"), en: "Plans & Pricing", ar: "الباقات والأسعار" },
                  { fn: () => scrollTo("#features"), en: "Features", ar: "المميزات" },
                  { fn: () => scrollTo("#coverage"), en: "Barqi Coverage", ar: "تغطية برقي" },
                ].map((l, i) => (
                  <button key={i} onClick={l.fn} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{t(l.en, l.ar)}</button>
                ))}
                <Link to="/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{t("My Awasr Portal", "بوابة حسابي")}</Link>
              </div>
            </div>
            {/* Support */}
            <div>
              <h4 className="font-bold text-sm mb-4">{t("Support", "الدعم")}</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Call size={15} className="text-primary shrink-0" />
                  <span>80001000</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MessageText1 size={15} className="text-primary shrink-0" />
                  <span>{t("WhatsApp Support", "دعم واتساب")}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Timer1 size={15} className="text-primary shrink-0" />
                  <span>{t("Available 24/7", "متاح على مدار الساعة")}</span>
                </div>
              </div>
            </div>
            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm mb-4">{t("Legal", "قانوني")}</h4>
              <div className="space-y-2.5">
                <p className="text-sm text-muted-foreground">{t("Terms & Conditions", "الشروط والأحكام")}</p>
                <p className="text-sm text-muted-foreground">{t("Privacy Policy", "سياسة الخصوصية")}</p>
                <p className="text-sm text-muted-foreground">{t("Fair Usage Policy", "سياسة الاستخدام العادل")}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Awasr. {t("All rights reserved.", "جميع الحقوق محفوظة.")}</p>
            <p className="text-xs text-muted-foreground">{t("Licensed by TRA Oman", "مرخصة من هيئة تنظيم الاتصالات")}</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatbotWidget />
    </div>
  );
}
