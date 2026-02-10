import { useState } from "react";
import { MessageText, CloseCircle, Send2 } from "iconsax-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const quickQuestions = [
  { en: "How to pay my bill?", ar: "كيف أدفع فاتورتي؟" },
  { en: "Check internet speed", ar: "فحص سرعة الإنترنت" },
  { en: "Report an issue", ar: "الإبلاغ عن مشكلة" },
  { en: "Talk to an agent", ar: "التحدث مع وكيل" },
];

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { t, dir } = useLanguage();

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t(
            "Thank you for your message. A support agent will assist you shortly. For immediate help, please call 1300.",
            "شكراً لرسالتك. سيقوم وكيل دعم بمساعدتك قريباً. للمساعدة الفورية، يرجى الاتصال بـ 1300."
          ),
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed z-50 h-12 w-12 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all",
          "md:bottom-6 md:end-6",
          "bottom-20 end-4"
        )}
      >
        {open ? <CloseCircle size={22} /> : <MessageText size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className={cn(
            "fixed z-50 bg-card rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden",
            "md:bottom-20 md:end-6 md:w-80 md:h-[420px]",
            "bottom-20 end-4 start-4 h-[400px] md:start-auto"
          )}
        >
          {/* Header */}
          <div className="gradient-primary p-3 text-white">
            <p className="font-semibold text-sm">{t("Awasr Assistant", "مساعد أوامر")}</p>
            <p className="text-xs opacity-80">{t("Online", "متصل")}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t("How can I help you today?", "كيف يمكنني مساعدتك اليوم؟")}</p>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(t(q.en, q.ar))}
                    className="block w-full text-start text-sm px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {t(q.en, q.ar)}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder={t("Type a message...", "اكتب رسالة...")}
              className="flex-1 text-sm bg-muted rounded-md px-3 py-2 outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send2 size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}