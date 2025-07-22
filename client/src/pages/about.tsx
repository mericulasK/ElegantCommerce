import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Eye, 
  Users, 
  Lightbulb,
  Award,
  TrendingUp,
  ShoppingCart,
  Globe,
  Heart,
  Zap,
  Shield,
  Rocket,
  Star,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

interface Founder {
  name: string;
  position: string;
  expertise: string[];
  description: string;
  avatar: string;
}

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Achievement {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function AboutPage() {
  const founders: Founder[] = [
    {
      name: "Meriç Ulaş Kıray",
      position: "Kurucu Ortak & Satış ve Pazarlama Direktörü",
      expertise: ["Satış Stratejisi", "Pazarlama", "Yazılım Geliştirme", "İş Geliştirme"],
      description: "Satış ve pazarlama alanındaki köklü deneyimi ile ElegantCommerce'in büyüme stratejilerini yönlendiriyor.",
      avatar: "/team/meric-ulas-kiray.jpg"
    },
    {
      name: "Ömer Sadık Uysal",
      position: "Kurucu Ortak & CTO",
      expertise: ["Teknoloji Yönetimi", "Software Architecture", "DevOps", "System Design"],
      description: "Teknoloji vizyonu ve yazılım mimarisi uzmanlığı ile platformun teknik altyapısını şekillendiriyor.",
      avatar: "/team/omer-sadik-uysal.jpg"
    },
    {
      name: "Ali Bulut",
      position: "Kurucu Ortak & Pazarlama Direktörü",
      expertise: ["Digital Marketing", "Brand Strategy", "Frontend Development", "SEO/SEM"],
      description: "Dijital pazarlama uzmanlığı ve marka stratejileri ile ElegantCommerce'in online varlığını güçlendiriyor.",
      avatar: "/team/ali-bulut.jpg"
    },
    {
      name: "Kadir Görkem Uzun",
      position: "Kurucu Ortak & Satış Direktörü",
      expertise: ["Sales Management", "Customer Relations", "Backend Development", "B2B Sales"],
      description: "Müşteri ilişkileri ve satış operasyonları uzmanlığı ile platform kullanıcı deneyimini optimize ediyor.",
      avatar: "/team/kadir-gorkem-uzun.jpg"
    }
  ];

  const values: Value[] = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Müşteri Odaklılık",
      description: "Müşterilerimizin ihtiyaçlarını en iyi şekilde anlamak ve onlara değer katacak çözümler sunmak önceliğimizdir."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "İnovasyon",
      description: "Sürekli gelişim ve yenilikçi yaklaşımlarla e-ticaret dünyasında öncü olmayı hedefliyoruz."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Güvenilirlik",
      description: "Güvenli, kararlı ve sürdürülebilir çözümler sunarak uzun vadeli ortaklıklar kuruyoruz."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Takım Çalışması",
      description: "Birlikte çalışma kültürü ve ortak hedefler doğrultusunda güçlü ekip ruhu ile hareket ediyoruz."
    }
  ];

  const achievements: Achievement[] = [
    {
      icon: <Rocket className="w-6 h-6 text-purple-500" />,
      title: "Modern Teknoloji Stack",
      description: "React, .NET 8, ve modern geliştirme araçları ile güçlü altyapı"
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Kullanıcı Deneyimi",
      description: "Sezgisel arayüz ve optimize edilmiş kullanıcı yolculuğu"
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      title: "Performans",
      description: "Hızlı yükleme süreleri ve sorunsuz işlem akışları"
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-500" />,
      title: "Ölçeklenebilirlik",
      description: "Büyüyen işletmeler için esnek ve genişletilebilir mimari"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              ElegantCommerce Hakkında
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed mb-8">
              E-ticaretin geleceğini şekillendiren, teknoloji ve inovasyonu bir araya getiren 
              modern bir platform yaratıyoruz. Müşterilerimizin başarısı bizim motivasyonumuzudur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-primary-600 hover:bg-primary-50">
                  Bizimle İletişime Geçin
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Ürünleri Keşfet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Mission & Vision */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-primary-600" />
                  Misyonumuz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  ElegantCommerce olarak, işletmelerin dijital dönüşüm yolculuğunda en güvenilir 
                  ortağı olmayı hedefliyoruz. Modern teknolojiler ve kullanıcı odaklı tasarım 
                  anlayışı ile e-ticaret platformlarının potansiyelini en üst seviyeye çıkarıyoruz.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">İşletmelere özel e-ticaret çözümleri</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Kullanıcı deneyimi odaklı tasarım</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Sürekli geliştirme ve destek</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-primary-600" />
                  Vizyonumuz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Türkiye ve dünya genelinde e-ticaret sektörünün öncü platformlarından biri 
                  haline gelmek, inovasyonu ve teknolojik excellence'ı bir araya getirerek 
                  sektör standartlarını yeniden tanımlamak istiyoruz.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Sektörde liderlik ve öncülük</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Uluslararası pazar payı</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Teknoloji ve inovasyon ödülleri</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ElegantCommerce'i ayakta tutan temel değerler ve ilkelerimiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Founders */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
              Kurucu Ortaklarımız
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ElegantCommerce'i hayata geçiren uzman kurucu ortaklarımız ve liderlik ekibimiz
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{founder.name}</h3>
                      <p className="text-primary-600 font-medium mb-4">{founder.position}</p>
                      <p className="text-gray-600 mb-4 leading-relaxed">{founder.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {founder.expertise.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
              Teknik Özelliklerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern teknolojiler ve en iyi pratiklerle geliştirilen platform özelliklerimiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {achievement.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
                  Teknoloji Stack'imiz
                </h2>
                <p className="text-xl text-gray-600">
                  En modern teknolojiler ve araçlarla geliştirilen güçlü altyapı
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Frontend</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>React 18 + TypeScript</p>
                    <p>TailwindCSS + shadcn/ui</p>
                    <p>TanStack Query</p>
                    <p>Vite Build Tool</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Backend</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>.NET 8 Web API</p>
                    <p>Entity Framework Core</p>
                    <p>SQL Server</p>
                    <p>JWT Authentication</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">DevOps & Tools</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Azure Cloud Platform</p>
                    <p>Git Version Control</p>
                    <p>Swagger API Docs</p>
                    <p>Docker Containerization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">
                Bizimle Bir Proje Başlatalım
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                E-ticaret hedeflerinizi gerçekleştirmek için uzman ekibimizle çalışın. 
                Ücretsiz danışmanlık için bizimle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="btn-primary">
                    <Users className="w-4 h-4 mr-2" />
                    İletişime Geçin
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ürünleri İncele
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
