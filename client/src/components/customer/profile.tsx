import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MapPin, Phone, Mail, Camera, Star, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CustomerProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    orderUpdates: boolean;
  };
  memberSince: string;
  totalOrders: number;
  totalSpent: number;
}

interface Address {
  id: number;
  title: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormData {
  title: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function CustomerProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormData>({
    title: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customer profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["customer-profile"],
    queryFn: async (): Promise<CustomerProfile> => {
      const response = await fetch("/api/customer/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockProfile: CustomerProfile = {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    username: "sarah_j",
    phone: "+1 (555) 987-6543",
    avatar: "/avatars/sarah.jpg",
    addresses: [
      {
        id: 1,
        title: "Home Address",
        street: "456 Oak Street, Apt 2B",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States",
        isDefault: true
      },
      {
        id: 2,
        title: "Work Address",
        street: "123 Business Ave, Suite 500",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90211",
        country: "United States",
        isDefault: false
      }
    ],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      orderUpdates: true
    },
    memberSince: "2023-03-15T00:00:00Z",
    totalOrders: 12,
    totalSpent: 1250.75
  };

  const profileData = profile || mockProfile;

  const [formData, setFormData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    username: profileData.username,
    phone: profileData.phone || "",
    avatar: profileData.avatar || ""
  });

  const [preferences, setPreferences] = useState(profileData.preferences);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  });

  // Address mutations
  const createAddressMutation = useMutation({
    mutationFn: async (addressData: AddressFormData) => {
      const response = await fetch("/api/customer/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData)
      });
      if (!response.ok) throw new Error("Failed to create address");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      setIsAddressDialogOpen(false);
      resetAddressForm();
      toast({
        title: "Success",
        description: "Address added successfully"
      });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, ...data }: Address) => {
      const response = await fetch(`/api/customer/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update address");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      setEditingAddress(null);
      resetAddressForm();
      toast({
        title: "Success",
        description: "Address updated successfully"
      });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/customer/addresses/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete address");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] });
      toast({
        title: "Success",
        description: "Address deleted successfully"
      });
    }
  });

  const resetAddressForm = () => {
    setAddressForm({
      title: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false
    });
  };

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleUpdatePreferences = () => {
    updateProfileMutation.mutate({ preferences });
  };

  const handleCreateAddress = () => {
    if (!addressForm.title || !addressForm.street || !addressForm.city) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createAddressMutation.mutate(addressForm);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      title: address.title,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setIsAddressDialogOpen(true);
  };

  const handleUpdateAddress = () => {
    if (editingAddress && addressForm.title && addressForm.street && addressForm.city) {
      updateAddressMutation.mutate({
        ...editingAddress,
        ...addressForm
      });
    }
  };

  const handleDeleteAddress = (id: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddressMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            Customer since {new Date(profileData.memberSince).getFullYear()}
          </Badge>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h3>
              </div>
              <p className="text-gray-600 mb-2">@{profileData.username}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </div>
                {profileData.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profileData.phone}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{profileData.totalOrders}</span>
                  <span className="text-gray-600 ml-1">Total Orders</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">${profileData.totalSpent.toFixed(2)}</span>
                  <span className="text-gray-600 ml-1">Total Spent</span>
                </div>
              </div>
            </div>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Update Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Personal Information</TabsTrigger>
          <TabsTrigger value="addresses">My Addresses</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <Button onClick={handleUpdateProfile} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Addresses</CardTitle>
                <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingAddress(null);
                      resetAddressForm();
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="addressTitle">Address Title</Label>
                        <Input
                          id="addressTitle"
                          value={addressForm.title}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Home, Work, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                          placeholder="123 Main St, Apt 4B"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={addressForm.zipCode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={addressForm.country}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isDefault"
                          checked={addressForm.isDefault}
                          onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, isDefault: !!checked }))}
                        />
                        <Label htmlFor="isDefault">Make this my default address</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={editingAddress ? handleUpdateAddress : handleCreateAddress}>
                          {editingAddress ? "Update Address" : "Add Address"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No addresses found. Add your first address to get started.
                  </div>
                ) : (
                  profileData.addresses.map((address) => (
                    <div key={address.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{address.title}</h4>
                            {address.isDefault && (
                              <Badge variant="default" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{address.street}</p>
                          <p className="text-gray-600 text-sm">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-600 text-sm">{address.country}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive general notifications via email</p>
                  </div>
                  <Checkbox
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive important updates via SMS</p>
                  </div>
                  <Checkbox
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, smsNotifications: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-gray-600">Receive promotional offers and news</p>
                  </div>
                  <Checkbox
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketingEmails: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Updates</h4>
                    <p className="text-sm text-gray-600">Get notified about order status changes</p>
                  </div>
                  <Checkbox
                    checked={preferences.orderUpdates}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, orderUpdates: !!checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleUpdatePreferences} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
