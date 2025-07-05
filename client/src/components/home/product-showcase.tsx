import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/product-card";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

export default function ProductShowcase() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const filteredProducts = products.filter(product => {
    switch (activeFilter) {
      case "new":
        return product.isNew;
      case "sale":
        return product.isOnSale;
      default:
        return true;
    }
  });

  const filters = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "sale", label: "Sale" },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h2 className="text-4xl font-bold font-serif text-primary-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">Hand-picked items just for you</p>
          </div>
          <div className="flex space-x-4">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant={activeFilter === filter.id ? "default" : "ghost"}
                className={activeFilter === filter.id ? "btn-primary" : ""}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="btn-primary px-8 py-4 rounded-full font-semibold">
                View All Products
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
