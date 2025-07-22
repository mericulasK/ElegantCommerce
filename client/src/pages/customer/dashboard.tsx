import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  Heart, 
  User,
  Star,
  Clock,
  CheckCircle,
  Truck,
  CreditCard
} from "lucide-react";
import CustomerProfile from "@/components/customer/profile";
import CustomerOrders from "@/components/customer/orders";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  favoriteProducts: number;
  recentOrders: RecentOrder[];
  recommendations: ProductRecommendation[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number;
  status: string;
  itemCount: number;
}

interface ProductRecommendation {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["customer-dashboard-stats"],
    queryFn: async () => {
      const response = await fetch("/api/customer/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalOrders: 15,
    pendingOrders: 2,
    completedOrders: 12,
    totalSpent: 1547.80,
    favoriteProducts: 8,
    recentOrders: [
      {
        id: "1",
        orderNumber: "ORD-2024-001",
        date: "2024-01-20T10:30:00Z",
        totalAmount: 299.99,
        status: "delivered",
        itemCount: 1
      },
      {
        id: "2",
        orderNumber: "ORD-2024-002",
        date: "2024-01-18T15:45:00Z",
        totalAmount: 89.99,
        status: "shipped",
        itemCount: 1
      },
      {
        id: "3",
        orderNumber: "ORD-2024-003",
        date: "2024-01-15T09:20:00Z",
        totalAmount: 45.99,
        status: "processing",
        itemCount: 2
      }
    ],
    recommendations: [
      {
        id: "1",
        name: "Premium Wireless Earbuds",
        price: 129.99,
        image: "/products/earbuds.jpg",
        rating: 4.5,
        reviewCount: 234
      },
      {
        id: "2",
        name: "Smart Phone Case",
        price: 24.99,
        image: "/products/phone-case.jpg",
        rating: 4.8,
        reviewCount: 89
      },
      {
        id: "3",
        name: "Portable Charger",
        price: 39.99,
        image: "/products/charger.jpg",
        rating: 4.6,
        reviewCount: 156
      }
    ]
  };

  const dashboardStats = stats || mockStats;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (statsLoading) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your account</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">${dashboardStats.totalSpent.toFixed(2)}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Favorite Items</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.favoriteProducts}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("orders")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats.recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent orders</p>
                  ) : (
                    dashboardStats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order {order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString()} • {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                          </p>
                          <p className="text-sm font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats.recommendations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recommendations available</p>
                  ) : (
                    dashboardStats.recommendations.map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {renderStars(product.rating)}
                            </div>
                            <span className="text-xs text-gray-600">({product.reviewCount})</span>
                          </div>
                          <p className="font-semibold text-sm text-gray-900">${product.price.toFixed(2)}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="default" className="h-20">
                    <div className="text-center">
                      <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                      <span>Browse Products</span>
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("orders")} className="h-20">
                    <div className="text-center">
                      <Package className="w-6 h-6 mx-auto mb-2" />
                      <span>Track Orders</span>
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("profile")} className="h-20">
                    <div className="text-center">
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span>Update Profile</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <CustomerOrders />
        </TabsContent>

        <TabsContent value="profile">
          <CustomerProfile />
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>Your wishlist is empty</p>
                <p className="text-sm">Start adding items you love!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
