import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import type { Product, Category } from "@shared/schema";

interface CreateProductData {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  category: string;
  categoryId: number;
  sellerId: number;
  image: string;
  images?: string[];
  brand?: string;
  color?: string;
  size?: string;
  weight?: string;
  dimensions?: string;
  material?: string;
  tags?: string[];
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  stockQuantity?: number;
  sku?: string;
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<CreateProductData>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    categoryId: 1,
    sellerId: 1,
    image: "",
    images: [],
    brand: "",
    color: "",
    size: "",
    weight: "",
    dimensions: "",
    material: "",
    tags: [],
    inStock: true,
    featured: false,
    isNew: false,
    isOnSale: false,
    stockQuantity: 0,
    sku: ""
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: CreateProductData) => {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsCreateDialogOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        categoryId: 1,
        sellerId: 1,
        image: "",
        images: [],
        brand: "",
        color: "",
        size: "",
        weight: "",
        dimensions: "",
        material: "",
        tags: [],
        inStock: true,
        featured: false,
        isNew: false,
        isOnSale: false,
        stockQuantity: 0,
        sku: ""
      });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    createProductMutation.mutate(newProduct);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={newProduct.sku || ""}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      placeholder="SKU123"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="29.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={newProduct.originalPrice || ""}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                      placeholder="39.99"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newProduct.category} 
                      onValueChange={(value) => {
                        const cat = categories.find(c => c.name === value);
                        setNewProduct({
                          ...newProduct, 
                          category: value,
                          categoryId: cat?.id || 1
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={newProduct.stockQuantity || ""}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value) || 0})}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Main Image URL *</Label>
                  <Input
                    id="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={newProduct.brand || ""}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      placeholder="Brand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={newProduct.color || ""}
                      onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                      placeholder="Red, Blue, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={newProduct.size || ""}
                      onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      value={newProduct.weight || ""}
                      onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                      placeholder="1.5 kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={newProduct.dimensions || ""}
                      onChange={(e) => setNewProduct({...newProduct, dimensions: e.target.value})}
                      placeholder="10x20x30 cm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={newProduct.material || ""}
                    onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
                    placeholder="Cotton, Polyester, etc."
                  />
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="inStock" 
                      checked={newProduct.inStock}
                      onCheckedChange={(checked) => setNewProduct({...newProduct, inStock: !!checked})}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured" 
                      checked={newProduct.featured}
                      onCheckedChange={(checked) => setNewProduct({...newProduct, featured: !!checked})}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isNew" 
                      checked={newProduct.isNew}
                      onCheckedChange={(checked) => setNewProduct({...newProduct, isNew: !!checked})}
                    />
                    <Label htmlFor="isNew">New Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isOnSale" 
                      checked={newProduct.isOnSale}
                      onCheckedChange={(checked) => setNewProduct({...newProduct, isOnSale: !!checked})}
                    />
                    <Label htmlFor="isOnSale">On Sale</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProduct} disabled={createProductMutation.isPending}>
                    {createProductMutation.isPending ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{product.name}</h3>
                      {product.featured && <Badge>Featured</Badge>}
                      {product.isNew && <Badge variant="secondary">New</Badge>}
                      {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
                      <Badge variant={product.inStock ? "default" : "outline"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="font-medium text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="line-through">${product.originalPrice}</span>
                      )}
                      {product.brand && <span>Brand: {product.brand}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/products/${product.id}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
