// Mock data for Awasr Self-Care Portal — based on real Awasr Oman offerings

export const customer = {
  id: "CUST-20231",
  name: "Ahmed Al-Balushi",
  nameAr: "أحمد البلوشي",
  email: "ahmed.balushi@email.com",
  phone: "+968 9123 4567",
  accountNumber: "AWR-98765432",
  address: "Villa 42, Al Khuwair, Muscat, Oman",
  addressAr: "فيلا 42، الخوير، مسقط، عُمان",
  avatar: "",
  joinDate: "2023-03-15",
};

export const services = [
  {
    id: "SRV-001",
    type: "internet",
    name: "Fibernet Home 35",
    nameAr: "فايبرنت هوم 35",
    speed: "400 Mbps",
    uploadSpeed: "100 Mbps",
    status: "active" as const,
    monthlyCost: 35,
    dataLimit: "Unlimited",
    features: ["SafeNet Included", "Ashal Education Included", "Free Calls to Awasr Fixed Lines"],
    featuresAr: ["سيف نت مشمول", "أسهل تعليم مشمول", "مكالمات مجانية لخطوط أوامر الثابتة"],
    contract: "24 months",
    startDate: "2023-03-20",
  },
  {
    id: "SRV-002",
    type: "tv",
    name: "Jawwy TV App",
    nameAr: "تطبيق جوّي تي في",
    speed: "",
    status: "active" as const,
    monthlyCost: 5,
    channels: 150,
    startDate: "2023-03-20",
  },
  {
    id: "SRV-003",
    type: "addon",
    name: "SafeNet Home",
    nameAr: "سيف نت هوم",
    speed: "",
    status: "active" as const,
    monthlyCost: 0,
    startDate: "2023-03-20",
  },
];

export const invoiceLineItems = [
  { description: "Fibernet Home 35 (400 Mbps)", descriptionAr: "فايبرنت هوم 35 (400 ميجا)", amount: 35.0 },
  { description: "Jawwy TV App", descriptionAr: "تطبيق جوّي تي في", amount: 5.0 },
  { description: "VAT (5%)", descriptionAr: "ضريبة القيمة المضافة (5%)", amount: 2.0 },
];

export const invoices = [
  { id: "INV-2501", date: "2025-01-05", amount: 42.0, status: "paid" as const, dueDate: "2025-01-20" },
  { id: "INV-2502", date: "2025-02-05", amount: 42.0, status: "paid" as const, dueDate: "2025-02-20" },
  { id: "INV-2503", date: "2025-03-05", amount: 42.0, status: "paid" as const, dueDate: "2025-03-20" },
  { id: "INV-2504", date: "2025-04-05", amount: 42.0, status: "paid" as const, dueDate: "2025-04-20" },
  { id: "INV-2505", date: "2025-05-05", amount: 42.0, status: "paid" as const, dueDate: "2025-05-20" },
  { id: "INV-2506", date: "2025-06-05", amount: 42.0, status: "paid" as const, dueDate: "2025-06-20" },
  { id: "INV-2507", date: "2025-07-05", amount: 42.0, status: "unpaid" as const, dueDate: "2025-07-20" },
  { id: "INV-2508", date: "2025-08-05", amount: 42.0, status: "unpaid" as const, dueDate: "2025-08-20" },
];

