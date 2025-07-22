import { Link } from "wouter";
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-serif">EliteShop</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your premium destination for luxury fashion and lifestyle products. 
              Quality, style, and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?filter=featured" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products?filter=sale" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Sale
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Gift Cards</a>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </Link>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Your Order</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary-500">📍</div>
                <span className="text-gray-400">İstanbul, Türkiye</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary-500">📞</div>
                <span className="text-gray-400">+90 537 478 36 66</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary-500">✉️</div>
                <span className="text-gray-400">info@elegantcommerce.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary-500">🕒</div>
                <span className="text-gray-400">Pzt-Cum: 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 EliteShop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
