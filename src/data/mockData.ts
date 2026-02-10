// Mock data for Awasr Self-Care Portal

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
  joinDate: "2022-03-15",
};

export const services = [
  {
    id: "SRV-001",
    type: "internet",
    name: "Awasr Fiber 200",
    nameAr: "أوامر فايبر 200",
    speed: "200 Mbps",
    status: "active" as const,
    monthlyCost: 25,
    dataUsed: 342,
    dataLimit: 500,
    startDate: "2023-01-10",
  },
  {
    id: "SRV-002",
    type: "tv",
    name: "Awasr TV Premium",
    nameAr: "أوامر تلفزيون بريميوم",
    speed: "",
    status: "active" as const,
    monthlyCost: 12,
    channels: 180,
    startDate: "2023-01-10",
  },
  {
    id: "SRV-003",
    type: "voice",
    name: "Home Phone Basic",
    nameAr: "هاتف منزلي أساسي",
    speed: "",
    status: "suspended" as const,
    monthlyCost: 3,
    startDate: "2023-06-01",
  },
];

export const invoiceLineItems = [
  { description: "Awasr Fiber 200", descriptionAr: "أوامر فايبر 200", amount: 25.0 },
  { description: "Awasr TV Premium", descriptionAr: "أوامر تلفزيون بريميوم", amount: 12.0 },
  { description: "Home Phone Basic", descriptionAr: "هاتف منزلي أساسي", amount: 3.0 },
];

export const invoices = [
  { id: "INV-2401", date: "2024-01-05", amount: 40.0, status: "paid" as const, dueDate: "2024-01-20" },
  { id: "INV-2402", date: "2024-02-05", amount: 40.0, status: "paid" as const, dueDate: "2024-02-20" },
  { id: "INV-2403", date: "2024-03-05", amount: 40.0, status: "paid" as const, dueDate: "2024-03-20" },
  { id: "INV-2404", date: "2024-04-05", amount: 40.0, status: "paid" as const, dueDate: "2024-04-20" },
  { id: "INV-2405", date: "2024-05-05", amount: 42.5, status: "paid" as const, dueDate: "2024-05-20" },
  { id: "INV-2406", date: "2024-06-05", amount: 42.5, status: "paid" as const, dueDate: "2024-06-20" },
  { id: "INV-2407", date: "2024-07-05", amount: 40.0, status: "unpaid" as const, dueDate: "2024-07-20" },
  { id: "INV-2408", date: "2024-08-05", amount: 40.0, status: "unpaid" as const, dueDate: "2024-08-20" },
];

