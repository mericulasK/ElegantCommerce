import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Percent, Calendar, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Promotion {
  id: number;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  minOrderAmount?: number;
  sellerId: number;
  createdAt: string;
}

export default function SellerPromotions() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    startDate: "",
    endDate: "",
    maxUsage: "",
    minOrderAmount: ""
  });

  // Fetch seller promotions
  const { data: promotions, isLoading } = useQuery({
    queryKey: ["seller-promotions"],
    queryFn: async () => {
      const response = await fetch("/api/seller/promotions");
      if (!response.ok) throw new Error("Failed to fetch promotions");
      return response.json();
    }
  });

  // Create promotion mutation
  const createPromotionMutation = useMutation({
    mutationFn: async (promotionData: any) => {
      const response = await fetch("/api/seller/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotionData)
      });
      if (!response.ok) throw new Error("Failed to create promotion");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-promotions"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Promotion created successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create promotion",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      startDate: "",
      endDate: "",
      maxUsage: "",
      minOrderAmount: ""
    });
    setSelectedPromotion(null);
  };

  const handleCreate = () => {
    const promotionData = {
      ...formData,
      discountValue: Number(formData.discountValue),
      maxUsage: formData.maxUsage ? Number(formData.maxUsage) : undefined,
      minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : undefined,
      sellerId: 1 // In real app, get from auth
    };
    createPromotionMutation.mutate(promotionData);
  };

  const PromotionForm = ({ onSubmit, buttonText }: { onSubmit: () => void; buttonText: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Promotion Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discountType">Discount Type</Label>
          <Select
            value={formData.discountType}
            onValueChange={(value: "percentage" | "fixed") => setFormData(prev => ({ ...prev, discountType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="discountValue">
            Discount Value {formData.discountType === "percentage" ? "(%)" : "($)"}
          </Label>
          <Input
            id="discountValue"
            type="number"
            min="0"
            max={formData.discountType === "percentage" ? "100" : undefined}
            value={formData.discountValue}
            onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxUsage">Max Usage (Optional)</Label>
          <Input
            id="maxUsage"
            type="number"
            min="1"
            value={formData.maxUsage}
            onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))}
            placeholder="Unlimited"
          />
        </div>
        <div>
          <Label htmlFor="minOrderAmount">Min Order Amount (Optional)</Label>
          <Input
            id="minOrderAmount"
            type="number"
            min="0"
            step="0.01"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
            placeholder="No minimum"
          />
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full">
        {buttonText}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promotions & Discounts</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Promotion</DialogTitle>
            </DialogHeader>
            <PromotionForm onSubmit={handleCreate} buttonText="Create Promotion" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Promotions Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading promotions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions?.map((promotion: Promotion) => (
            <Card key={promotion.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{promotion.title}</CardTitle>
                  <Badge variant={promotion.isActive ? "default" : "secondary"}>
                    {promotion.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{promotion.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      {promotion.discountType === "percentage" 
                        ? `${promotion.discountValue}% off`
                        : `$${promotion.discountValue} off`
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      {format(new Date(promotion.startDate), "MMM dd")} - {format(new Date(promotion.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>

                  {promotion.maxUsage && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">
                        {promotion.usageCount}/{promotion.maxUsage} used
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPromotion(promotion);
                        setFormData({
                          title: promotion.title,
                          description: promotion.description,
                          discountType: promotion.discountType,
                          discountValue: promotion.discountValue,
                          startDate: promotion.startDate,
                          endDate: promotion.endDate,
                          maxUsage: promotion.maxUsage?.toString() || "",
                          minOrderAmount: promotion.minOrderAmount?.toString() || ""
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No promotions message */}
      {!isLoading && (!promotions || promotions.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <Percent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Promotions Yet</h3>
            <p className="text-gray-500 mb-4">Start creating promotions to boost your sales!</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Promotion
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
          </DialogHeader>
          <PromotionForm onSubmit={() => {
            // Update logic here
            setIsEditDialogOpen(false);
            resetForm();
          }} buttonText="Update Promotion" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
