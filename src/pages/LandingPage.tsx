import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Global, HambergerMenu, CloseCircle, ShieldTick,
  VideoPlay, Book1, Headphone, Wifi, ArrowRight, Call, MessageText1,
  Timer1, TickCircle, Flash, Data, Crown,
  ArrowUp, ArrowUp2, Map1, Star1
} from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { plans, networkStatus } from "@/data/mockData";
import OmrSymbol from "@/components/OmrSymbol";
import ChatbotWidget from "@/components/ChatbotWidget";
import awasrLogo from "@/assets/awasr-logo.png";
import heroImage from "@/assets/hero-omani-family.jpg";

const internetPlans = plans.filter((p) => p.type === "internet");

const features = [
  { icon: Data, en: "Unlimited Data", ar: "بيانات غير محدودة", descEn: "Stream, game, and work without limits. No caps, no throttling.", descAr: "شاهد، العب، واعمل بدون حدود. بدون سقف أو تقييد." },
  { icon: ShieldTick, en: "SafeNet Protection", ar: "حماية سيف نت", descEn: "Keep your family safe online with built-in malware blocking and parental controls.", descAr: "حافظ على أمان عائلتك على الإنترنت مع حجب البرمجيات الخبيثة والرقابة الأبوية." },
  { icon: VideoPlay, en: "Shahid VIP Lite", ar: "شاهد VIP لايت", descEn: "Enjoy Arabic & international movies, series, and 150+ live channels included.", descAr: "استمتع بأفلام ومسلسلات عربية ودولية وأكثر من 150 قناة مباشرة." },
  { icon: Book1, en: "Ashal Education", ar: "أسهل تعليم", descEn: "Free curriculum-aligned learning platform to help your children succeed.", descAr: "منصة تعليمية مجانية متوافقة مع المنهج لمساعدة أطفالك على النجاح." },
  { icon: Headphone, en: "24/7 Support", ar: "دعم على مدار الساعة", descEn: "Our Omani support team is always here. Call 80001000 or WhatsApp anytime.", descAr: "فريق الدعم العُماني دائماً هنا. اتصل بـ 80001000 أو واتساب في أي وقت." },
  { icon: Map1, en: "Barqi Fiber Coverage", ar: "تغطية ألياف برقي", descEn: "Expanding across Muscat, Sohar, Salalah, Nizwa and more cities every month.", descAr: "نتوسع عبر مسقط، صحار، صلالة، نزوى والمزيد من المدن كل شهر." },
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
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
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
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/98 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16 md:h-[72px]">
          <Link to="/" className="shrink-0">
            <img src={awasrLogo} alt="Awasr" className="h-8 md:h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
                {t(l.en, l.ar)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button onClick={toggleLanguage} className="px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Global size={14} className="inline me-1.5" />
              {language === "en" ? "عربي" : "EN"}
            </button>
            <Link to="/login" className="hidden md:inline-flex px-5 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground gradient-primary hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
              {t("My Awasr", "حسابي")}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              {menuOpen ? <CloseCircle size={22} /> : <HambergerMenu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card/98 backdrop-blur-xl border-t border-border px-5 pb-5 pt-2 animate-fade-in">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-start px-4 py-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors">
                {t(l.en, l.ar)}
              </button>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center px-5 py-3 rounded-xl text-sm font-semibold text-primary-foreground gradient-primary mt-3">
              {t("Login", "الدخول")}
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(230,25%,8%)/0.92] via-[hsl(230,25%,8%)/0.75] to-[hsl(230,25%,8%)/0.4]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,25%,8%)/0.5] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40">
          <div className="max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <Wifi size={13} className="text-secondary" />
                <span className="text-white/80 text-xs font-medium tracking-wide">
                  {t("FIBER INTERNET • SULTANATE OF OMAN", "إنترنت ألياف • سلطنة عُمان")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-bold leading-[1.08] text-white mb-6 tracking-tight">
                {language === "en" ? (
                  <>Internet built for<br />your <span className="bg-gradient-to-r from-[hsl(316,70%,65%)] to-[hsl(202,90%,60%)] bg-clip-text text-transparent">Omani home</span>.</>
                ) : (
                  <>إنترنت مصمّم<br /><span className="bg-gradient-to-r from-[hsl(316,70%,65%)] to-[hsl(202,90%,60%)] bg-clip-text text-transparent">لبيتك العُماني</span>.</>
                )}
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-base md:text-lg text-white/60 max-w-lg mb-8 leading-relaxed">
                {t(
                  "Fiber speeds up to 1 Gbps. Unlimited data. Shahid VIP included. From 27 OMR/month — connecting families across the Sultanate.",
                  "سرعات ألياف تصل إلى 1 جيجا. بيانات غير محدودة. شاهد VIP مشمول. من 27 ر.ع/شهرياً — نربط العائلات في جميع أنحاء السلطنة."
                )}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => scrollTo("#plans")} className="group px-7 py-3.5 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-all shadow-lg shadow-black/10 flex items-center gap-2.5">
                  {t("View plans", "شاهد الباقات")}
                  <ArrowRight size={15} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <Link to="/login" className="px-7 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 backdrop-blur-sm transition-all">
                  {t("Sign in", "تسجيل الدخول")}
                </Link>
              </div>
            </Reveal>

            {/* Trust badges */}
            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-5 md:gap-8 mt-16 pt-8 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">1 Gbps</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{t("Max speed", "أقصى سرعة")}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">8+</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{t("Cities covered", "مدينة مغطاة")}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star1 key={i} size={14} className="text-warning" variant="Bold" />)}
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">{t("Customer rated", "تقييم العملاء")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="plans" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{t("Choose your speed", "اختر سرعتك")}</p>
              <h2 className="text-2xl md:text-[2rem] font-bold">{t("Fibernet Home Plans", "باقات فايبرنت المنزلية")}</h2>
              <p className="text-muted-foreground mt-2 text-sm max-w-md">{t("All plans include unlimited data, Shahid VIP Lite, and SafeNet. No hidden fees.", "جميع الباقات تشمل بيانات غير محدودة، شاهد VIP لايت، وسيف نت. بدون رسوم خفية.")}</p>
            </div>
            <div className="inline-flex items-center bg-muted rounded-xl p-1 shrink-0">
              <button
                onClick={() => setContractTerm("1")}
                className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all ${contractTerm === "1" ? "bg-card card-shadow text-foreground" : "text-muted-foreground"}`}
              >
                {t("1 Year", "سنة")}
              </button>
              <button
                onClick={() => setContractTerm("2")}
                className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all ${contractTerm === "2" ? "bg-card card-shadow text-foreground" : "text-muted-foreground"}`}
              >
                {t("2 Years", "سنتان")} <span className="text-primary ms-1">— {t("save more", "وفّر أكثر")}</span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {internetPlans.map((plan, idx) => {
            const isPopular = plan.id === "PLN-04";
            const isTop = plan.id === "PLN-07";
            return (
              <Reveal key={plan.id} delay={idx * 60}>
                <div className={`group relative rounded-2xl bg-card hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col overflow-hidden ${isPopular ? "ring-2 ring-primary card-shadow-hover" : isTop ? "ring-2 ring-secondary card-shadow-hover" : "card-shadow hover:card-shadow-hover"}`}>
                  {/* Top accent bar */}
                  {(isPopular || isTop) && (
                    <div className={`h-1 w-full ${isPopular ? "gradient-primary" : "bg-secondary"}`} />
                  )}
                  
                  {isPopular && (
                    <div className="absolute top-3 end-3 px-2.5 py-1 rounded-lg gradient-primary text-white text-[10px] font-semibold flex items-center gap-1">
                      <Crown size={10} />{t("Popular", "الأشهر")}
                    </div>
                  )}
                  {isTop && (
                    <div className="absolute top-3 end-3 px-2.5 py-1 rounded-lg bg-secondary text-white text-[10px] font-semibold flex items-center gap-1">
                      <Flash size={10} />{t("Fastest", "الأسرع")}
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">{t(plan.name, plan.nameAr)}</p>

                    {/* Speed — hero of the card */}
                    <div className="mb-1">
                      <span className="text-4xl font-bold tabular-nums tracking-tight">{plan.speed.replace(" Mbps", "").replace(" Gbps", "")}</span>
                      <span className="text-sm font-medium text-muted-foreground ms-1.5">{plan.speed.includes("Gbps") ? "Gbps" : "Mbps"}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-5 flex items-center gap-1.5">
                      <ArrowUp size={10} className="text-secondary" />
                      {plan.uploadSpeed} {t("upload", "رفع")}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5 mb-5 pb-5 border-b border-border">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <OmrSymbol className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">/{t("mo", "شهر")}</span>
                      <span className="text-[10px] text-muted-foreground ms-auto">{t("incl. VAT", "شامل الضريبة")}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                          <TickCircle size={13} className="text-success shrink-0 mt-0.5" variant="Bold" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/login"
                      className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isPopular
                          ? "gradient-primary text-white hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
                          : isTop
                          ? "bg-secondary text-white hover:opacity-90 hover:shadow-lg hover:shadow-secondary/20"
                          : "bg-muted text-foreground hover:bg-muted/70 group-hover:bg-primary group-hover:text-primary-foreground"
                      }`}
                    >
                      {t("Subscribe now", "اشترك الآن")}
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground mt-8 leading-relaxed">{t("Prices include 5% VAT. Installation: 15 OMR (1yr) or 10 OMR (2yr). Free router included with all plans.", "الأسعار شاملة 5% ضريبة. التركيب: 15 ر.ع (سنة) أو 10 ر.ع (سنتين). راوتر مجاني مع جميع الباقات.")}</p>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
          <Reveal>
            <div className="max-w-xl mb-12">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{t("Included with every plan", "مشمول مع كل باقة")}</p>
              <h2 className="text-2xl md:text-[2rem] font-bold mb-3">{t("More than just fast internet", "أكثر من مجرد إنترنت سريع")}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("Every Fibernet Home plan comes packed with entertainment, security, and education for the whole family.", "كل باقة فايبرنت هوم تأتي مليئة بالترفيه والأمان والتعليم لجميع أفراد العائلة.")}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 h-full group">
                  <div className="h-12 w-12 rounded-xl bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <f.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-[15px] mb-2">{t(f.en, f.ar)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descEn, f.descAr)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section id="coverage" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <Reveal>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{t("Network status", "حالة الشبكة")}</p>
              <h2 className="text-2xl md:text-[2rem] font-bold mb-4">{t("Connecting the Sultanate", "نربط السلطنة")}</h2>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">{t("Our Barqi fiber network is live across Oman's major cities and expanding every month. Check if your area is covered.", "شبكة ألياف برقي متاحة عبر المدن الرئيسية في عُمان وتتوسع كل شهر. تحقق إذا كانت منطقتك مغطاة.")}</p>
              <Link to="/login" className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20">
                {t("Check your address", "تحقق من عنوانك")}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </Reveal>
          </div>
          <div className="lg:col-span-3">
            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-3">
                {networkStatus.map((r, i) => (
                  <div key={i} className="bg-card rounded-xl p-4 card-shadow hover:card-shadow-hover transition-all duration-200 flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${statusBg(r.status)} ${r.status === "operational" ? "animate-pulse" : ""}`} />
                    <span className="text-sm font-medium flex-1 truncate">{t(r.region, r.regionAr)}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${r.status === "operational" ? "text-success" : r.status === "degraded" ? "text-warning" : "text-destructive"}`}>{statusText(r.status)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("Ready to join Awasr?", "مستعد للانضمام إلى أوامر؟")}</h2>
            <p className="text-white/60 text-sm md:text-base max-w-md mx-auto mb-8">{t("Pick a plan and we'll have you connected in days. Free router, free SafeNet, unlimited data.", "اختر باقة وسنوصلك خلال أيام. راوتر مجاني، سيف نت مجاني، بيانات غير محدودة.")}</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => scrollTo("#plans")} className="group px-8 py-3.5 rounded-xl bg-white text-foreground font-semibold text-sm hover:bg-white/95 transition-all shadow-lg shadow-black/10 flex items-center gap-2.5">
                {t("Browse plans", "تصفح الباقات")}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </button>
              <a href="tel:80001000" className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2.5">
                <Call size={14} /> 80001000
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <img src={awasrLogo} alt="Awasr" className="h-8 w-auto object-contain mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">{t("Bringing fast, reliable fiber internet to homes across the Sultanate of Oman.", "نوفر إنترنت ألياف سريع وموثوق للمنازل في جميع أنحاء سلطنة عُمان.")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">{t("Quick Links", "روابط سريعة")}</h4>
              <div className="space-y-3">
                <button onClick={() => scrollTo("#plans")} className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("Plans & Pricing", "الباقات والأسعار")}</button>
                <button onClick={() => scrollTo("#features")} className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("Features", "المميزات")}</button>
                <button onClick={() => scrollTo("#coverage")} className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("Coverage Map", "خريطة التغطية")}</button>
                <Link to="/login" className="block text-sm text-foreground/70 hover:text-primary transition-colors">{t("My Awasr", "حسابي")}</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">{t("Get Help", "احصل على المساعدة")}</h4>
              <div className="space-y-3 text-sm">
                <a href="tel:80001000" className="flex items-center gap-2.5 text-foreground/70 hover:text-primary transition-colors"><Call size={14} className="text-primary" /> 80001000</a>
                <div className="flex items-center gap-2.5 text-foreground/70"><MessageText1 size={14} className="text-primary" /> WhatsApp</div>
                <div className="flex items-center gap-2.5 text-foreground/70"><Timer1 size={14} className="text-primary" /> {t("24/7 available", "متاح على مدار الساعة")}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-4">{t("Legal", "قانوني")}</h4>
              <div className="space-y-3 text-sm text-foreground/70">
                <p className="hover:text-primary transition-colors cursor-pointer">{t("Terms & Conditions", "الشروط والأحكام")}</p>
                <p className="hover:text-primary transition-colors cursor-pointer">{t("Privacy Policy", "سياسة الخصوصية")}</p>
                <p className="hover:text-primary transition-colors cursor-pointer">{t("Fair Usage Policy", "سياسة الاستخدام العادل")}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Awasr — {t("A subsidiary of Oman Telecommunications Company", "شركة تابعة لشركة الاتصالات العُمانية")}</span>
            <span>{t("Licensed by TRA, Sultanate of Oman", "مرخصة من هيئة تنظيم الاتصالات، سلطنة عُمان")}</span>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed z-40 bottom-20 md:bottom-8 end-5 md:end-8 h-11 w-11 rounded-full bg-card card-shadow-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:card-shadow-hover transition-all duration-300 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <ArrowUp2 size={18} />
      </button>

      <ChatbotWidget />
    </div>
  );
}