export const tickets = [
  {
    id: "TKT-1001",
    category: "Internet",
    categoryAr: "الإنترنت",
    subject: "Slow internet speed during evenings",
    subjectAr: "بطء سرعة الإنترنت في المساء",
    status: "open" as const,
    priority: "high" as const,
    createdAt: "2024-07-28T10:30:00",
    updatedAt: "2024-07-29T14:00:00",
    messages: [
      { sender: "customer", text: "My internet speed drops significantly after 8 PM every day. I'm on the 200Mbps plan but getting only 30Mbps.", timestamp: "2024-07-28T10:30:00" },
      { sender: "agent", text: "Thank you for reporting this. We are investigating the issue in your area. A technician will review the line quality.", timestamp: "2024-07-29T14:00:00" },
    ],
  },
  {
    id: "TKT-1002",
    category: "Billing",
    categoryAr: "الفواتير",
    subject: "Incorrect charge on June invoice",
    subjectAr: "رسوم غير صحيحة في فاتورة يونيو",
    status: "in_progress" as const,
    priority: "medium" as const,
    createdAt: "2024-07-15T09:00:00",
    updatedAt: "2024-07-20T11:30:00",
    messages: [
      { sender: "customer", text: "I was charged OMR 42.5 instead of OMR 40 on my June invoice. Please clarify.", timestamp: "2024-07-15T09:00:00" },
      { sender: "agent", text: "We are reviewing the charge. It appears to be a one-time add-on fee. We will confirm shortly.", timestamp: "2024-07-20T11:30:00" },
    ],
  },
  {
    id: "TKT-1003",
    category: "TV",
    categoryAr: "التلفزيون",
    subject: "Missing channels from TV package",
    subjectAr: "قنوات مفقودة من باقة التلفزيون",
    status: "resolved" as const,
    priority: "low" as const,
    createdAt: "2024-06-20T16:00:00",
    updatedAt: "2024-06-25T10:00:00",
    messages: [
      { sender: "customer", text: "Some sports channels are missing from my Premium TV package.", timestamp: "2024-06-20T16:00:00" },
      { sender: "agent", text: "The channels have been restored. There was a temporary configuration issue. Please restart your set-top box.", timestamp: "2024-06-25T10:00:00" },
    ],
  },
  {
    id: "TKT-1004",
    category: "Installation",
    categoryAr: "التركيب",
    subject: "Request for router relocation",
    subjectAr: "طلب نقل الراوتر",
    status: "closed" as const,
    priority: "low" as const,
    createdAt: "2024-05-10T08:00:00",
    updatedAt: "2024-05-18T15:00:00",
    messages: [
      { sender: "customer", text: "I need to move my router from the living room to the home office.", timestamp: "2024-05-10T08:00:00" },
      { sender: "agent", text: "A technician visited on May 15 and relocated the router. Please confirm everything is working.", timestamp: "2024-05-18T15:00:00" },
      { sender: "customer", text: "Yes, everything works perfectly. Thank you!", timestamp: "2024-05-18T16:30:00" },
    ],
  },
];

export const orders = [
  {
    id: "ORD-5001",
    type: "New Installation",
    typeAr: "تركيب جديد",
    service: "Awasr Fiber 200",
    status: "technician_assigned" as const,
    steps: [
      { label: "Placed", labelAr: "تم الطلب", date: "2024-07-20", completed: true },
      { label: "Confirmed", labelAr: "تم التأكيد", date: "2024-07-21", completed: true },
      { label: "Scheduled", labelAr: "تم الجدولة", date: "2024-07-25", completed: true },
      { label: "Technician Assigned", labelAr: "تم تعيين فني", date: "2024-07-28", completed: true },
      { label: "Installed", labelAr: "تم التركيب", date: "", completed: false },
      { label: "Active", labelAr: "نشط", date: "", completed: false },
    ],
    technician: { name: "Khalid Al-Harthi", nameAr: "خالد الحارثي", phone: "+968 9234 5678" },
  },
];

export const usageData = [
  { name: "Data", value: 342, limit: 500, unit: "GB" },
  { name: "Voice", value: 120, limit: 300, unit: "min" },
  { name: "SMS", value: 45, limit: 100, unit: "msgs" },
];

export const monthlyUsage = [
  { month: "Jan", data: 280, voice: 90, sms: 30 },
  { month: "Feb", data: 310, voice: 110, sms: 40 },
  { month: "Mar", data: 350, voice: 95, sms: 35 },
  { month: "Apr", data: 290, voice: 130, sms: 50 },
  { month: "May", data: 320, voice: 100, sms: 42 },
  { month: "Jun", data: 380, voice: 85, sms: 38 },
  { month: "Jul", data: 342, voice: 120, sms: 45 },
];

