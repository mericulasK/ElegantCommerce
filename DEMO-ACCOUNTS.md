# 🔐 ElegantCommerce - Demo Test Hesapları

Bu dokümanda sitenizin test edilmesi için kullanılabilecek demo hesap bilgileri bulunmaktadır.

## 👑 Admin Hesabı

### **Admin - Sistem Yöneticisi**
- **Email**: `admin@elegantcommerce.com`
- **Şifre**: `Admin123!`
- **Rol**: Admin
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
- **Firma**: `EliteDesign Store`
- **Rol**: Seller (Approved)
- **Yetkileri**:
  - Ürün ekleme/düzenleme/silme
  - Sipariş takibi ve işleme
  - Müşteri yorumlarını görüntüleme/yanıtlama
  - Satış raporları
  - Promosyon oluşturma

### **Seller 2 - Beklemede Satıcı**
- **Email**: `seller2@elegantcommerce.com`
- **Şifre**: `Seller456!`
- **Firma**: `Fashion World`
- **Rol**: Seller (Pending Approval)
- **Durum**: Admin onayı bekliyor

---

## 👨‍👩‍👧‍👦 Customer (Müşteri) Hesapları

### **Customer 1 - Aktif Müşteri**
- **Email**: `customer1@elegantcommerce.com`
- **Şifre**: `Customer123!`
- **Ad Soyad**: `Ali Yılmaz`
- **Rol**: Customer
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
