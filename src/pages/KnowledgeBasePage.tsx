import { useState } from "react";
import { SearchNormal, Wifi, Monitor, Card as CardIcon, Setting, User, Warning2, Like1, Dislike, ArrowLeft2, Star1, Book } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { knowledgeBase } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = { Wifi, Tv: Monitor, CreditCard: CardIcon, Wrench: Setting, User, AlertTriangle: Warning2 };

// Rich article content for each article
const articleContent: Record<string, { en: { intro: string; steps: string[]; tip?: string; conclusion: string }; ar: { intro: string; steps: string[]; tip?: string; conclusion: string } }> = {
  "KB-001": {
    en: {
      intro: "If your internet connection is slow or unstable, restarting your router can often resolve the issue. Follow these steps carefully.",
      steps: [
        "Locate your Awasr router — it's usually near the fiber optic wall socket.",
        "Unplug the power cable from the back of the router.",
        "Wait for 30 seconds. This allows the device to fully discharge.",
        "Plug the power cable back in firmly.",
        "Wait 2-3 minutes for all indicator lights to stabilize (Power, Internet, Wi-Fi should be solid green).",
        "Test your connection by opening a website or running a speed test.",
      ],
      tip: "If you restart your router more than 3 times a week, there may be an underlying issue. Please contact support.",
      conclusion: "Your internet connection should now be restored. If the problem persists, please raise a support ticket.",
    },
    ar: {
      intro: "إذا كان اتصالك بالإنترنت بطيئاً أو غير مستقر، فإن إعادة تشغيل جهاز التوجيه يمكن أن يحل المشكلة. اتبع هذه الخطوات بعناية.",
      steps: [
        "حدد موقع جهاز التوجيه أوامر — عادة ما يكون بالقرب من مقبس الألياف الضوئية على الحائط.",
        "افصل كابل الطاقة من الجزء الخلفي لجهاز التوجيه.",
        "انتظر 30 ثانية. هذا يسمح للجهاز بالتفريغ الكامل.",
        "أعد توصيل كابل الطاقة بإحكام.",
        "انتظر 2-3 دقائق حتى تستقر جميع مصابيح المؤشر (الطاقة، الإنترنت، الواي فاي يجب أن تكون خضراء ثابتة).",
        "اختبر اتصالك عن طريق فتح موقع ويب أو إجراء اختبار سرعة.",
      ],
      tip: "إذا كنت تعيد تشغيل جهاز التوجيه أكثر من 3 مرات في الأسبوع، فقد تكون هناك مشكلة أساسية. يرجى الاتصال بالدعم.",
      conclusion: "يجب أن يكون اتصالك بالإنترنت قد استعاد. إذا استمرت المشكلة، يرجى إنشاء تذكرة دعم.",
    },
  },
  "KB-002": {
    en: {
      intro: "Internet speed can vary based on several factors. Understanding these will help you get the best performance from your connection.",
      steps: [
        "Use a wired (Ethernet) connection for the most accurate speed test results.",
        "Close all background applications and downloads before testing.",
        "Visit speedtest.net or use the Awasr app to run a speed test.",
        "Compare results with your subscribed plan speed.",
        "If speeds are consistently below 80% of your plan speed, contact support.",
      ],
      tip: "Wi-Fi speeds are typically 30-50% lower than wired speeds due to signal interference. This is normal.",
      conclusion: "For the best experience, use 5GHz Wi-Fi band for nearby devices and 2.4GHz for devices further from the router.",
    },
    ar: {
      intro: "يمكن أن تتفاوت سرعة الإنترنت بناءً على عدة عوامل. فهم هذه العوامل سيساعدك في الحصول على أفضل أداء من اتصالك.",
      steps: [
        "استخدم اتصالاً سلكياً (إيثرنت) للحصول على نتائج اختبار سرعة أكثر دقة.",
        "أغلق جميع التطبيقات والتنزيلات في الخلفية قبل الاختبار.",
        "قم بزيارة speedtest.net أو استخدم تطبيق أوامر لإجراء اختبار سرعة.",
        "قارن النتائج بسرعة الباقة المشترك بها.",
        "إذا كانت السرعات أقل من 80% من سرعة باقتك باستمرار، اتصل بالدعم.",
      ],
      tip: "سرعات الواي فاي عادة ما تكون أقل بنسبة 30-50% من السرعات السلكية بسبب تداخل الإشارة. هذا طبيعي.",
      conclusion: "للحصول على أفضل تجربة، استخدم نطاق 5 جيجاهرتز للأجهزة القريبة و2.4 جيجاهرتز للأجهزة البعيدة عن الراوتر.",
    },
  },
  "KB-003": {
    en: {
      intro: "Awasr offers multiple convenient payment options. Here's how to pay your bill online.",
      steps: [
        "Log in to your Awasr Self-Care Portal.",
        "Navigate to the Billing & Payments page.",
        "View your outstanding balance and select 'Pay Now'.",
        "Choose your preferred payment method (Visa, Omannet, Apple Pay, Samsung Pay).",
        "Enter your payment details and confirm.",
        "You'll receive a payment receipt and confirmation SMS.",
      ],
      conclusion: "You can also set up Auto-Pay to automatically pay your bills each month without manual intervention.",
    },
    ar: {
      intro: "تقدم أوامر خيارات دفع متعددة ومريحة. إليك كيفية دفع فاتورتك عبر الإنترنت.",
      steps: [
        "سجل الدخول إلى بوابة أوامر للخدمة الذاتية.",
        "انتقل إلى صفحة الفواتير والمدفوعات.",
        "اعرض رصيدك المستحق واختر 'ادفع الآن'.",
        "اختر طريقة الدفع المفضلة (فيزا، عمان نت، آبل باي، سامسونج باي).",
        "أدخل بيانات الدفع وأكد.",
        "ستتلقى إيصال دفع ورسالة تأكيد.",
      ],
      conclusion: "يمكنك أيضاً إعداد الدفع التلقائي لدفع فواتيرك تلقائياً كل شهر دون تدخل يدوي.",
    },
  },
};

