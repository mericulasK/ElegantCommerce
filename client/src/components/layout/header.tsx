import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartCount } = useCart();
  
  const cartCount = getCartCount();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "New Arrivals", href: "/products?filter=new" },
    { name: "Best Sellers", href: "/products?filter=featured" },
    { name: "Sale", href: "/products?filter=sale" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-100">
          <span>Free shipping on orders over $100</span>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Track Order</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Store Locator</a>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-serif text-primary-900">EliteShop</span>
            </motion.div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.a
                  whileHover={{ y: -2 }}
                  className={`nav-link font-medium transition-colors ${
                    location === item.href 
                      ? "text-primary-600" 
                      : "text-gray-700 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </motion.a>
              </Link>
            ))}
          </nav>
          
          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
              <Search className="text-gray-400 mr-3 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 p-0 text-gray-700 placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 rounded-full">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-accent-500 hover:bg-accent-500"
                  >
                    3
                  </Badge>
                </Button>
              </motion.div>
              
              <Link href="/cart">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 rounded-full">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    {cartCount > 0 && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary-600 hover:bg-primary-600"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </Button>
              </motion.div>
            </div>
            
            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-gray-200 bg-white"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="text-gray-400 mr-3 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 p-0 text-gray-700 placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`block py-2 px-4 rounded-lg font-medium transition-colors ${
                      location === item.href 
                        ? "text-primary-600 bg-primary-50" 
                        : "text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}
