import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Eye, 
  MessageSquare, 
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    image: string;
    sellerId: number;
  };
}

interface Order {
  id: number;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: string;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
  customerId: number;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: OrderItem[];
  trackingNumber?: string;
  notes?: string;
}

const statusConfig = {
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Onaylandı", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  processing: { label: "Hazırlanıyor", color: "bg-purple-100 text-purple-800", icon: Package },
  shipped: { label: "Kargoda", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  delivered: { label: "Teslim Edildi", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function SellerOrders() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch seller's orders
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["seller-orders", user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user?.id) throw new Error("User not logged in");
      const response = await fetch(`/api/seller/orders/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: !!user?.id
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingNumber, notes }: { 
      orderId: number; 
      status: string; 
      trackingNumber?: string;
      notes?: string;
    }) => {
      const response = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber, notes })
      });
      if (!response.ok) throw new Error("Failed to update order status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      setIsDetailsOpen(false);
      setSelectedOrder(null);
      toast({ title: "Başarılı", description: "Sipariş durumu güncellendi." });
    },
    onError: () => {
      toast({ title: "Hata", description: "Sipariş durumu güncellenirken bir hata oluştu.", variant: "destructive" });
    }
  });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch = searchQuery === "" || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Group orders by status
  const ordersByStatus = {
    all: filteredOrders,
    pending: filteredOrders.filter(order => order.status === "pending"),
    confirmed: filteredOrders.filter(order => order.status === "confirmed"),
    processing: filteredOrders.filter(order => order.status === "processing"),
    shipped: filteredOrders.filter(order => order.status === "shipped"),
    delivered: filteredOrders.filter(order => order.status === "delivered"),
    cancelled: filteredOrders.filter(order => order.status === "cancelled")
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    const updateData: any = { orderId, status: newStatus };
    
    if (newStatus === "shipped" && trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    
    if (orderNotes) {
      updateData.notes = orderNotes;
    }

    updateOrderStatusMutation.mutate(updateData);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || "");
    setOrderNotes(order.notes || "");
    setIsDetailsOpen(true);
  };

  const getStatusActions = (order: Order) => {
    const actions = [];
    
    switch (order.status) {
      case "pending":
        actions.push(
          <Button
            key="confirm"
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "confirmed")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Onayla
          </Button>
        );
        actions.push(
          <Button
            key="cancel"
            size="sm"
            variant="destructive"
            onClick={() => handleStatusUpdate(order.id, "cancelled")}
          >
            İptal Et
          </Button>
        );
        break;
      case "confirmed":
        actions.push(
          <Button
            key="process"
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "processing")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Hazırlamaya Başla
          </Button>
        );
        break;
      case "processing":
        actions.push(
          <Button
            key="ship"
            size="sm"
            onClick={() => openOrderDetails(order)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Kargoya Ver
          </Button>
        );
        break;
    }
    
    return actions;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          <p className="text-gray-600 mt-2">Gelen siparişleri yönetin ve takip edin</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Yenile
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ordersByStatus.pending.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hazırlanan</p>
                <p className="text-2xl font-bold text-purple-600">
                  {ordersByStatus.processing.length}
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
                <p className="text-sm text-gray-600">Teslim Edildi</p>
                <p className="text-2xl font-bold text-green-600">
                  {ordersByStatus.delivered.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Sipariş numarası, müşteri adı veya ürün adı ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Siparişler</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="confirmed">Onaylandı</SelectItem>
                  <SelectItem value="processing">Hazırlanıyor</SelectItem>
                  <SelectItem value="shipped">Kargoda</SelectItem>
                  <SelectItem value="delivered">Teslim Edildi</SelectItem>
                  <SelectItem value="cancelled">İptal Edildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Tablo Görünümü</TabsTrigger>
          <TabsTrigger value="cards">Kart Görünümü</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Siparişler ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sipariş bulunamadı</h3>
                  <p className="text-gray-600">Henüz bu kriterlere uygun sipariş bulunmuyor.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sipariş</TableHead>
                        <TableHead>Müşteri</TableHead>
                        <TableHead>Ürünler</TableHead>
                        <TableHead>Tutar</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">#{order.orderNumber}</div>
                              {order.trackingNumber && (
                                <div className="text-sm text-gray-600">
                                  Takip: {order.trackingNumber}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-gray-600">{order.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.items.length} ürün
                              <div className="text-gray-600">
                                {order.items.slice(0, 2).map(item => item.product.name).join(", ")}
                                {order.items.length > 2 && "..."}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>₺{parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={statusConfig[order.status].color}>
                              {statusConfig[order.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {getStatusActions(order)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">#{order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600">{order.customer.name}</p>
                      </div>
                      <Badge className={statusConfig[order.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <span className="flex-1">{item.product.name}</span>
                          <span>{item.quantity}x</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-600">
                          +{order.items.length - 3} ürün daha
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="font-bold">₺{parseFloat(order.totalAmount).toFixed(2)}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detay
                      </Button>
                      {getStatusActions(order)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Sipariş Detayları - #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Müşteri Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Ad:</strong> {selectedOrder.customer.name}</p>
                      <p><strong>E-posta:</strong> {selectedOrder.customer.email}</p>
                      <p><strong>Teslimat Adresi:</strong></p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {selectedOrder.shippingAddress}
                      </p>
                      <p><strong>Ödeme Yöntemi:</strong> {selectedOrder.paymentMethod}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sipariş Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Sipariş No:</strong> #{selectedOrder.orderNumber}</p>
                      <p><strong>Tarih:</strong> {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</p>
                      <p><strong>Durum:</strong> 
                        <Badge className={`ml-2 ${statusConfig[selectedOrder.status].color}`}>
                          {statusConfig[selectedOrder.status].label}
                        </Badge>
                      </p>
                      <p><strong>Toplam Tutar:</strong> ₺{parseFloat(selectedOrder.totalAmount).toFixed(2)}</p>
                      {selectedOrder.trackingNumber && (
                        <p><strong>Takip Numarası:</strong> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sipariş Ürünleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Adet: {item.quantity} × ₺{parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ₺{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Update Section */}
              {selectedOrder.status === "processing" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Kargoya Ver</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Takip Numarası</label>
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Kargo takip numarasını girin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Notlar (Opsiyonel)</label>
                      <Textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Sipariş ile ilgili notlarınızı girin"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={() => handleStatusUpdate(selectedOrder.id, "shipped")}
                      disabled={!trackingNumber}
                      className="w-full"
                    >
                      Kargoya Ver
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Notes Section */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notlar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