export const recentActivity = [
  { id: 1, type: "payment", description: "Payment of OMR 40.00 received", descriptionAr: "تم استلام دفعة بقيمة 40.00 ر.ع", date: "2024-07-25", icon: "payment" },
  { id: 2, type: "ticket", description: "Ticket TKT-1001 created", descriptionAr: "تم إنشاء التذكرة TKT-1001", date: "2024-07-28", icon: "ticket" },
  { id: 3, type: "service", description: "TV package renewed", descriptionAr: "تم تجديد باقة التلفزيون", date: "2024-07-20", icon: "service" },
  { id: 4, type: "order", description: "Installation order ORD-5001 updated", descriptionAr: "تم تحديث طلب التركيب ORD-5001", date: "2024-07-28", icon: "order" },
  { id: 5, type: "billing", description: "Invoice INV-2408 generated", descriptionAr: "تم إصدار الفاتورة INV-2408", date: "2024-08-05", icon: "billing" },
];

export const notifications = [
  { id: 1, category: "billing", title: "Payment Due", titleAr: "موعد الدفع", message: "Your invoice INV-2407 of OMR 40.00 is due on July 20.", messageAr: "فاتورتك INV-2407 بقيمة 40.00 ر.ع مستحقة في 20 يوليو.", read: false, date: "2024-07-15" },
  { id: 2, category: "service", title: "Maintenance Scheduled", titleAr: "صيانة مجدولة", message: "Planned maintenance in Al Khuwair area on Aug 10, 2-4 AM.", messageAr: "صيانة مخططة في منطقة الخوير في 10 أغسطس، 2-4 صباحاً.", read: false, date: "2024-08-01" },
  { id: 3, category: "ticket", title: "Ticket Updated", titleAr: "تحديث التذكرة", message: "Your ticket TKT-1001 has been assigned to a technician.", messageAr: "تم تعيين فني لتذكرتك TKT-1001.", read: true, date: "2024-07-29" },
  { id: 4, category: "order", title: "Order Progress", titleAr: "تقدم الطلب", message: "Your installation order ORD-5001 has a technician assigned.", messageAr: "تم تعيين فني لطلب التركيب ORD-5001.", read: true, date: "2024-07-28" },
  { id: 5, category: "outage", title: "Network Restored", titleAr: "تمت استعادة الشبكة", message: "The network issue in Seeb area has been resolved.", messageAr: "تم حل مشكلة الشبكة في منطقة السيب.", read: true, date: "2024-07-27" },
];

export const networkStatus = [
  { region: "Muscat", regionAr: "مسقط", status: "operational" as const, lastUpdated: "2024-08-01T10:00:00" },
  { region: "Seeb", regionAr: "السيب", status: "degraded" as const, lastUpdated: "2024-08-01T09:30:00", issue: "Intermittent connectivity", issueAr: "انقطاع متقطع في الاتصال" },
  { region: "Sohar", regionAr: "صحار", status: "operational" as const, lastUpdated: "2024-08-01T10:00:00" },
  { region: "Salalah", regionAr: "صلالة", status: "operational" as const, lastUpdated: "2024-08-01T10:00:00" },
  { region: "Nizwa", regionAr: "نزوى", status: "outage" as const, lastUpdated: "2024-08-01T08:00:00", issue: "Fiber cut - repair underway", issueAr: "قطع في الألياف - الإصلاح جارٍ", eta: "2024-08-01T14:00:00" },
  { region: "Sur", regionAr: "صور", status: "operational" as const, lastUpdated: "2024-08-01T10:00:00" },
];

export const plans = [
  { id: "PLN-01", name: "Awasr Fiber 50", nameAr: "أوامر فايبر 50", speed: "50 Mbps", price: 15, type: "internet" },
  { id: "PLN-02", name: "Awasr Fiber 100", nameAr: "أوامر فايبر 100", speed: "100 Mbps", price: 20, type: "internet" },
  { id: "PLN-03", name: "Awasr Fiber 200", nameAr: "أوامر فايبر 200", speed: "200 Mbps", price: 25, type: "internet" },
  { id: "PLN-04", name: "Awasr Fiber 500", nameAr: "أوامر فايبر 500", speed: "500 Mbps", price: 35, type: "internet" },
  { id: "PLN-05", name: "Awasr TV Basic", nameAr: "أوامر تلفزيون أساسي", speed: "", price: 5, type: "tv", channels: 80 },
  { id: "PLN-06", name: "Awasr TV Premium", nameAr: "أوامر تلفزيون بريميوم", speed: "", price: 12, type: "tv", channels: 180 },
  { id: "PLN-07", name: "Home Phone Basic", nameAr: "هاتف منزلي أساسي", speed: "", price: 3, type: "voice" },
  { id: "PLN-08", name: "Fiber 200 + TV Bundle", nameAr: "باقة فايبر 200 + تلفزيون", speed: "200 Mbps", price: 32, type: "bundle", includes: ["Internet 200Mbps", "TV Premium 180ch"] },
];

