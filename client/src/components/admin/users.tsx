import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Eye,
  Mail,
  Calendar,
  Activity
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "seller" | "customer";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  address?: string;
  stats?: {
    ordersCount: number;
    totalSpent: number;
    productsCount?: number;
    totalRevenue?: number;
  };
}

interface NewUserData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "seller" | "customer";
  phone?: string;
  address?: string;
}

const roleConfig = {
  admin: { label: "Admin", color: "bg-red-100 text-red-800", icon: ShieldCheck },
  seller: { label: "Satıcı", color: "bg-blue-100 text-blue-800", icon: Shield },
  customer: { label: "Müşteri", color: "bg-green-100 text-green-800", icon: Users }
};

export default function AdminUsers() {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [newUserData, setNewUserData] = useState<NewUserData>({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    address: ""
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    enabled: user?.role === "admin"
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: NewUserData) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla oluşturuldu." });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı oluşturulurken bir hata oluştu.", variant: "destructive" });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsDialogOpen(false);
      setEditingUser(null);
      resetForm();
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla güncellendi." });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı güncellenirken bir hata oluştu.", variant: "destructive" });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Başarılı", description: "Kullanıcı başarıyla silindi." });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kullanıcı silinirken bir hata oluştu.", variant: "destructive" });
    }
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "inactive" && !user.isActive) ||
      (selectedStatus === "verified" && user.isVerified) ||
      (selectedStatus === "unverified" && !user.isVerified);
    
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  // Group users by role
  const usersByRole = {
    all: filteredUsers,
    admin: filteredUsers.filter(u => u.role === "admin"),
    seller: filteredUsers.filter(u => u.role === "seller"),
    customer: filteredUsers.filter(u => u.role === "customer")
  };

  const resetForm = () => {
    setNewUserData({
      name: "",
      email: "",
      password: "",
      role: "customer",
      phone: "",
      address: ""
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserData.name || !newUserData.email || (!editingUser && !newUserData.password)) {
      toast({ title: "Hata", description: "Lütfen zorunlu alanları doldurun.", variant: "destructive" });
      return;
    }

    if (editingUser) {
      const updateData = {
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        phone: newUserData.phone,
        address: newUserData.address
      };
      updateUserMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      createUserMutation.mutate(newUserData);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUserData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
      address: user.address || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: number) => {
    if (confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleStatusToggle = (userId: number, currentStatus: boolean) => {
    updateUserMutation.mutate({ 
      id: userId, 
      data: { isActive: !currentStatus }
    });
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Sistemdeki tüm kullanıcıları yönetin</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Kullanıcı Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad Soyad *</label>
                <Input
                  value={newUserData.name}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Kullanıcı adını girin"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">E-posta *</label>
                <Input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="E-posta adresini girin"
                  required
                />
              </div>

              {!editingUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Şifre *</label>
                  <Input
                    type="password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Şifre girin"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Rol *</label>
                <Select 
                  value={newUserData.role} 
                  onValueChange={(value: "admin" | "seller" | "customer") => 
                    setNewUserData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Müşteri</SelectItem>
                    <SelectItem value="seller">Satıcı</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <Input
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Telefon numarası"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adres</label>
                <Input
                  value={newUserData.address}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adres bilgisi"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  {editingUser ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Müşteri</p>
                <p className="text-2xl font-bold text-green-600">
                  {usersByRole.customer.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satıcı</p>
                <p className="text-2xl font-bold text-blue-600">
                  {usersByRole.seller.length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-red-600">
                  {usersByRole.admin.length}
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-red-500" />
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
                  placeholder="Kullanıcı adı veya e-posta ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rol Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="seller">Satıcı</SelectItem>
                  <SelectItem value="customer">Müşteri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="verified">Doğrulanmış</SelectItem>
                  <SelectItem value="unverified">Doğrulanmamış</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinize uygun kullanıcı bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Giriş</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const RoleIcon = roleConfig[user.role].icon;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleConfig[user.role].color}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {roleConfig[user.role].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                            <Badge variant={user.isVerified ? "default" : "destructive"}>
                              {user.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? (
                            <div className="flex items-center text-sm">
                              <Activity className="h-3 w-3 mr-1 text-green-500" />
                              {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Henüz giriş yapmamış</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openUserDetails(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={user.isActive ? "destructive" : "default"}
                              onClick={() => handleStatusToggle(user.id, user.isActive)}
                            >
                              {user.isActive ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kullanıcı Detayları</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Genel Bilgiler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Ad Soyad</label>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">E-posta</label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rol</label>
                      <Badge className={roleConfig[selectedUser.role].color}>
                        {roleConfig[selectedUser.role].label}
                      </Badge>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Telefon</label>
                        <p className="font-medium">{selectedUser.phone}</p>
                      </div>
                    )}
                    {selectedUser.address && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Adres</label>
                        <p className="font-medium">{selectedUser.address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">İstatistikler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Kayıt Tarihi</label>
                      <p className="font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Son Giriş</label>
                      <p className="font-medium">
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastLogin).toLocaleDateString('tr-TR')
                          : "Henüz giriş yapmamış"
                        }
                      </p>
                    </div>
                    {selectedUser.stats && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Sipariş Sayısı</label>
                          <p className="font-medium">{selectedUser.stats.ordersCount}</p>
                        </div>
                        {selectedUser.role === "customer" && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Toplam Harcama</label>
                            <p className="font-medium">₺{selectedUser.stats.totalSpent.toFixed(2)}</p>
                          </div>
                        )}
                        {selectedUser.role === "seller" && selectedUser.stats.productsCount !== undefined && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Ürün Sayısı</label>
                              <p className="font-medium">{selectedUser.stats.productsCount}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Toplam Gelir</label>
                              <p className="font-medium">₺{selectedUser.stats.totalRevenue?.toFixed(2) || "0.00"}</p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
