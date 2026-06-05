import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  User,
  Building,
  MessageSquare,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  specialties: string[];
  description: string;
  email: string;
  phone: string;
  avatar: string;
  isActive: boolean;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  department: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general'
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Meriç Ulaş Kıray",
      position: "Satış ve Pazarlama Direktörü & Kurucu Ortak & Developer",
      specialties: ["Satış Stratejisi", "Pazarlama", "Yazılım Geliştirme", "Kurucu Ortaklık", "İş Geliştirme"],
      description: "Satış, pazarlama stratejileri ve yazılım geliştirme süreçlerinden sorumlu kurucu ortak.",
      email: "mericulask@gmail.com",
      phone: "+90 537 478 36 66",
      avatar: "/team/meric-ulas-kiray.jpg",
      isActive: true
    },
    {
      id: 2,
      name: "Ömer Sadık Uysal",
      position: "CTO & Teknoloji Direktörü & Developer & Kurucu Ortak",
      specialties: ["Teknoloji Yönetimi", "Software Architecture", "DevOps", "Kurucu Ortaklık", "System Design"],
      description: "Teknoloji altyapısı, yazılım geliştirme ve teknoloji stratejilerinden sorumlu kurucu ortak.",
      email: "omersadikuysal09@gmail.com",
      phone: "+90 552 265 13 37",
      avatar: "/team/omer-sadik-uysal.jpg",
      isActive: true
    },
    {
      id: 3,
      name: "Ali Bulut",
      position: "Pazarlama Direktörü - Developer & Kurucu Ortak",
      specialties: ["Digital Marketing", "Brand Strategy", "Frontend Development", "Kurucu Ortaklık", "SEO/SEM"],
      description: "Pazarlama stratejileri, brand yönetimi ve yazılım geliştirme konularında uzman kurucu ortak. Digital marketing ve frontend development alanlarında deneyimli.",
      email: "abulut48@hotmail.com",
      phone: "+90 532 123 45 67",
      avatar: "/team/ali-bulut.jpg",
      isActive: true
    },
    {
      id: 4,
      name: "Kadir Görkem Uzun",
      position: "Satış Direktörü - Developer & Kurucu Ortak",
      specialties: ["Sales Management", "Customer Relations", "Backend Development", "Kurucu Ortaklık", "B2B Sales"],
      description: "Satış operasyonları, müşteri ilişkileri ve yazılım geliştirme alanlarında deneyimli kurucu ortak. B2B satış ve backend development uzmanı.",
      email: "kuzun5675@gmail.com",
      phone: "+90 555 987 65 43",
      avatar: "/team/kadir-gorkem-uzun.jpg",
      isActive: true
    }
  ];

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen tüm gerekli alanları doldurunuz.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Mesajınız Gönderildi!",
        description: "En kısa sürede size dönüş yapacağız.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: 'general'
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyiniz.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDepartmentEmail = (department: string) => {
    switch (department) {
      case 'sales':
        return 'mericulask@gmail.com'; // Satış direktörü
      case 'technical':
        return 'omersadikuysal09@gmail.com'; // CTO
      case 'marketing':
        return 'abulut48@hotmail.com'; // Pazarlama direktörü
      case 'support':
        return 'kuzun5675@gmail.com'; // Müşteri ilişkileri
      default:
        return 'info@eliteshop.com';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              Bizimle İletişime Geçin
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              EliteShop ekibi olarak sorularınızı yanıtlamak ve size yardımcı olmak için buradayız. 
              Projeleriniz için en iyi çözümleri birlikte bulalım.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3 text-primary-600" />
                  Mesaj Gönder
                </CardTitle>
                <p className="text-gray-600">
                  Sorularınız, önerileriniz veya proje talepleriniz için bize ulaşın.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department">Departman</Label>
                    <select 
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="general">Genel Bilgi</option>
                      <option value="sales">Satış & İş Geliştirme</option>
                      <option value="technical">Teknik Destek</option>
                      <option value="marketing">Pazarlama & Ortaklık</option>
                      <option value="support">Müşteri Hizmetleri</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Mesajınız: {getDepartmentEmail(formData.department)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="subject">Konu</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Mesaj konusu (opsiyonel)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mesajınız *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Gönderiliyor...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Mesaj Gönder
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 mr-3 text-primary-600" />
                  İletişim Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Adres</h3>
                    <p className="text-gray-600">
                      İstanbul, Türkiye<br />
                      <span className="text-sm">Detaylı adres bilgisi için iletişime geçiniz</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
                    <p className="text-gray-600">
                      Pazartesi - Cuma: 09:00 - 18:00<br />
                      Cumartesi: 10:00 - 16:00<br />
                      Pazar: Kapalı
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Genel İletişim</h3>
                    <p className="text-gray-600">info@eliteshop.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Hızlı Bağlantılar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/about" className="text-primary-600 hover:text-primary-700 font-medium">
                    Hakkımızda
                  </a>
                  <a href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
                    Ürünler
                  </a>
                  <a href="/customer/orders" className="text-primary-600 hover:text-primary-700 font-medium">
                    Siparişlerim
                  </a>
                  <a href="/seller/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
                    Satıcı Paneli
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              EliteShop'i hayata geçiren uzman kurucu ortaklarımız ve geliştiricilerimizle tanışın.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                        {member.isActive && (
                          <div className="w-3 h-3 bg-green-500 rounded-full" title="Aktif"></div>
                        )}
                      </div>
                      <p className="text-primary-600 font-medium text-sm mb-3">{member.position}</p>
                      <p className="text-gray-600 text-sm mb-4">{member.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${member.email}`} className="text-primary-600 hover:text-primary-700">
                            {member.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${member.phone}`} className="text-gray-600">
                            {member.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
                Projeleriniz İçin Bizimle Çalışın
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                E-ticaret çözümleriniz için profesyonel destek ve uzman ekibimizin deneyiminden yararlanın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-primary">
                  <User className="w-4 h-4 mr-2" />
                  Ücretsiz Danışmanlık
                </Button>
                <Button variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Proje Talebi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
