import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  MapPin, 
  Package, 
  CheckCircle, 
  ArrowLeft,
  Truck
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

interface CheckoutFormData {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  };
  notes?: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
  onBack: () => void;
}

export default function Checkout({ cartItems, onBack }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "Turkey"
    },
    paymentMethod: "credit_card",
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolderName: ""
    },
    notes: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );
  const shippingCost = subtotal > 500 ? 0 : 25; // Free shipping over ₺500
  const taxRate = 0.18; // 18% KDV
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setStep(4); // Order confirmation step
      toast({
        title: "Sipariş Başarılı!",
        description: `Sipariş numaranız: #${order.orderNumber}`
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Sipariş oluşturulurken bir hata oluştu.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  });

  const handleSubmit = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submission
    setIsProcessing(true);
    
    const orderData = {
      userId: user?.id,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: total.toFixed(2),
      shippingAddress: `${formData.shippingAddress.fullName}\n${formData.shippingAddress.address}\n${formData.shippingAddress.city}, ${formData.shippingAddress.postalCode}\n${formData.shippingAddress.country}\nTel: ${formData.shippingAddress.phone}`,
      paymentMethod: formData.paymentMethod === "credit_card" ? "Kredi Kartı" : 
                    formData.paymentMethod === "debit_card" ? "Banka Kartı" :
                    formData.paymentMethod === "bank_transfer" ? "Havale/EFT" : "Kapıda Ödeme",
      notes: formData.notes
    };

    createOrderMutation.mutate(orderData);
  };

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const updateCardDetails = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails!,
        [field]: value
      }
    }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz Boş</h3>
            <p className="text-gray-600 mb-4">Ödeme yapabilmek için sepetinize ürün eklemelisiniz.</p>
            <Button onClick={() => setLocation("/")}>
              Alışverişe Başla
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Sepete Dön
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
        <p className="text-gray-600 mt-2">Siparişinizi tamamlayın</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="grid grid-cols-4 gap-4 text-sm text-center">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Teslimat</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Ödeme</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Özet</span>
            <span className={step >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Tamamlandı</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Teslimat Adresi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ad Soyad *</label>
                    <Input
                      value={formData.shippingAddress.fullName}
                      onChange={(e) => updateShippingAddress('fullName', e.target.value)}
                      placeholder="Tam adınızı girin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon *</label>
                    <Input
                      type="tel"
                      value={formData.shippingAddress.phone}
                      onChange={(e) => updateShippingAddress('phone', e.target.value)}
                      placeholder="0555 123 45 67"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Adres *</label>
                  <Textarea
                    value={formData.shippingAddress.address}
                    onChange={(e) => updateShippingAddress('address', e.target.value)}
                    placeholder="Mahalle, sokak, bina no, daire no"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Şehir *</label>
                    <Input
                      value={formData.shippingAddress.city}
                      onChange={(e) => updateShippingAddress('city', e.target.value)}
                      placeholder="İstanbul"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Posta Kodu *</label>
                    <Input
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) => updateShippingAddress('postalCode', e.target.value)}
                      placeholder="34000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ülke *</label>
                    <Select value={formData.shippingAddress.country} onValueChange={(value) => updateShippingAddress('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Turkey">Türkiye</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Ödeme Yöntemi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === "credit_card"}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Kredi Kartı</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard kabul edilir</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="debit_card"
                      checked={formData.paymentMethod === "debit_card"}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Banka Kartı</div>
                      <div className="text-sm text-gray-600">Banka kartı ile ödeme</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === "cash_on_delivery"}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    />
                    <Package className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Kapıda Ödeme</div>
                      <div className="text-sm text-gray-600">Nakit veya kart ile ödeme</div>
                    </div>
                  </label>
                </div>

                {(formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">Kart Sahibinin Adı *</label>
                      <Input
                        value={formData.cardDetails?.cardHolderName || ""}
                        onChange={(e) => updateCardDetails('cardHolderName', e.target.value)}
                        placeholder="Kartta yazılı isim"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Kart Numarası *</label>
                      <Input
                        value={formData.cardDetails?.cardNumber || ""}
                        onChange={(e) => updateCardDetails('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Son Kullanma *</label>
                        <Input
                          value={formData.cardDetails?.expiryDate || ""}
                          onChange={(e) => updateCardDetails('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV *</label>
                        <Input
                          value={formData.cardDetails?.cvv || ""}
                          onChange={(e) => updateCardDetails('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipping Address Summary */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Teslimat Adresi
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="font-medium">{formData.shippingAddress.fullName}</p>
                    <p>{formData.shippingAddress.address}</p>
                    <p>{formData.shippingAddress.city}, {formData.shippingAddress.postalCode}</p>
                    <p>{formData.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Payment Method Summary */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ödeme Yöntemi
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <p>
                      {formData.paymentMethod === "credit_card" ? "Kredi Kartı" :
                       formData.paymentMethod === "debit_card" ? "Banka Kartı" :
                       formData.paymentMethod === "bank_transfer" ? "Havale/EFT" : "Kapıda Ödeme"}
                    </p>
                    {formData.cardDetails?.cardNumber && (
                      <p>**** **** **** {formData.cardDetails.cardNumber.slice(-4)}</p>
                    )}
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sipariş Notları (Opsiyonel)</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Sipariş için özel talimatlarınız varsa yazabilirsiniz"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h3>
                <p className="text-gray-600 mb-6">
                  Siparişiniz başarıyla oluşturuldu. Kargo takip bilgileri e-posta adresinize gönderilecektir.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setLocation("/customer/orders")}>
                    Siparişlerimi Görüntüle
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/")}>
                    Alışverişe Devam Et
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × ₺{parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ₺{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cost Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    Kargo
                  </span>
                  <span>
                    {shippingCost === 0 ? (
                      <Badge variant="secondary">Ücretsiz</Badge>
                    ) : (
                      `₺${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>KDV (%18)</span>
                  <span>₺{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
              </div>

              {step < 4 && (
                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "İşleniyor..." : 
                   step === 3 ? "Siparişi Tamamla" : "Devam Et"}
                </Button>
              )}

              {step > 1 && step < 4 && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep(step - 1)} 
                  className="w-full"
                >
                  Geri
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
