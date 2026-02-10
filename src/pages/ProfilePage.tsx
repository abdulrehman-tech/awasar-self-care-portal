import { useState } from "react";
import { User, Mail, Phone, MapPin, Lock, LogOut, CreditCard, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { customer } from "@/data/mockData";

export default function ProfilePage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    toast({ title: t("Profile Updated", "تم تحديث الملف الشخصي") });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("Profile & Settings", "الملف الشخصي والإعدادات")}</h1>

      {/* Personal info */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("Personal Information", "المعلومات الشخصية")}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => editing ? handleSave() : setEditing(true)}>
              {editing ? <><Save className="h-4 w-4 mr-1" />{t("Save", "حفظ")}</> : t("Edit", "تعديل")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">A</div>
            <div>
              <p className="font-semibold">{t(customer.name, customer.nameAr)}</p>
              <p className="text-sm text-muted-foreground">{customer.accountNumber}</p>
            </div>
          </div>
          {[
            { icon: Mail, label: t("Email", "البريد الإلكتروني"), value: customer.email },
            { icon: Phone, label: t("Phone", "الهاتف"), value: customer.phone },
            { icon: MapPin, label: t("Address", "العنوان"), value: t(customer.address, customer.addressAr) },
          ].map((field, i) => (
            <div key={i} className="flex items-center gap-3">
              <field.icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{field.label}</Label>
                {editing ? <Input defaultValue={field.value} className="mt-1" /> : <p className="text-sm">{field.value}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Notification Preferences", "تفضيلات الإشعارات")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: t("Email Notifications", "إشعارات البريد الإلكتروني"), default: true },
            { label: t("SMS Notifications", "إشعارات الرسائل"), default: true },
            { label: t("Push Notifications", "الإشعارات الفورية"), default: false },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <p className="text-sm">{pref.label}</p>
              <Switch defaultChecked={pref.default} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Language", "اللغة")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue={language}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("Payment Methods", "طرق الدفع")}</CardTitle>
            <Button variant="outline" size="sm">{t("Add", "إضافة")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 py-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div><p className="text-sm">•••• •••• •••• 4521</p><p className="text-xs text-muted-foreground">Visa — Expires 12/25</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("Change Password", "تغيير كلمة المرور")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2"><Label>{t("Current Password", "كلمة المرور الحالية")}</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>{t("New Password", "كلمة المرور الجديدة")}</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>{t("Confirm Password", "تأكيد كلمة المرور")}</Label><Input type="password" /></div>
          <Button size="sm"><Lock className="h-4 w-4 mr-1" />{t("Update Password", "تحديث كلمة المرور")}</Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button variant="destructive" className="w-full sm:w-auto">
        <LogOut className="h-4 w-4 mr-1" />{t("Logout", "تسجيل الخروج")}
      </Button>
    </div>
  );
}
