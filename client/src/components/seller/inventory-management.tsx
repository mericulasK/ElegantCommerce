import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Archive, Package, AlertTriangle, TrendingDown, Search, Filter } from "lucide-react";
import { format } from "date-fns";

interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  totalValue: number;
  lastRestocked: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  reservedStock: number;
  availableStock: number;
}

export function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Fetch inventory data
  const { data: inventory, isLoading } = useQuery({
    queryKey: ["seller-inventory"],
    queryFn: async () => {
      const response = await fetch("/api/seller/inventory");
      if (!response.ok) throw new Error("Failed to fetch inventory");
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockInventory: InventoryItem[] = [
    {
      id: 1,
      productId: 1,
      productName: "Premium Wireless Headphones",
      sku: "PWH-001",
      currentStock: 25,
      minStockLevel: 10,
      maxStockLevel: 100,
      unitCost: 45.00,
      totalValue: 1125.00,
      lastRestocked: "2024-01-15T10:00:00Z",
      status: "in_stock",
      reservedStock: 3,
      availableStock: 22
    },
    {
      id: 2,
      productId: 2,
      productName: "Smart Fitness Watch",
      sku: "SFW-002",
      currentStock: 8,
      minStockLevel: 15,
      maxStockLevel: 80,
      unitCost: 120.00,
      totalValue: 960.00,
      lastRestocked: "2024-01-10T14:30:00Z",
      status: "low_stock",
      reservedStock: 2,
      availableStock: 6
    },
    {
      id: 3,
      productId: 3,
      productName: "Ergonomic Office Chair",
      sku: "EOC-003",
      currentStock: 0,
      minStockLevel: 5,
      maxStockLevel: 30,
      unitCost: 180.00,
      totalValue: 0.00,
      lastRestocked: "2024-01-05T09:15:00Z",
      status: "out_of_stock",
      reservedStock: 0,
      availableStock: 0
    }
  ];

  const inventoryData = inventory || mockInventory;

  // Filter inventory based on search and status
  const filteredInventory = inventoryData.filter((item: InventoryItem) => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate inventory stats
  const totalValue = inventoryData.reduce((sum: number, item: InventoryItem) => sum + item.totalValue, 0);
  const lowStockItems = inventoryData.filter((item: InventoryItem) => item.status === "low_stock").length;
  const outOfStockItems = inventoryData.filter((item: InventoryItem) => item.status === "out_of_stock").length;
  const totalItems = inventoryData.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
      case "low_stock":
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          Update Stock
        </Button>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Archive className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading inventory...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item: InventoryItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.availableStock}</TableCell>
                    <TableCell>{item.reservedStock}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                    <TableCell>${item.totalValue.toFixed(2)}</TableCell>
                    <TableCell>{format(new Date(item.lastRestocked), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsUpdateDialogOpen(true);
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock: {selectedItem?.productName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input
                id="current-stock"
                type="number"
                defaultValue={selectedItem?.currentStock}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="min-stock">Minimum Stock Level</Label>
              <Input
                id="min-stock"
                type="number"
                defaultValue={selectedItem?.minStockLevel}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="max-stock">Maximum Stock Level</Label>
              <Input
                id="max-stock"
                type="number"
                defaultValue={selectedItem?.maxStockLevel}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="unit-cost">Unit Cost</Label>
              <Input
                id="unit-cost"
                type="number"
                step="0.01"
                defaultValue={selectedItem?.unitCost}
                min="0"
              />
            </div>
            <Button className="w-full">
              Update Stock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