export const tickets = [
  {
    id: "TKT-1001",
    category: "Internet",
    categoryAr: "الإنترنت",
    subject: "Speed drops below 400 Mbps during evenings",
    subjectAr: "انخفاض السرعة عن 400 ميجا في المساء",
    status: "open" as const,
    priority: "high" as const,
    createdAt: "2025-07-28T10:30:00",
    updatedAt: "2025-07-29T14:00:00",
    messages: [
      { sender: "customer", text: "My Fibernet Home 35 speed drops to about 80 Mbps after 8 PM. I'm paying for 400 Mbps.", timestamp: "2025-07-28T10:30:00" },
      { sender: "agent", text: "Thank you for reporting this. We are investigating the issue in the Al Khuwair area. A technician will review the line quality.", timestamp: "2025-07-29T14:00:00" },
    ],
  },
  {
    id: "TKT-1002",
    category: "Billing",
    categoryAr: "الفواتير",
    subject: "VAT calculation query on June invoice",
    subjectAr: "استفسار عن حساب الضريبة في فاتورة يونيو",
    status: "in_progress" as const,
    priority: "medium" as const,
    createdAt: "2025-07-15T09:00:00",
    updatedAt: "2025-07-20T11:30:00",
    messages: [
      { sender: "customer", text: "The VAT on my June invoice seems higher than 5%. Can you clarify the breakdown?", timestamp: "2025-07-15T09:00:00" },
      { sender: "agent", text: "We are reviewing the charge. It appears there was an adjustment for the Jawwy TV activation. We will confirm shortly.", timestamp: "2025-07-20T11:30:00" },
    ],
  },
  {
    id: "TKT-1003",
    category: "TV",
    categoryAr: "التلفزيون",
    subject: "Jawwy TV App not loading on Smart TV",
    subjectAr: "تطبيق جوّي تي في لا يعمل على التلفزيون الذكي",
    status: "resolved" as const,
    priority: "low" as const,
    createdAt: "2025-06-20T16:00:00",
    updatedAt: "2025-06-25T10:00:00",
    messages: [
      { sender: "customer", text: "The Jawwy TV app keeps crashing on my Samsung Smart TV after the latest update.", timestamp: "2025-06-20T16:00:00" },
      { sender: "agent", text: "A new app update has been released that fixes this issue. Please update the Jawwy TV app from your TV's app store and restart the TV.", timestamp: "2025-06-25T10:00:00" },
    ],
  },
  {
    id: "TKT-1004",
    category: "Installation",
    categoryAr: "التركيب",
    subject: "Request for router relocation to home office",
    subjectAr: "طلب نقل الراوتر إلى المكتب المنزلي",
    status: "closed" as const,
    priority: "low" as const,
    createdAt: "2025-05-10T08:00:00",
    updatedAt: "2025-05-18T15:00:00",
    messages: [
      { sender: "customer", text: "I need to move my fiber router from the living room to the home office.", timestamp: "2025-05-10T08:00:00" },
      { sender: "agent", text: "A technician visited on May 15 and relocated the router. Please confirm everything is working.", timestamp: "2025-05-18T15:00:00" },
      { sender: "customer", text: "Yes, everything works perfectly. Thank you!", timestamp: "2025-05-18T16:30:00" },
    ],
  },
];

export const orders = [
  {
    id: "ORD-5001",
    type: "Plan Upgrade",
    typeAr: "ترقية الباقة",
    service: "Fibernet Home 40 (600 Mbps)",
    status: "technician_assigned" as const,
    steps: [
      { label: "Placed", labelAr: "تم الطلب", date: "2025-07-20", completed: true },
      { label: "Confirmed", labelAr: "تم التأكيد", date: "2025-07-21", completed: true },
      { label: "Scheduled", labelAr: "تم الجدولة", date: "2025-07-25", completed: true },
      { label: "Technician Assigned", labelAr: "تم تعيين فني", date: "2025-07-28", completed: true },
      { label: "Upgraded", labelAr: "تمت الترقية", date: "", completed: false },
      { label: "Active", labelAr: "نشط", date: "", completed: false },
    ],
    technician: { name: "Khalid Al-Harthi", nameAr: "خالد الحارثي", phone: "+968 9234 5678" },
  },
];

export const usageData = [
  { name: "Download", value: 856, limit: -1, unit: "GB", unlimited: true },
  { name: "Upload", value: 124, limit: -1, unit: "GB", unlimited: true },
];

export const monthlyUsage = [
  { month: "Jan", download: 720, upload: 95 },
  { month: "Feb", download: 810, upload: 110 },
  { month: "Mar", download: 950, upload: 130 },
  { month: "Apr", download: 780, upload: 105 },
  { month: "May", download: 890, upload: 118 },
  { month: "Jun", download: 1020, upload: 140 },
  { month: "Jul", download: 856, upload: 124 },
];

export const recentActivity = [
  { id: 1, type: "payment", description: "Payment of 42.00 received", descriptionAr: "تم استلام دفعة بقيمة 42.00", date: "2025-07-25", icon: "payment" },
  { id: 2, type: "ticket", description: "Ticket TKT-1001 created — Speed issue", descriptionAr: "تم إنشاء التذكرة TKT-1001 — مشكلة السرعة", date: "2025-07-28", icon: "ticket" },
  { id: 3, type: "service", description: "Jawwy TV subscription renewed", descriptionAr: "تم تجديد اشتراك جوّي تي في", date: "2025-07-20", icon: "service" },
  { id: 4, type: "order", description: "Upgrade to Fibernet Home 40 requested", descriptionAr: "تم طلب ترقية إلى فايبرنت هوم 40", date: "2025-07-28", icon: "order" },
  { id: 5, type: "billing", description: "Invoice INV-2508 generated — 42.00", descriptionAr: "تم إصدار الفاتورة INV-2508 — 42.00", date: "2025-08-05", icon: "billing" },
];

