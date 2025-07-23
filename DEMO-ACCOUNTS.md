# 🔐 ElegantCommerce - Demo Test Hesapları

Bu dokümanda sitenizin test edilmesi için kullanılabilecek demo hesap bilgileri bulunmaktadır.

**🌟 Tüm demo hesapları aktif olarak çalışmaktadır ve giriş yapılabilir.**

## 🚀 Hızlı Test

**Server URL**: `http://localhost:3001`

### API Test Komutları:
```bash
# Admin giriş testi
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@elegantcommerce.com","password":"Admin123!"}'

# Seller giriş testi  
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"seller1@elegantcommerce.com","password":"Seller123!"}'

# Customer giriş testi
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"customer1@elegantcommerce.com","password":"Customer123!"}'
```

## 👑 Admin Hesabı

### **Admin - Sistem Yöneticisi**
- **Email**: `admin@elegantcommerce.com`
- **Şifre**: `Admin123!`
- **Rol**: Admin
- **✅ Durum**: Aktif ve Çalışıyor
- **Yetkileri**: 
  - Kullanıcı yönetimi (ekleme, silme, düzenleme)
  - Ürün yönetimi
  - Sipariş takibi ve yönetimi
  - Satıcı onayları
  - İstatistikler ve raporlar
  - Sistem ayarları

---

## 👨‍💼 Seller (Satıcı) Hesapları

### **Seller 1 - Onaylanmış Satıcı**
- **Email**: `seller1@elegantcommerce.com`
- **Şifre**: `Seller123!`
- **Ad Soyad**: `Elite Designer`
- **Firma**: `EliteDesign Store`
- **Rol**: Seller (Approved)
- **✅ Durum**: Aktif ve Çalışıyor
- **Yetkileri**:
  - Ürün ekleme/düzenleme/silme
  - Sipariş takibi ve işleme
  - Müşteri yorumlarını görüntüleme/yanıtlama
  - Satış raporları
  - Promosyon oluşturma

---

## 👨‍👩‍👧‍👦 Customer (Müşteri) Hesapları

### **Customer 1 - Aktif Müşteri**
- **Email**: `customer1@elegantcommerce.com`
- **Şifre**: `Customer123!`
- **Ad Soyad**: `Ali Yılmaz`
- **Rol**: Customer
- **✅ Durum**: Aktif ve Çalışıyor
- **Yetkileri**:
  - Ürün görüntüleme ve satın alma
  - Sepet yönetimi
  - Sipariş geçmişi görüntüleme
  - Adres yönetimi
  - Yorum ve değerlendirme yazma
  - Favori ürünler

### **Test Admin - Ek Test Hesabı**
- **Email**: `testadmin@test.com`
- **Şifre**: `TestAdmin123!`
- **Ad Soyad**: `Test Admin User`
- **Rol**: Admin
- **✅ Durum**: Aktif ve Çalışıyor
- **Amaç**: Alternatif admin testi için

---

## 🔐 Yeni Hesap Oluşturma

### **Siteden Kayıt Olmak**
1. Ana sayfada **"Kayıt Ol"** butonuna tıklayın
2. Gerekli bilgileri doldurun (email, şifre, ad-soyad)
3. Kayıt işlemi tamamlandıktan sonra otomatik giriş yapılır
4. Yeni hesaplar **"Customer"** rolü ile oluşturulur

### **API ile Kayıt Testi**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser", 
    "email": "testuser@example.com", 
    "password": "TestUser123!"
  }'
```

---

## 🛠️ Test Senaryoları

### **Admin Testi**
1. Admin hesabı ile giriş yapın
2. `/admin` sayfasına erişiminizi kontrol edin
3. Kullanıcı listesini görüntüleyin
4. Yeni ürün eklemeyi deneyin

### **Seller Testi**
1. Seller hesabı ile giriş yapın  
2. `/seller` sayfasına erişiminizi kontrol edin
3. Ürün yönetimi panelini test edin
4. Sipariş takibini kontrol edin

### **Customer Testi**
1. Customer hesabı ile giriş yapın
2. Ürünleri görüntüleyin (12 ürün mevcut)
3. Sepete ürün eklemeyi deneyin
4. Profil ayarlarınızı kontrol edin

---

## 🚨 Önemli Notlar

- **✅ Tüm demo hesapları test edilmiş ve çalışır durumda**
- **✅ Yeni kullanıcı kaydı frontend ve API'den mümkün**
- **✅ Giriş/çıkış sistemi tam fonksiyonel**
- **✅ Rol bazlı erişim kontrolleri aktif**
- Server `http://localhost:3001` adresinde çalışmalıdır
- Demo veriler bellekte tutulur (yeniden başlatmada sıfırlanır)
- Gerçek projelerde şifreler hash'lenerek saklanmalıdır

