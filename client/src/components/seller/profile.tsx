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
import { Store, MapPin, Phone, Mail, Globe, Camera, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SellerProfile {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  description: string;
  logo?: string;
  banner?: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  memberSince: string;
  businessType: string;
  taxId: string;
  isActive: boolean;
  settings: {
    autoReply: boolean;
    emailNotifications: boolean;
    orderNotifications: boolean;
    promotionalEmails: boolean;
  };
}

export default function SellerProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch seller profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async (): Promise<SellerProfile> => {
      const response = await fetch("/api/seller/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    }
  });

  // Mock data for demonstration
  const mockProfile: SellerProfile = {
    id: 1,
    businessName: "Tech Haven Store",
    ownerName: "John Smith",
    email: "john@techhaven.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    website: "https://techhaven.com",
    description: "Your one-stop shop for premium tech gadgets and accessories. We specialize in high-quality electronics with excellent customer service.",
    logo: "/seller-logos/tech-haven.jpg",
    banner: "/seller-banners/tech-haven-banner.jpg",
    isVerified: true,
    rating: 4.8,
    totalReviews: 245,
    memberSince: "2022-01-15T00:00:00Z",
    businessType: "Electronics",
    taxId: "12-3456789",
    isActive: true,
    settings: {
      autoReply: true,
      emailNotifications: true,
      orderNotifications: true,
      promotionalEmails: false
    }
  };

  const profileData = profile || mockProfile;

  const [formData, setFormData] = useState({
    businessName: profileData.businessName,
    ownerName: profileData.ownerName,
    email: profileData.email,
    phone: profileData.phone,
    address: profileData.address,
    city: profileData.city,
    state: profileData.state,
    zipCode: profileData.zipCode,
    country: profileData.country,
    website: profileData.website || "",
    description: profileData.description,
    businessType: profileData.businessType
  });

  const [settings, setSettings] = useState(profileData.settings);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/seller/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-profile"] });
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

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleUpdateSettings = () => {
    updateProfileMutation.mutate({ settings });
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

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Profile</h2>
        <div className="flex items-center gap-2">
          {profileData.isVerified && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified Seller
            </Badge>
          )}
          <Badge variant={profileData.isActive ? "default" : "secondary"}>
            {profileData.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {profileData.logo ? (
                <img src={profileData.logo} alt={profileData.businessName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <Store className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{profileData.businessName}</h3>
                {profileData.isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-gray-600 mb-2">Owner: {profileData.ownerName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(profileData.rating)}
                  <span className="ml-1">{profileData.rating} ({profileData.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileData.city}, {profileData.state}
                </div>
              </div>
              <p className="text-gray-800">{profileData.description}</p>
            </div>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Update Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <Button onClick={handleUpdateProfile} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Address & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tax ID</Label>
                    <Input value={profileData.taxId} disabled />
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <Input 
                      value={new Date(profileData.memberSince).toLocaleDateString()} 
                      disabled 
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Updating..." : "Update Business Details"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-reply to Messages</h4>
                    <p className="text-sm text-gray-600">Automatically send replies to customer inquiries</p>
                  </div>
                  <Checkbox
                    checked={settings.autoReply}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoReply: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                  </div>
                  <Checkbox
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified when you receive new orders</p>
                  </div>
                  <Checkbox
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, orderNotifications: !!checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promotional Emails</h4>
                    <p className="text-sm text-gray-600">Receive marketing emails and promotions</p>
                  </div>
                  <Checkbox
                    checked={settings.promotionalEmails}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, promotionalEmails: !!checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleUpdateSettings} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
