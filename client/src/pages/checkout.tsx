import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  MapPin, 
  Package, 
  Lock,
  CheckCircle,
  ArrowLeft,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/hooks/use-cart";

interface CheckoutFormData {
  // Shipping Address
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  // Billing Address
  billingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  sameAsShipping: boolean;
  // Payment
  paymentMethod: "card" | "paypal" | "apple_pay";
  cardDetails: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    name: string;
  };
  // Order Notes
  orderNotes: string;
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  // Show loading or return early if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <UserCheck className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-bold font-serif text-primary-900 mb-4">
            Please Sign In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be signed in to proceed with checkout.
          </p>
          <Link href="/login">
            <Button className="btn-primary">
              Sign In to Continue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Package className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-bold font-serif text-primary-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link href="/products">
            <Button className="btn-primary">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: user?.phoneNumber || ""
    },
    billingAddress: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: user?.phoneNumber || ""
    },
    sameAsShipping: true,
    paymentMethod: "card",
    cardDetails: {
      number: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      name: user ? `${user.firstName} ${user.lastName}` : ""
    },
    orderNotes: ""
  });

  // Fetch user addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ["customer-addresses"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await fetch("/api/customer/addresses");
      if (!response.ok) throw new Error("Failed to fetch addresses");
      return response.json();
    },
    enabled: isAuthenticated
  });

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error("Failed to place order");
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.orderNumber} has been confirmed.`
      });
      setLocation(`/customer/orders`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof CheckoutFormData] as any),
        [field]: value
      }
    }));
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to place an order.",
        variant: "destructive"
      });
      setLocation("/auth");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.product.price)
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
        paymentMethod: formData.paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        orderNotes: formData.orderNotes
      };

      placeOrderMutation.mutate(orderData);
      setIsProcessing(false);
    }, 2000);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Shipping
        const shipping = formData.shippingAddress;
        return !!(shipping.firstName && shipping.lastName && shipping.street && 
                 shipping.city && shipping.state && shipping.zipCode);
      case 2: // Payment
        if (formData.paymentMethod === "card") {
          const card = formData.cardDetails;
          return !!(card.number && card.expiryMonth && card.expiryYear && 
                   card.cvv && card.name);
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout</p>
            <Button onClick={() => setLocation("/products")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setLocation("/cart")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step <= currentStep 
                ? "bg-primary text-white border-primary" 
                : "border-gray-300 text-gray-300"
            }`}>
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? "bg-primary" : "bg-gray-300"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 && (
                  <div className="mb-6">
                    <Label className="text-base font-medium mb-3 block">Saved Addresses</Label>
                    <div className="space-y-2">
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              shippingAddress: {
                                firstName: user?.firstName || "",
                                lastName: user?.lastName || "",
                                street: address.street,
                                city: address.city,
                                state: address.state,
                                zipCode: address.zipCode,
                                country: address.country,
                                phone: user?.phoneNumber || ""
                              }
                            }));
                          }}
                        >
                          <div className="font-medium">{address.title}</div>
                          <div className="text-sm text-gray-600">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </div>
                          {address.isDefault && (
                            <Badge className="mt-1">Default</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.shippingAddress.firstName}
                      onChange={(e) => handleInputChange("shippingAddress", "firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.shippingAddress.lastName}
                      onChange={(e) => handleInputChange("shippingAddress", "lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.shippingAddress.street}
                    onChange={(e) => handleInputChange("shippingAddress", "street", e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleInputChange("shippingAddress", "city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleInputChange("shippingAddress", "state", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => handleInputChange("shippingAddress", "zipCode", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.shippingAddress.phone}
                      onChange={(e) => handleInputChange("shippingAddress", "phone", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, sameAsShipping: !!checked }))
                    }
                  />
                  <Label htmlFor="sameAsShipping">Billing address same as shipping</Label>
                </div>

                <RadioGroup 
                  value={formData.paymentMethod} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, paymentMethod: value as any }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="apple_pay" id="apple_pay" />
                    <Label htmlFor="apple_pay">Apple Pay</Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === "card" && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={formData.cardDetails.name}
                        onChange={(e) => handleInputChange("cardDetails", "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardDetails.number}
                        onChange={(e) => handleInputChange("cardDetails", "number", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month</Label>
                        <Input
                          id="expiryMonth"
                          value={formData.cardDetails.expiryMonth}
                          onChange={(e) => handleInputChange("cardDetails", "expiryMonth", e.target.value)}
                          placeholder="MM"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Year</Label>
                        <Input
                          id="expiryYear"
                          value={formData.cardDetails.expiryYear}
                          onChange={(e) => handleInputChange("cardDetails", "expiryYear", e.target.value)}
                          placeholder="YY"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cardDetails.cvv}
                          onChange={(e) => handleInputChange("cardDetails", "cvv", e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod !== "card" && (
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-blue-800">
                      You'll be redirected to {formData.paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} to complete your payment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    {formData.shippingAddress.firstName} {formData.shippingAddress.lastName}<br />
                    {formData.shippingAddress.street}<br />
                    {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.zipCode}<br />
                    {formData.shippingAddress.phone}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="text-sm text-gray-600">
                    {formData.paymentMethod === "card" && "Credit/Debit Card"}
                    {formData.paymentMethod === "paypal" && "PayPal"}
                    {formData.paymentMethod === "apple_pay" && "Apple Pay"}
                  </div>
                </div>

                <div>
                  <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                  <Textarea
                    id="orderNotes"
                    value={formData.orderNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, orderNotes: e.target.value }))}
                    placeholder="Special delivery instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep < 3 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handlePlaceOrder}
                disabled={isProcessing || placeOrderMutation.isPending}
                className="min-w-32"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Place Order
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img 
                      src={item.product.image || "/placeholder-image.jpg"} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {shipping === 0 && (
                <div className="text-sm text-green-600 text-center">
                  🎉 You qualify for free shipping!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
