import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
              Discover <span className="text-accent-500">Premium</span><br />
              Fashion Collection
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Explore our curated selection of luxury fashion pieces designed for the modern lifestyle. 
              Quality, style, and comfort in every piece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="btn-accent px-8 py-4 rounded-full font-semibold shadow-lg">
                    Shop Collection
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-full font-semibold"
                >
                  Watch Lookbook
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000" 
                alt="Stylish fashion model" 
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -right-6 glass-effect rounded-2xl p-6 text-white"
              >
                <div className="text-2xl font-bold">50% OFF</div>
                <div className="text-sm">Limited Time</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-accent-500/20 rounded-full"
      />
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 right-10 w-32 h-32 bg-white/10 rounded-full"
      />
    </section>
  );
}
