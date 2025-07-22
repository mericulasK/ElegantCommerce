import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Star,
  MessageSquare,
  Plus
} from "lucide-react";
import SellerProductManagement from "@/components/seller/product-management";
import SellerOrderManagement from "@/components/seller/order-management";
import SellerReportsPanel from "@/components/seller/reports-panel";
import SellerPromotions from "@/components/seller/promotions";
import SellerReviews from "@/components/seller/customer-reviews";
import SellerProfile from "@/components/seller/profile";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch seller statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/seller/stats"],
  });

  // Fetch seller data
  const { data: sellerProducts } = useQuery({
    queryKey: ["/api/seller/products"],
  });

  const { data: sellerOrders } = useQuery({
    queryKey: ["/api/seller/orders"],
  });

  const { data: sellerReviews } = useQuery({
    queryKey: ["/api/seller/reviews"],
  });

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

  const totalProducts = Array.isArray(sellerProducts) ? sellerProducts.length : 0;
  const totalOrders = Array.isArray(sellerOrders) ? sellerOrders.length : 0;
  const totalRevenue = Array.isArray(sellerOrders) ? sellerOrders.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount || "0"), 0) : 0;
  const averageRating = Array.isArray(sellerReviews) && sellerReviews.length > 0 ? sellerReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / sellerReviews.length : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your products, orders, and business</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
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
                  <ShoppingCart className="h-8 w-8 text-green-500" />
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
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
                  {Array.isArray(sellerOrders) ? sellerOrders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">${order.totalAmount}</p>
                      </div>
                      <Badge 
                        variant={order.status === 'delivered' ? 'default' : 'secondary'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-8">No recent orders</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Reviews</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("reviews")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(sellerReviews) ? sellerReviews.slice(0, 5).map((review: any) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {review.productName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-8">No recent reviews</p>
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
                  <Button onClick={() => setActiveTab("products")} className="h-20">
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <span>Add New Product</span>
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("promotions")} className="h-20">
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                      <span>Create Promotion</span>
                    </div>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("reports")} className="h-20">
                    <div className="text-center">
                      <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                      <span>View Reports</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <SellerProductManagement />
        </TabsContent>

        <TabsContent value="orders">
          <SellerOrderManagement />
        </TabsContent>

        <TabsContent value="reports">
          <SellerReportsPanel />
        </TabsContent>

        <TabsContent value="promotions">
          <SellerPromotions />
        </TabsContent>

        <TabsContent value="reviews">
          <SellerReviews />
        </TabsContent>

        <TabsContent value="profile">
          <SellerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
