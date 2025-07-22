import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Check, X, Eye } from "lucide-react";
import type { User } from "@shared/schema";

interface SellerApplication extends User {
  applicationDate?: string;
  applicationStatus: "pending" | "approved" | "rejected";
  businessName?: string;
  businessAddress?: string;
  taxId?: string;
  applicationNotes?: string;
}

export default function SellerApproval() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch pending seller applications
  const { data: applications = [], isLoading } = useQuery<SellerApplication[]>({
    queryKey: ["/api/admin/seller-applications"],
  });

  // Approve seller mutation
  const approveSellerMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/seller-applications/${userId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to approve seller application");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seller-applications"] });
      setIsDetailsDialogOpen(false);
      toast({
        title: "Success",
        description: "Seller application approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve seller application",
        variant: "destructive",
      });
    }
  });

  // Reject seller mutation
  const rejectSellerMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: number; reason: string }) => {
      const response = await fetch(`/api/admin/seller-applications/${userId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to reject seller application");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seller-applications"] });
      setIsDetailsDialogOpen(false);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Seller application rejected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject seller application",
        variant: "destructive",
      });
    }
  });

  // Filter applications based on search
  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.businessName && application.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleApproveApplication = (userId: number) => {
    if (window.confirm("Are you sure you want to approve this seller application?")) {
      approveSellerMutation.mutate(userId);
    }
  };

  const handleRejectApplication = (userId: number) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    
    rejectSellerMutation.mutate({ userId, reason: rejectionReason });
  };

  const handleViewApplicationDetails = (application: SellerApplication) => {
    setSelectedApplication(application);
    setIsDetailsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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
        <CardTitle>Seller Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No seller applications found
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">
                        {application.firstName} {application.lastName}
                      </h3>
                      <Badge variant={getStatusColor(application.applicationStatus)}>
                        {application.applicationStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      @{application.username} • {application.email}
                    </p>
                    {application.businessName && (
                      <p className="text-sm text-gray-600 mb-1">
                        Business: {application.businessName}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Applied: {formatDate(application.applicationDate || application.createdAt)}</span>
                      {application.taxId && <span>Tax ID: {application.taxId}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplicationDetails(application)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {application.applicationStatus === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveApplication(application.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplicationDetails(application)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Seller Application Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Full Name:</span>
                      <p>{selectedApplication.firstName} {selectedApplication.lastName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Username:</span>
                      <p>@{selectedApplication.username}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Application Date:</span>
                      <p>{formatDate(selectedApplication.applicationDate || selectedApplication.createdAt)}</p>
                    </div>
                  </div>
                  {selectedApplication.address && (
                    <div className="mt-4">
                      <span className="font-medium">Address:</span>
                      <p>{selectedApplication.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedApplication.businessName && (
                      <div>
                        <span className="font-medium">Business Name:</span>
                        <p>{selectedApplication.businessName}</p>
                      </div>
                    )}
                    {selectedApplication.businessAddress && (
                      <div>
                        <span className="font-medium">Business Address:</span>
                        <p>{selectedApplication.businessAddress}</p>
                      </div>
                    )}
                    {selectedApplication.taxId && (
                      <div>
                        <span className="font-medium">Tax ID:</span>
                        <p>{selectedApplication.taxId}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Application Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="font-medium">Current Status:</span>
                    <Badge variant={getStatusColor(selectedApplication.applicationStatus)}>
                      {selectedApplication.applicationStatus}
                    </Badge>
                  </div>
                  {selectedApplication.applicationNotes && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1">{selectedApplication.applicationNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedApplication.applicationStatus === "pending" && (
                <div className="flex justify-between items-start space-x-4">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Rejection reason (required for rejection)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleApproveApplication(selectedApplication.id)}
                      disabled={approveSellerMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {approveSellerMutation.isPending ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectApplication(selectedApplication.id)}
                      disabled={rejectSellerMutation.isPending}
                    >
                      {rejectSellerMutation.isPending ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