export const notifications = [
  { id: 1, category: "billing", title: "Payment Due", titleAr: "موعد الدفع", message: "Your invoice INV-2507 of 42.00 is due on July 20.", messageAr: "فاتورتك INV-2507 بقيمة 42.00 مستحقة في 20 يوليو.", read: false, date: "2025-07-15" },
  { id: 2, category: "service", title: "Maintenance Scheduled", titleAr: "صيانة مجدولة", message: "Planned fiber maintenance in Al Khuwair area on Aug 10, 2-4 AM. Expect brief service interruption.", messageAr: "صيانة مخططة للألياف في منطقة الخوير في 10 أغسطس، 2-4 صباحاً.", read: false, date: "2025-08-01" },
  { id: 3, category: "ticket", title: "Ticket Updated", titleAr: "تحديث التذكرة", message: "Your ticket TKT-1001 regarding evening speed drops has been assigned to a technician.", messageAr: "تم تعيين فني لتذكرتك TKT-1001 بخصوص انخفاض السرعة.", read: true, date: "2025-07-29" },
  { id: 4, category: "order", title: "Upgrade in Progress", titleAr: "الترقية قيد التنفيذ", message: "Your upgrade to Fibernet Home 40 (600 Mbps) is being processed. Technician assigned.", messageAr: "تتم معالجة ترقيتك إلى فايبرنت هوم 40. تم تعيين فني.", read: true, date: "2025-07-28" },
  { id: 5, category: "outage", title: "Network Restored", titleAr: "تمت استعادة الشبكة", message: "The fiber issue in Seeb area has been resolved. All services are now operational.", messageAr: "تم حل مشكلة الألياف في منطقة السيب. جميع الخدمات تعمل الآن.", read: true, date: "2025-07-27" },
];

export const networkStatus = [
  { region: "Muscat", regionAr: "مسقط", status: "operational" as const, lastUpdated: "2025-08-01T10:00:00" },
  { region: "Seeb", regionAr: "السيب", status: "degraded" as const, lastUpdated: "2025-08-01T09:30:00", issue: "Intermittent connectivity in Block 4", issueAr: "انقطاع متقطع في المربع 4" },
  { region: "Sohar", regionAr: "صحار", status: "operational" as const, lastUpdated: "2025-08-01T10:00:00" },
  { region: "Salalah", regionAr: "صلالة", status: "operational" as const, lastUpdated: "2025-08-01T10:00:00" },
  { region: "Nizwa", regionAr: "نزوى", status: "outage" as const, lastUpdated: "2025-08-01T08:00:00", issue: "Fiber cut — repair crew dispatched", issueAr: "قطع في الألياف — تم إرسال فريق الإصلاح", eta: "2025-08-01T14:00:00" },
  { region: "Sur", regionAr: "صور", status: "operational" as const, lastUpdated: "2025-08-01T10:00:00" },
  { region: "Al Buraimi", regionAr: "البريمي", status: "operational" as const, lastUpdated: "2025-08-01T10:00:00" },
  { region: "Ibri", regionAr: "عبري", status: "operational" as const, lastUpdated: "2025-08-01T10:00:00" },
];

