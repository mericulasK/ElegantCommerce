import CustomerProfile from "@/components/customer/profile";
import { useAuth } from "@/contexts/auth-context";

export default function CustomerProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Giriş Yapmanız Gerekiyor</h1>
          <p className="text-gray-600 mt-2">Profil sayfasını görüntülemek için giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomerProfile user={user} />
    </div>
  );
}
