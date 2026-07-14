import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import AnimatedRegionTitle from "@/components/AnimatedRegionTitle";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Calendar, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useRegion } from "@/contexts/RegionContext";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <AppHeader />

      <main className="pb-12">
        {/* Lively Hero */}
        <section className="relative overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-32 -right-28 w-[22rem] h-[22rem] bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute bottom-0 left-1/3 w-[18rem] h-[18rem] bg-success/10 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>

          <div className="px-4 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-hero">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>

              <AnimatedRegionTitle />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-lg md:text-xl text-muted-foreground"
              >
                Discover, book and enjoy the best experiences around you
              </motion.p>

              {/* Floating interactive icons */}
              <div className="relative mt-10 h-24">
                <motion.div
                  className="absolute left-1/4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <MapPin className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute left-1/2"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2 }}
                >
                  <Calendar className="w-8 h-8 text-accent" />
                </motion.div>
                <motion.div
                  className="absolute left-[68%]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8 }}
                >
                  <UtensilsCrossed className="w-8 h-8 text-success" />
                </motion.div>
                <motion.div
                  className="absolute left-[85%]"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ repeat: Infinity, duration: 3.4 }}
                >
                  <ShoppingBag className="w-8 h-8 text-pink-600" />
                </motion.div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/events')}
                  className="px-5 py-3 rounded-xl bg-primary text-white font-medium shadow-soft hover:opacity-90 transition"
                >
                  Explore Events
                </button>
                <button
                  onClick={() => navigate('/hotels')}
                  className="px-5 py-3 rounded-xl border border-primary text-primary hover:bg-primary/5 font-medium transition"
                >
                  Find Hotels
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;