import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 14,
    minutes: 35,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div className="text-white">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold font-serif mb-6 text-shadow-lg drop-shadow-2xl"
            >
              Summer Sale
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl mb-8 text-white font-medium drop-shadow-lg"
            >
              Up to 70% off on selected items. Limited time offer!
            </motion.p>
            
            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-6 md:space-x-8 mb-8"
            >
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/30">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg"
                  >
                    {value.toString().padStart(2, '0')}
                  </motion.div>
                  <div className="text-xs md:text-sm capitalize text-white/90 font-medium">{unit}</div>
                </div>
              ))}
            </motion.div>
            
            <Link href="/products?filter=sale">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Button className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 hover:text-orange-700 transition-all duration-300 border-2 border-white/20">
                  Shop Sale Now
                </Button>
              </motion.div>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Summer Sale Collection" 
              className="rounded-2xl shadow-2xl w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
