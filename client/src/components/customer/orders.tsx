import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RotateCcw,
  MessageSquare,
  Search,
  Eye,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  canReturn: boolean;
  canReview: boolean;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  sellerId: string;
  sellerName: string;
  hasReview?: boolean;
}

interface ReturnRequest {
  orderId: string;
  itemIds: string[];
  reason: string;
  description: string;
}

interface Review {
  productId: string;
  rating: number;
  comment: string;
}

export default function CustomerOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [returnForm, setReturnForm] = useState<ReturnRequest>({
    orderId: "",
    itemIds: [],
    reason: "",
    description: ""
  });
  const [reviewForm, setReviewForm] = useState<Review>({
    productId: "",
    rating: 5,
    comment: ""
  });
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customer orders
  const { data: orders = [], isLoading } = useQuery<CustomerOrder[]>({
    queryKey: ["customer-orders"],
    queryFn: async () => {
      const response = await fetch("/api/customer/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockOrders: CustomerOrder[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      createdAt: "2024-01-20T10:30:00Z",
      totalAmount: 299.99,
      status: "delivered",
      shippingAddress: {
        street: "456 Oak Street, Apt 2B",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States"
      },
      items: [
        {
          id: "1",
          productId: "p1",
          productName: "Wireless Bluetooth Headphones",
          productImage: "/products/headphones.jpg",
          quantity: 1,
          price: 299.99,
          sellerId: "s1",
          sellerName: "Tech Haven Store"
        }
      ],
      trackingNumber: "1Z999AA1234567890",
      deliveredAt: "2024-01-25T14:30:00Z",
      canReturn: true,
      canReview: true
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      createdAt: "2024-01-18T15:45:00Z",
      totalAmount: 89.99,
      status: "shipped",
      shippingAddress: {
        street: "456 Oak Street, Apt 2B",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States"
      },
      items: [
        {
          id: "2",
          productId: "p2",
          productName: "Smart Fitness Watch",
          productImage: "/products/fitness-watch.jpg",
          quantity: 1,
          price: 89.99,
          sellerId: "s2",
          sellerName: "FitTech Solutions"
        }
      ],
      trackingNumber: "1Z999AA1234567891",
      estimatedDelivery: "2024-01-28T00:00:00Z",
      canReturn: false,
      canReview: false
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      createdAt: "2024-01-15T09:20:00Z",
      totalAmount: 45.99,
      status: "processing",
      shippingAddress: {
        street: "456 Oak Street, Apt 2B",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States"
      },
      items: [
        {
          id: "3",
          productId: "p3",
          productName: "USB-C Charging Cable",
          productImage: "/products/usb-cable.jpg",
          quantity: 2,
          price: 22.99,
          sellerId: "s1",
          sellerName: "Tech Haven Store"
        }
      ],
      canReturn: false,
      canReview: false
    }
  ];

  const ordersData = orders.length > 0 ? orders : mockOrders;

  // Return request mutation
  const createReturnMutation = useMutation({
    mutationFn: async (returnData: ReturnRequest) => {
      const response = await fetch("/api/customer/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnData)
      });
      if (!response.ok) throw new Error("Failed to create return request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      setIsReturnDialogOpen(false);
      setReturnForm({ orderId: "", itemIds: [], reason: "", description: "" });
      toast({
        title: "Success",
        description: "Return request submitted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit return request",
        variant: "destructive"
      });
    }
  });

  // Review submission mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: Review) => {
      const response = await fetch("/api/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) throw new Error("Failed to create review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      setIsReviewDialogOpen(false);
      setReviewForm({ productId: "", rating: 5, comment: "" });
      setSelectedItem(null);
      toast({
        title: "Success",
        description: "Review submitted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  });

  // Filter orders based on status and search
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && order.status === activeTab;
  });

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
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
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
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReturnRequest = (order: CustomerOrder) => {
    setReturnForm({
      orderId: order.id,
      itemIds: order.items.map(item => item.id),
      reason: "",
      description: ""
    });
    setSelectedOrder(order);
    setIsReturnDialogOpen(true);
  };

  const handleReviewItem = (order: CustomerOrder, item: OrderItem) => {
    setReviewForm({
      productId: item.productId,
      rating: 5,
      comment: ""
    });
    setSelectedOrder(order);
    setSelectedItem(item);
    setIsReviewDialogOpen(true);
  };

  const submitReturn = () => {
    if (!returnForm.reason || !returnForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createReturnMutation.mutate(returnForm);
  };

  const submitReview = () => {
    if (!reviewForm.comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "destructive"
      });
      return;
    }
    createReviewMutation.mutate(reviewForm);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${interactive ? "cursor-pointer" : ""} ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Orders</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            className="pl-10"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Order Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">Order {order.orderNumber}</h3>
                        <p className="text-gray-600 text-sm">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-gray-600 text-sm">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </Badge>
                        <p className="text-lg font-semibold mt-1">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.productImage} 
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-gray-600 text-sm">Sold by {item.sellerName}</p>
                            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                            {order.status === "delivered" && order.canReview && !item.hasReview && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1"
                                onClick={() => handleReviewItem(order, item)}
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Information */}
                    {order.status === "shipped" && order.estimatedDelivery && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-blue-800 text-sm">
                          <Truck className="w-4 h-4 inline mr-1" />
                          Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {order.status === "delivered" && order.deliveredAt && (
                      <div className="bg-green-50 p-3 rounded-lg mb-4">
                        <p className="text-green-800 text-sm">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {order.canReturn && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReturnRequest(order)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Return
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Return Request Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="returnReason">Reason for Return</Label>
              <Select value={returnForm.reason} onValueChange={(value) => setReturnForm(prev => ({ ...prev, reason: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defective">Defective/Damaged</SelectItem>
                  <SelectItem value="wrong-item">Wrong Item</SelectItem>
                  <SelectItem value="not-as-described">Not as Described</SelectItem>
                  <SelectItem value="size-fit">Size/Fit Issues</SelectItem>
                  <SelectItem value="changed-mind">Changed Mind</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="returnDescription">Description</Label>
              <Textarea
                id="returnDescription"
                value={returnForm.description}
                onChange={(e) => setReturnForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe the issue in detail..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitReturn} disabled={createReturnMutation.isPending}>
                {createReturnMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedItem.productImage} 
                  alt={selectedItem.productName}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium">{selectedItem.productName}</h4>
                  <p className="text-gray-600 text-sm">by {selectedItem.sellerName}</p>
                </div>
              </div>
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars(reviewForm.rating, true, (rating) => setReviewForm(prev => ({ ...prev, rating })))}
                </div>
              </div>
              <div>
                <Label htmlFor="reviewComment">Your Review</Label>
                <Textarea
                  id="reviewComment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this product..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitReview} disabled={createReviewMutation.isPending}>
                  {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