export const plans = [
  { id: "PLN-01", name: "Fibernet Home 27", nameAr: "فايبرنت هوم 27", speed: "300 Mbps", uploadSpeed: "40 Mbps", price: 27, priceWithVat: 28.35, type: "internet", features: ["Unlimited Data", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-02", name: "Fibernet Home 28", nameAr: "فايبرنت هوم 28", speed: "350 Mbps", uploadSpeed: "45 Mbps", price: 28, priceWithVat: 29.40, type: "internet", features: ["Unlimited Data", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-03", name: "Fibernet Home 30", nameAr: "فايبرنت هوم 30", speed: "500 Mbps", uploadSpeed: "65 Mbps", price: 30, priceWithVat: 31.50, type: "internet", features: ["Unlimited Data", "SafeNet Included", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "سيف نت مشمول", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-04", name: "Fibernet Home 35", nameAr: "فايبرنت هوم 35", speed: "600 Mbps", uploadSpeed: "100 Mbps", price: 35, priceWithVat: 36.75, type: "internet", features: ["Unlimited Data", "SafeNet Included", "Shahid VIP Lite", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "سيف نت مشمول", "شاهد VIP لايت", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-05", name: "Fibernet Home 40", nameAr: "فايبرنت هوم 40", speed: "750 Mbps", uploadSpeed: "150 Mbps", price: 40, priceWithVat: 42.00, type: "internet", features: ["Unlimited Data", "SafeNet Included", "Shahid VIP Lite", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "سيف نت مشمول", "شاهد VIP لايت", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-06", name: "Fibernet Home 45", nameAr: "فايبرنت هوم 45", speed: "800 Mbps", uploadSpeed: "200 Mbps", price: 45, priceWithVat: 47.25, type: "internet", features: ["Unlimited Data", "SafeNet Included", "Shahid VIP Lite", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "سيف نت مشمول", "شاهد VIP لايت", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-07", name: "Fibernet Home 90", nameAr: "فايبرنت هوم 90", speed: "1 Gbps", uploadSpeed: "250 Mbps", price: 90, priceWithVat: 94.50, type: "internet", features: ["Unlimited Data", "SafeNet Included", "Shahid VIP Lite", "Ashal Education", "Free Calls to Awasr Fixed Lines"], featuresAr: ["بيانات غير محدودة", "سيف نت مشمول", "شاهد VIP لايت", "أسهل تعليم", "مكالمات مجانية لخطوط أوامر"] },
  { id: "PLN-08", name: "Shahid VIP Lite", nameAr: "شاهد VIP لايت", speed: "", price: 5, priceWithVat: 5.25, type: "addon", features: ["150+ Live TV Channels", "Movies & Series", "Kids Content"], featuresAr: ["أكثر من 150 قناة مباشرة", "أفلام ومسلسلات", "محتوى أطفال"] },
  { id: "PLN-09", name: "SafeNet Home", nameAr: "سيف نت هوم", speed: "", price: 2, priceWithVat: 2.10, type: "addon", features: ["Malware Protection", "Parental Controls", "Content Filtering"], featuresAr: ["حماية من البرمجيات الخبيثة", "مراقبة أبوية", "تصفية المحتوى"] },
];

export const knowledgeBase = {
  categories: [
    { id: "internet", name: "Internet", nameAr: "الإنترنت", icon: "Wifi", count: 12 },
    { id: "tv", name: "Jawwy TV", nameAr: "جوّي تي في", icon: "Tv", count: 8 },
    { id: "billing", name: "Billing", nameAr: "الفواتير", icon: "CreditCard", count: 10 },
    { id: "installation", name: "Installation", nameAr: "التركيب", icon: "Wrench", count: 6 },
    { id: "account", name: "My Awasr Account", nameAr: "حساب أوامر", icon: "User", count: 5 },
    { id: "troubleshooting", name: "Troubleshooting", nameAr: "استكشاف الأخطاء", icon: "AlertTriangle", count: 15 },
  ],
  articles: [
    { id: "KB-001", category: "internet", title: "How to restart your Awasr router", titleAr: "كيفية إعادة تشغيل راوتر أوامر", summary: "Step-by-step guide to restart your Awasr fiber router for better connectivity.", summaryAr: "دليل خطوة بخطوة لإعادة تشغيل راوتر الألياف." },
    { id: "KB-002", category: "internet", title: "Understanding your fiber speed", titleAr: "فهم سرعة الألياف", summary: "Learn about download vs upload speeds on your Fibernet Home plan.", summaryAr: "تعرف على سرعة التحميل والرفع في باقة فايبرنت هوم." },
    { id: "KB-003", category: "billing", title: "How to pay your Awasr bill", titleAr: "كيفية دفع فاتورة أوامر", summary: "Pay via My Awasr app, website, WhatsApp (80001000), or at retail stores.", summaryAr: "ادفع عبر تطبيق ماي أوامر أو الموقع أو واتساب أو المتاجر." },
    { id: "KB-004", category: "tv", title: "Setting up Jawwy TV App", titleAr: "إعداد تطبيق جوّي تي في", summary: "Complete setup guide for Jawwy TV on your Smart TV, mobile, or tablet.", summaryAr: "دليل إعداد كامل لجوّي تي في على التلفزيون الذكي أو الجوال." },
    { id: "KB-005", category: "troubleshooting", title: "No internet connection", titleAr: "لا يوجد اتصال بالإنترنت", summary: "Troubleshooting steps: check fiber light, restart router, contact 80001000.", summaryAr: "خطوات الحل: تحقق من ضوء الألياف، أعد تشغيل الراوتر، اتصل بـ 80001000." },
    { id: "KB-006", category: "installation", title: "Preparing for Awasr installation", titleAr: "التحضير لتركيب أوامر", summary: "Installation fee: 15 (1-year) or 10 (2-year contract). What to expect on installation day.", summaryAr: "رسوم التركيب: 15 (سنة) أو 10 (سنتين). ماذا تتوقع يوم التركيب." },
  ],
};

export const promotions = [
  { id: "PROMO-01", title: "Upgrade to 1 Gbps", titleAr: "ترقية إلى 1 جيجا", description: "Get Fibernet Home 90 with 1 Gbps speed for only 90 ﷼/month with 24-month contract", descriptionAr: "احصل على فايبرنت هوم 90 بسرعة 1 جيجا بـ 90 ﷼ فقط/شهر مع عقد 24 شهر", discount: "Save 4.50 VAT", validUntil: "2025-12-31", image: "" },
  { id: "PROMO-02", title: "Refer a Friend", titleAr: "أحل صديقاً", description: "Earn 10 ﷼ credit for each friend who subscribes to Awasr Fibernet", descriptionAr: "اكسب 10 ﷼ رصيد لكل صديق يشترك في أوامر فايبرنت", discount: "10", validUntil: "2025-12-31", image: "" },
];
