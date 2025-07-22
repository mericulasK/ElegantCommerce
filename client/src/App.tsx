import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/contexts/auth-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import AuthPage from "@/pages/auth";
import AdminDashboard from "@/pages/admin/dashboard";
import SellerDashboard from "@/pages/seller/dashboard";
import CustomerDashboard from "@/pages/customer/dashboard";
import CustomerProfile from "@/pages/customer/profile";
import CustomerOrders from "@/pages/customer/orders";
import CheckoutPage from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/seller" component={SellerDashboard} />
      <Route path="/customer" component={CustomerDashboard} />
      <Route path="/customer/profile" component={CustomerProfile} />
      <Route path="/customer/orders" component={CustomerOrders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