export const knowledgeBase = {
  categories: [
    { id: "internet", name: "Internet", nameAr: "الإنترنت", icon: "Wifi", count: 12 },
    { id: "tv", name: "TV", nameAr: "التلفزيون", icon: "Tv", count: 8 },
    { id: "billing", name: "Billing", nameAr: "الفواتير", icon: "CreditCard", count: 10 },
    { id: "installation", name: "Installation", nameAr: "التركيب", icon: "Wrench", count: 6 },
    { id: "account", name: "Account", nameAr: "الحساب", icon: "User", count: 5 },
    { id: "troubleshooting", name: "Troubleshooting", nameAr: "استكشاف الأخطاء", icon: "AlertTriangle", count: 15 },
  ],
  articles: [
    { id: "KB-001", category: "internet", title: "How to restart your router", titleAr: "كيفية إعادة تشغيل جهاز التوجيه", summary: "Step-by-step guide to restart your Awasr router for better connectivity.", summaryAr: "دليل خطوة بخطوة لإعادة تشغيل جهاز التوجيه." },
    { id: "KB-002", category: "internet", title: "Understanding your internet speed", titleAr: "فهم سرعة الإنترنت", summary: "Learn about factors that affect your internet speed and how to optimize it.", summaryAr: "تعرف على العوامل التي تؤثر على سرعة الإنترنت." },
    { id: "KB-003", category: "billing", title: "How to pay your bill online", titleAr: "كيفية دفع فاتورتك عبر الإنترنت", summary: "Multiple payment options available for your Awasr bills.", summaryAr: "خيارات دفع متعددة متاحة لفواتير أوامر." },
    { id: "KB-004", category: "tv", title: "Setting up your TV box", titleAr: "إعداد جهاز التلفزيون", summary: "Complete setup guide for your Awasr TV set-top box.", summaryAr: "دليل إعداد كامل لجهاز أوامر التلفزيون." },
    { id: "KB-005", category: "troubleshooting", title: "No internet connection", titleAr: "لا يوجد اتصال بالإنترنت", summary: "Troubleshooting steps when you have no internet access.", summaryAr: "خطوات استكشاف الأخطاء عند عدم وجود اتصال." },
    { id: "KB-006", category: "installation", title: "Preparing for installation", titleAr: "التحضير للتركيب", summary: "What to expect and how to prepare for your Awasr installation.", summaryAr: "ماذا تتوقع وكيف تستعد للتركيب." },
  ],
};

export const promotions = [
  { id: "PROMO-01", title: "Summer Bundle Offer", titleAr: "عرض باقة الصيف", description: "Get Fiber 200 + TV Premium for only OMR 32/month", descriptionAr: "احصل على فايبر 200 + تلفزيون بريميوم بـ 32 ر.ع فقط/شهر", discount: "20%", validUntil: "2024-09-30", image: "" },
  { id: "PROMO-02", title: "Refer a Friend", titleAr: "أحل صديقاً", description: "Earn OMR 10 credit for each friend who joins Awasr", descriptionAr: "اكسب 10 ر.ع رصيد لكل صديق ينضم لأوامر", discount: "OMR 10", validUntil: "2024-12-31", image: "" },
];