---

## 🔄 Son Güncelleme

**Tarih**: 2024-12-27  
**Versiyon**: 1.1.4  
**Durum**: Tüm hesaplar test edildi ve aktif  
**Test Edilen Özellikler**: 
- ✅ Demo hesap girişleri
- ✅ Yeni kullanıcı kaydı  
- ✅ API endpoint'leri
- ✅ Rol bazlı dashboard erişimi
- ✅ Ürün görüntüleme (12 ürün)

**Test Komutu**:
```bash
npm run dev  # Projeyi çalıştırın
# http://localhost:3001 adresini ziyaret edin
```
- **Özellikler**: Geçmiş siparişleri olan aktif müşteri

### **Customer 2 - Yeni Müşteri**
- **Email**: `customer2@elegantcommerce.com`
- **Şifre**: `Customer456!`
- **Ad Soyad**: `Ayşe Demir`
- **Rol**: Customer
- **Özellikler**: Yeni kayıt olan müşteri

### **Customer 3 - VIP Müşteri**
- **Email**: `vip@elegantcommerce.com`
- **Şifre**: `VipCustomer789!`
- **Ad Soyad**: `Mehmet Kaya`
- **Rol**: Customer
- **Özellikler**: Yüksek alışveriş geçmişi olan VIP müşteri

---

## 🧪 Test Hesapları

### **Test Admin**
- **Email**: `testadmin@test.com`
- **Şifre**: `Test123!`
- **Rol**: Admin
- **Amaç**: Geliştirme ve test amaçlı

### **Test Seller**
- **Email**: `testseller@test.com`
- **Şifre**: `Test123!`
- **Rol**: Seller
- **Amaç**: Satıcı özelliklerini test etmek için

### **Test Customer**
- **Email**: `testcustomer@test.com`
- **Şifre**: `Test123!`
- **Rol**: Customer
- **Amaç**: Müşteri deneyimini test etmek için

---

## 🔧 Test Senaryoları

### **Admin Test Senaryoları:**
1. Admin olarak giriş yapın
2. Kullanıcı yönetimi bölümünden yeni kullanıcı ekleyin
3. Bekleyen satıcı başvurularını onaylayın
4. Sistem istatistiklerini kontrol edin
5. Ürün yönetimi yapın

### **Seller Test Senaryoları:**
1. Seller olarak giriş yapın
2. Yeni ürün ekleyin
3. Mevcut ürünleri düzenleyin
4. Siparişleri kontrol edin ve durumlarını güncelleyin
5. Müşteri yorumlarını görüntüleyin

### **Customer Test Senaryoları:**
1. Customer olarak giriş yapın
2. Ürünleri görüntüleyin ve filtreleme yapın
3. Sepete ürün ekleyin
4. Sipariş verin
5. Profil bilgilerini güncelleyin
6. Ürünlere yorum yapın

---

## ⚠️ Güvenlik Notları

- **Üretim ortamında bu hesapları kullanmayın!**
- **Bu hesaplar sadece test amaçlıdır**
- **Gerçek üretim ortamına geçmeden önce bu hesapları silin**
- **Güçlü ve benzersiz şifreler kullanın**
- **Admin hesabı için 2FA (iki faktörlü kimlik doğrulama) aktif edin**

---

## 📊 Database Seeding

Bu hesaplar aşağıdaki şekilde database'e eklenmelidir:

### SQL Server (.NET Backend) için:
```sql
-- Yukarıdaki hesapları database'e eklemek için migration oluşturun
-- veya Entity Framework seed data kullanın
```

### PostgreSQL (Node.js Backend) için:
```javascript
// server/seed.ts dosyasına bu kullanıcıları ekleyin
```

---

## 🆘 Sorun Giderme

### Giriş Yapamıyorsanız:
1. Email adresini doğru yazdığınızdan emin olun
2. Şifrede büyük/küçük harf duyarlılığına dikkat edin
3. Database'de kullanıcının mevcut olduğunu kontrol edin
4. Backend servisinin çalıştığından emin olun

### Yetki Sorunları:
1. Kullanıcının doğru role sahip olduğunu kontrol edin
2. Satıcı hesabının admin tarafından onaylandığından emin olun
3. JWT token'ın geçerli olduğunu kontrol edin

---

## 📞 İletişim

Demo hesaplarla ilgili sorunlar için:
- **Email**: mericulas1@gmail.com
- **GitHub**: [ElegantCommerce Repository](https://github.com/mericulasK/ElegantCommerce)

---

**Son Güncelleme**: 23 Temmuz 2025
**Versiyon**: 1.1.1
