import { useState } from "react";
import { Search, Wifi, Tv, CreditCard, Wrench, User, AlertTriangle, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { knowledgeBase } from "@/data/mockData";

const iconMap: Record<string, any> = { Wifi, Tv, CreditCard, Wrench, User, AlertTriangle };

export default function KnowledgeBasePage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<typeof knowledgeBase.articles[0] | null>(null);

  const filteredArticles = knowledgeBase.articles.filter((a) => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selectedArticle) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" />{t("Back", "رجوع")}
        </Button>
        <h1 className="text-xl font-bold">{t(selectedArticle.title, selectedArticle.titleAr)}</h1>
        <Card><CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-4">{t(selectedArticle.summary, selectedArticle.summaryAr)}</p>
          <div className="prose prose-sm max-w-none text-sm space-y-3">
            <p>{t("This is a detailed article providing step-by-step instructions and helpful tips.", "هذا مقال مفصل يقدم تعليمات خطوة بخطوة ونصائح مفيدة.")}</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>{t("First, check your equipment is properly connected.", "أولاً، تأكد من أن جهازك متصل بشكل صحيح.")}</li>
              <li>{t("Restart your router by unplugging for 30 seconds.", "أعد تشغيل جهاز التوجيه عن طريق فصله لمدة 30 ثانية.")}</li>
              <li>{t("Wait for all lights to stabilize.", "انتظر حتى تستقر جميع الأضواء.")}</li>
              <li>{t("Test your connection again.", "اختبر اتصالك مرة أخرى.")}</li>
            </ol>
            <p>{t("If the issue persists, please contact our support team.", "إذا استمرت المشكلة، يرجى الاتصال بفريق الدعم.")}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">{t("Was this helpful?", "هل كان هذا مفيداً؟")}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><ThumbsUp className="h-4 w-4 mr-1" />{t("Yes", "نعم")}</Button>
              <Button variant="outline" size="sm"><ThumbsDown className="h-4 w-4 mr-1" />{t("No", "لا")}</Button>
            </div>
          </div>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Knowledge Base", "قاعدة المعرفة")}</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search articles...", "ابحث في المقالات...")} className="pl-9" />
      </div>

      {/* Categories */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {knowledgeBase.categories.map((cat) => {
            const Icon = iconMap[cat.icon] || AlertTriangle;
            return (
              <Card key={cat.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedCategory(cat.id)}>
                <CardContent className="p-4 text-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{t(cat.name, cat.nameAr)}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} {t("articles", "مقال")}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedCategory && (
        <>
          <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft className="h-4 w-4 mr-1" />{t("All Categories", "جميع الفئات")}
          </Button>
          <div className="space-y-2">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setSelectedArticle(article)}>
                <CardContent className="p-4">
                  <p className="font-medium text-sm">{t(article.title, article.titleAr)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t(article.summary, article.summaryAr)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
