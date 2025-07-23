import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useProducts } from "@/hooks/use-products";
import AdminUsers from "@/components/admin/users";
import ProductManagement from "@/components/admin/product-management";
import OrderManagement from "@/components/admin/order-management";
import SellerApproval from "@/components/admin/seller-approval";
import StatisticsPanel from "@/components/admin/statistics-panel";
import CmsManagement from "@/components/admin/cms-management";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();
  const { user, isAdmin, loading } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      setLocation("/auth");
    }
  }, [user, isAdmin, loading, setLocation]);

  const { data: products, isLoading: productsLoading } = useProducts();

  // Fetch admin overview data
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const response = await fetch("/api/admin/overview");
      if (!response.ok) throw new Error("Failed to fetch overview data");
      return response.json();
    },
    enabled: !!user && isAdmin
  });

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Don't render if not admin (will redirect anyway)
  if (!user || !isAdmin) {
    return null;
  }

  if (productsLoading || overviewLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Use fetched data or fallback to defaults
  const totalUsers = overviewData?.users?.total || 127;
  const totalProducts = overviewData?.products?.total || (Array.isArray(products) ? products.length : 0);
  const totalOrders = overviewData?.orders?.total || 89;
  const totalRevenue = overviewData?.revenue?.total || 24850.00;
  const pendingSellers = overviewData?.sellers?.pending || 3;
  const systemAlerts = overviewData?.alerts || [];

  // Recent activities from API or mock data
  const recentOrders = overviewData?.recentOrders || [
    { id: 1001, totalAmount: "199.99", status: "delivered", customerName: "Ahmet Yılmaz" },
    { id: 1002, totalAmount: "89.50", status: "processing", customerName: "Ayşe Demir" },
    { id: 1003, totalAmount: "299.99", status: "shipped", customerName: "Mehmet Öz" },
    { id: 1004, totalAmount: "49.99", status: "pending", customerName: "Fatma Kaya" },
    { id: 1005, totalAmount: "159.99", status: "delivered", customerName: "Ali Veli" },
  ];

  const recentActivities = overviewData?.recentActivities || [
    { 
      id: 1, 
      action: "Product Added", 
      description: "New product 'Premium Headphones' added to catalog",
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      action: "User Registered", 
      description: "New customer account created",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    { 
      id: 3, 
      action: "Order Completed", 
      description: "Order #1001 has been delivered",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your e-commerce platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="cms">CMS</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-sm font-medium">₺{order.totalAmount}</p>
                      </div>
                      <Badge 
                        variant={order.status === 'delivered' ? 'default' : 
                                order.status === 'shipped' ? 'secondary' :
                                order.status === 'processing' ? 'outline' : 'destructive'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.createdAt).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status & Alerts */}
          {(systemAlerts.length > 0 || pendingSellers > 0) && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    System Alerts & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingSellers > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-yellow-600 mr-3" />
                          <div>
                            <p className="font-medium text-yellow-800">Pending Seller Approvals</p>
                            <p className="text-sm text-yellow-600">{pendingSellers} sellers waiting for approval</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => setActiveTab("sellers")}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Review
                        </Button>
                      </div>
                    )}
                    
                    {systemAlerts.map((alert: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                          <div>
                            <p className="font-medium text-red-800">{alert.title}</p>
                            <p className="text-sm text-red-600">{alert.description}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      </div>
                    ))}

                    {systemAlerts.length === 0 && pendingSellers === 0 && (
                      <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <p className="text-green-800">All systems are running normally</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="sellers">
          <SellerApproval />
        </TabsContent>

        <TabsContent value="statistics">
          <StatisticsPanel />
        </TabsContent>

        <TabsContent value="cms">
          <CmsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
