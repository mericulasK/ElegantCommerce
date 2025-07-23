import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: Array<{ month: string; amount: number }>;
  };
  orders: {
    total: number;
    growth: number;
    pending: number;
    completed: number;
    cancelled: number;
    monthly: Array<{ month: string; count: number }>;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    topSelling: Array<{
      id: number;
      name: string;
      image: string;
      sold: number;
      revenue: number;
    }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    topCustomers: Array<{
      id: number;
      name: string;
      email: string;
      orders: number;
      totalSpent: number;
    }>;
  };
}

export default function SellerAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const { user } = useAuth();

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["seller-analytics", user?.id, timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      if (!user?.id) throw new Error("User not logged in");
      const response = await fetch(`/api/seller/analytics/${user.id}?range=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Veri bulunamadı</h3>
          <p className="text-gray-600">Analitik verileriniz yüklenemedi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analitik Dashboard</h1>
          <p className="text-gray-600 mt-2">Mağazanızın performansını takip edin</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Son 7 Gün</SelectItem>
            <SelectItem value="30d">Son 30 Gün</SelectItem>
            <SelectItem value="90d">Son 3 Ay</SelectItem>
            <SelectItem value="1y">Son 1 Yıl</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold">₺{analytics.revenue.total.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  {analytics.revenue.growth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${analytics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.revenue.growth >= 0 ? '+' : ''}{analytics.revenue.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold">{analytics.orders.total}</p>
                <div className="flex items-center mt-2">
                  {analytics.orders.growth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${analytics.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.orders.growth >= 0 ? '+' : ''}{analytics.orders.growth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif Ürün</p>
                <p className="text-2xl font-bold">{analytics.products.active}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {analytics.products.total} toplam ürün
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Müşteri Sayısı</p>
                <p className="text-2xl font-bold">{analytics.customers.total}</p>
                <p className="text-sm text-green-600 mt-2">
                  +{analytics.customers.new} yeni müşteri
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="products">Ürün Analizi</TabsTrigger>
          <TabsTrigger value="customers">Müşteri Analizi</TabsTrigger>
          <TabsTrigger value="orders">Sipariş Analizi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Aylık Gelir Trendi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenue.monthly.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(item.amount / Math.max(...analytics.revenue.monthly.map(m => m.amount))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold min-w-[60px] text-right">
                          ₺{item.amount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Sipariş Durumu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                      <span>Tamamlanan</span>
                    </div>
                    <span className="font-bold">{analytics.orders.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                      <span>Bekleyen</span>
                    </div>
                    <span className="font-bold">{analytics.orders.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                      <span>İptal Edilen</span>
                    </div>
                    <span className="font-bold">{analytics.orders.cancelled}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{((analytics.orders.completed / analytics.orders.total) * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Tamamlanma Oranı</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.products.lowStock}</p>
                <p className="text-sm text-gray-600">Düşük Stoklu Ürün</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.customers.returning}</p>
                <p className="text-sm text-gray-600">Sadık Müşteri</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>En Çok Satan Ürünler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.products.topSelling.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.sold} adet satıldı</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₺{product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Gelir</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>En Değerli Müşteriler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.customers.topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{customer.orders}</p>
                      <p className="text-sm text-gray-600">Sipariş</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₺{customer.totalSpent.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Toplam Harcama</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Aylık Sipariş Trendi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.orders.monthly.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(item.count / Math.max(...analytics.orders.monthly.map(m => m.count))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold min-w-[40px] text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
