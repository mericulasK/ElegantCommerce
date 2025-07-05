import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      quantity: 1,
      sessionId: "guest-session", // In real app, get from auth context
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discount = product.originalPrice ? 
    Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100) : 0;

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="product-card bg-white rounded-2xl shadow-md overflow-hidden group"
      >
        <Link href={`/products/${product.id}`}>
          <div className="flex p-6 gap-6">
            <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={product.image || ""}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.isOnSale && discount > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                  -{discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                  New
                </Badge>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(parseFloat(product.rating || "0"))
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviewCount})</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary-600">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="btn-primary p-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="product-card bg-white rounded-2xl shadow-md overflow-hidden group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image || ""}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isOnSale && discount > 0 && (
              <Badge className="bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500 text-white">
                New
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-4 h-4 text-gray-600" />
            </Button>
          </motion.div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(parseFloat(product.rating || "0"))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            <Button
              className="btn-primary p-2 rounded-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
