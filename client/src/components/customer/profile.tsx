import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
}

interface CustomerProfileProps {
  user: User;
  onUpdateProfile?: (userData: Partial<User>) => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    email: user.email || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email || "",
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = user.firstName || user.username;
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt={user.username} />
              <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
              </h1>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil Bilgileri
            </CardTitle>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            >
              {isEditing ? "İptal" : "Düzenle"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Adınızı girin"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{user.firstName || "Belirtilmemiş"}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Soyadınızı girin"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{user.lastName || "Belirtilmemiş"}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="E-posta adresinizi girin"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Telefon numaranızı girin"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{user.phone || "Belirtilmemiş"}</span>
                </div>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                İptal
              </Button>
              <Button onClick={handleSave}>
                Kaydet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Hesap Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm text-gray-500">Kullanıcı Adı:</span>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-sm text-gray-500">Kayıt Tarihi:</span>
                <p className="font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : "Bilinmiyor"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Hızlı İşlemler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Siparişlerim
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Adreslerim
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Şifre Değiştir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;