// Default content for articles without rich content
const defaultContent = {
  en: {
    intro: "This guide provides detailed information to help you resolve common issues.",
    steps: [
      "Check that all connections are secure and properly plugged in.",
      "Restart any relevant equipment by unplugging for 30 seconds.",
      "Wait for the device to fully restart and stabilize.",
      "Test the service again to see if the issue is resolved.",
      "If the problem persists, contact our support team for assistance.",
    ],
    conclusion: "Our support team is available 24/7 to help you with any issues.",
  },
  ar: {
    intro: "يقدم هذا الدليل معلومات تفصيلية لمساعدتك في حل المشاكل الشائعة.",
    steps: [
      "تأكد من أن جميع التوصيلات آمنة وموصولة بشكل صحيح.",
      "أعد تشغيل أي معدات ذات صلة عن طريق فصلها لمدة 30 ثانية.",
      "انتظر حتى يعيد الجهاز التشغيل بالكامل ويستقر.",
      "اختبر الخدمة مرة أخرى لمعرفة ما إذا تم حل المشكلة.",
      "إذا استمرت المشكلة، اتصل بفريق الدعم للمساعدة.",
    ],
    conclusion: "فريق الدعم لدينا متاح على مدار الساعة لمساعدتك في أي مشاكل.",
  },
};

const popularArticleIds = ["KB-001", "KB-005", "KB-003"];

