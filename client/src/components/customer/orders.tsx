import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Package, Star, Eye, Repeat, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: number;
  userId: number;
  total: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: string;
    status: string;
    product: {
      id: number;
      name: string;
      image: string;
      brand: string;
    };
  }>;
}

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

export default function CustomerOrders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [reviewData, setReviewData] = React.useState({ rating: 5, comment: '' });

  // Fetch customer orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['customer-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/orders/user/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Fetch customer reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['customer-reviews', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/reviews/user/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
    enabled: !!user?.id
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await fetch(`/api/orders/${orderId}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to reorder');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Items have been added to your cart!' });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to reorder items', variant: 'destructive' });
    }
  });

  // Review submission mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: number; rating: number; comment: string }) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user?.id,
          rating,
          comment
        })
      });
      if (!response.ok) throw new Error('Failed to submit review');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Review submitted successfully!' });
      queryClient.invalidateQueries({ queryKey: ['customer-reviews'] });
      setReviewData({ rating: 5, comment: '' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
    }
  });

  // Filter orders
  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate order statistics
  const orderStats = React.useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o: Order) => o.status === 'pending').length;
    const delivered = orders.filter((o: Order) => o.status === 'delivered').length;
    const totalSpent = orders.reduce((sum: number, order: Order) => sum + parseFloat(order.total), 0);
    
    return { total, pending, delivered, totalSpent };
  }, [orders]);

  const handleReorder = (orderId: number) => {
    reorderMutation.mutate(orderId);
  };

  const handleReviewSubmit = (productId: number) => {
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      toast({ title: 'Error', description: 'Rating must be between 1 and 5', variant: 'destructive' });
      return;
    }
    reviewMutation.mutate({ ...reviewData, productId });
  };

  const hasReviewed = (productId: number) => {
    return reviews.some((review: Review) => review.productId === productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Statistics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Orders</p>
                <p className="text-lg font-semibold">{orderStats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-lg font-semibold">{orderStats.pending}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Delivered</p>
                <p className="text-lg font-semibold">{orderStats.delivered}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Total Spent</p>
                <p className="text-lg font-semibold">€{orderStats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Orders</Label>
              <Input
                id="search"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {orders.length === 0 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : "No orders match your current filters. Try adjusting your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: Order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <Badge className={statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                        {order.status}
                      </Badge>
                      <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                      <p>Total: <span className="font-medium text-gray-900">€{order.total}</span></p>
                      <p>Items: {order.items.length} product(s)</p>
                      {order.paymentMethod && (
                        <p>Payment: {order.paymentMethod}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order #{order.id} Details</DialogTitle>
                          <DialogDescription>
                            Order placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="items" className="w-full">
                          <TabsList>
                            <TabsTrigger value="items">Items</TabsTrigger>
                            <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            <TabsTrigger value="payment">Payment</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="items" className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.product.name}</h4>
                                  <p className="text-sm text-gray-600">{item.product.brand}</p>
                                  <p className="text-sm">Quantity: {item.quantity}</p>
                                  <p className="text-sm font-medium">€{item.price}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Badge className={statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                                    {item.status}
                                  </Badge>
                                  {order.status === 'delivered' && !hasReviewed(item.productId) && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Star className="h-3 w-3 mr-1" />
                                          Review
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Write a Review</DialogTitle>
                                          <DialogDescription>
                                            Share your experience with {item.product.name}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="rating">Rating</Label>
                                            <Select value={reviewData.rating.toString()} onValueChange={(value) => setReviewData(prev => ({ ...prev, rating: parseInt(value) }))}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {[1, 2, 3, 4, 5].map(num => (
                                                  <SelectItem key={num} value={num.toString()}>
                                                    {num} Star{num > 1 ? 's' : ''}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label htmlFor="comment">Review</Label>
                                            <Textarea
                                              id="comment"
                                              placeholder="Share your thoughts about this product..."
                                              value={reviewData.comment}
                                              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                                            />
                                          </div>
                                          <Button
                                            onClick={() => handleReviewSubmit(item.productId)}
                                            disabled={reviewMutation.isPending}
                                            className="w-full"
                                          >
                                            {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                          
                          <TabsContent value="shipping" className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                            </div>
                            {order.notes && (
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Order Notes</h4>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="payment" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Payment Method</h4>
                                <p className="text-sm text-gray-600">{order.paymentMethod || 'Not specified'}</p>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2">Payment Status</h4>
                                <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800'}>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium mb-2">Order Total</h4>
                              <p className="text-2xl font-bold text-gray-900">€{order.total}</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>

                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order.id)}
                        disabled={reorderMutation.isPending}
                      >
                        <Repeat className="h-4 w-4 mr-1" />
                        {reorderMutation.isPending ? 'Adding...' : 'Reorder'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-16 h-16">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