export default function KnowledgeBasePage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<typeof knowledgeBase.articles[0] | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "yes" | "no">>({});

  const filteredArticles = knowledgeBase.articles.filter((a) => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.summary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const relatedArticles = selectedArticle
    ? knowledgeBase.articles.filter((a) => a.category === selectedArticle.category && a.id !== selectedArticle.id)
    : [];

  const highlightMatch = (text: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-warning/30 text-foreground rounded px-0.5">{part}</mark> : part
    );
  };

  const handleFeedback = (articleId: string, helpful: "yes" | "no") => {
    setFeedbackGiven((prev) => ({ ...prev, [articleId]: helpful }));
    toast({
      title: helpful === "yes" ? t("Thank you!", "شكراً!") : t("We'll improve this article", "سنحسن هذا المقال"),
      description: helpful === "yes"
        ? t("Glad this article was helpful.", "سعداء أن هذا المقال كان مفيداً.")
        : t("Your feedback helps us improve.", "ملاحظاتك تساعدنا على التحسين."),
    });
  };

  // Article detail view
  if (selectedArticle) {
    const content = articleContent[selectedArticle.id] || defaultContent;
    const lang = language === "ar" ? content.ar : content.en;
    const hasFeedback = feedbackGiven[selectedArticle.id];

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
          <ArrowLeft2 size={16} className="me-1 rtl:rotate-180" />{t("Back", "رجوع")}
        </Button>

        <div>
          <Badge variant="secondary" className="text-xs mb-2">
            {t(
              knowledgeBase.categories.find((c) => c.id === selectedArticle.category)?.name || "",
              knowledgeBase.categories.find((c) => c.id === selectedArticle.category)?.nameAr || ""
            )}
          </Badge>
          <h1 className="text-xl font-bold">{t(selectedArticle.title, selectedArticle.titleAr)}</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-5">
            {/* Intro */}
            <p className="text-sm text-muted-foreground leading-relaxed">{lang.intro}</p>

            {/* Steps */}
            <div>
              <h3 className="text-sm font-semibold mb-3">{t("Steps", "الخطوات")}</h3>
              <ol className="space-y-3">
                {lang.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold shrink-0">{i + 1}</span>
                    <p className="text-sm leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tip */}
            {"tip" in lang && lang.tip && (
              <Card className="border-info/20 bg-info/5">
                <CardContent className="p-3 flex gap-2 items-start">
                  <Star1 size={16} className="text-info shrink-0 mt-0.5" />
                  <p className="text-sm text-info">{"tip" in lang ? (lang as any).tip : ""}</p>
                </CardContent>
              </Card>
            )}

            {/* Conclusion */}
            <p className="text-sm leading-relaxed">{lang.conclusion}</p>

            <Separator />

            {/* Feedback */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t("Was this article helpful?", "هل كان هذا المقال مفيداً؟")}</p>
              {hasFeedback ? (
                <p className="text-sm text-success">{t("✓ Thank you for your feedback!", "✓ شكراً لملاحظاتك!")}</p>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleFeedback(selectedArticle.id, "yes")}>
                    <Like1 size={16} className="me-1" />{t("Yes, helpful", "نعم، مفيد")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFeedback(selectedArticle.id, "no")}>
                    <Dislike size={16} className="me-1" />{t("No, not helpful", "لا، غير مفيد")}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3">{t("Related Articles", "مقالات ذات صلة")}</h3>
            <div className="space-y-2">
              {relatedArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedArticle(article)}>
                  <CardContent className="p-4">
                    <p className="font-medium text-sm">{t(article.title, article.titleAr)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t(article.summary, article.summaryAr)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Knowledge Base", "قاعدة المعرفة")}</h1>

      {/* Search */}
      <div className="relative">
        <SearchNormal size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search articles...", "ابحث في المقالات...")} className="ps-9" />
      </div>

      {/* Search results */}
      {search.trim() && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{filteredArticles.length} {t("results found", "نتائج")}</p>
          {filteredArticles.map((article) => (
            <Card key={article.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedArticle(article)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {t(
                      knowledgeBase.categories.find((c) => c.id === article.category)?.name || "",
                      knowledgeBase.categories.find((c) => c.id === article.category)?.nameAr || ""
                    )}
                  </Badge>
                </div>
                <p className="font-medium text-sm">{highlightMatch(t(article.title, article.titleAr))}</p>
                <p className="text-xs text-muted-foreground mt-1">{highlightMatch(t(article.summary, article.summaryAr))}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Popular articles */}
      {!search.trim() && !selectedCategory && (
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Star1 size={16} className="text-warning" />{t("Popular Articles", "المقالات الشائعة")}
          </h2>
          <div className="space-y-2">
            {knowledgeBase.articles
              .filter((a) => popularArticleIds.includes(a.id))
              .map((article) => (
                <Card key={article.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedArticle(article)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                      <Book size={16} className="text-warning" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{t(article.title, article.titleAr)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{t(article.summary, article.summaryAr)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {!search.trim() && !selectedCategory && (
        <div>
          <h2 className="text-base font-semibold mb-3">{t("Browse by Category", "تصفح حسب الفئة")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {knowledgeBase.categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Warning2;
              return (
                <Card key={cat.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedCategory(cat.id)}>
                  <CardContent className="p-4 text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium">{t(cat.name, cat.nameAr)}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} {t("articles", "مقال")}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Category articles list */}
      {selectedCategory && !search.trim() && (
        <>
          <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft2 size={16} className="me-1 rtl:rotate-180" />{t("All Categories", "جميع الفئات")}
          </Button>
          <h2 className="text-base font-semibold">
            {t(
              knowledgeBase.categories.find((c) => c.id === selectedCategory)?.name || "",
              knowledgeBase.categories.find((c) => c.id === selectedCategory)?.nameAr || ""
            )}
          </h2>
          <div className="space-y-2">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedArticle(article)}>
                <CardContent className="p-4">
                  <p className="font-medium text-sm">{t(article.title, article.titleAr)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t(article.summary, article.summaryAr)}</p>
                </CardContent>
              </Card>
            ))}
            {filteredArticles.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">{t("No articles found", "لا توجد مقالات")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}