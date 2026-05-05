import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, MapPin, Calendar, Hotel, ShoppingBag, Utensils, ArrowRight, Star, Users, Shield, Sun, Moon, Heart, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedRegionTitle from '@/components/AnimatedRegionTitle';
import { useRegion } from '@/contexts/RegionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import EventsSection from '@/components/EventsSection';
import heroCity from '@/assets/hero-cityscape.jpg';
import heroNightlife from '@/assets/hero-nightlife.jpg';
import heroRestaurant from '@/assets/hero-restaurant.jpg';
import heroHotel from '@/assets/hero-hotel.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const { brandName } = useRegion();
  const { theme, toggleTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Lightweight live stats and social feed for fun interactions
  const [activeUsers, setActiveUsers] = useState(52340);
  const [liveCheckins, setLiveCheckins] = useState(132);
  const [reviewsToday, setReviewsToday] = useState(348);

  useEffect(() => {
    const statTimer = setInterval(() => {
      setActiveUsers((p) => p + Math.floor(Math.random() * 4));
      setLiveCheckins((p) => (p + Math.floor(Math.random() * 3)) % 999);
      setReviewsToday((p) => p + Math.floor(Math.random() * 2));
    }, 2600);
    return () => clearInterval(statTimer);
  }, []);

  type SocialEvent = { id: number; name: string; action: string; place: string; x: number; y: number; initials: string };
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const names = ['Ada', 'Uche', 'Chidi', 'Ngozi', 'Kola', 'Tola', 'Ife', 'Bisi'];
  const actions = ['checked in at', 'liked', 'reviewed', 'shared'];
  const places = ['Cafe Noir', 'Eko Hotel', 'Freedom Park', 'Terra Kulture', 'The Backyard', 'Skye Mall'];

  useEffect(() => {
    const feedTimer = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const place = places[Math.floor(Math.random() * places.length)];
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const x = 10 + Math.random() * 80; // percent
      const y = 18 + Math.random() * 55; // percent
      const evt = { id: Date.now(), name, action, place, x, y, initials };
      setEvents((prev) => {
        const next = [...prev, evt];
        return next.slice(-8);
      });
    }, 2800);
    return () => clearInterval(feedTimer);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: 'Discover Places',
      description: 'Explore the best hotels, restaurants, and attractions in your area'
    },
    {
      icon: Calendar,
      title: 'Book Events',
      description: 'Find and book tickets to exciting events and experiences'
    },
    {
      icon: ShoppingBag,
      title: 'Shop Local',
      description: 'Support local businesses and discover unique shopping destinations'
    },
    {
      icon: Utensils,
      title: 'Dine Out',
      description: 'Find the perfect restaurant for any occasion or craving'
    }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: MapPin, value: '1000+', label: 'Locations' },
    { icon: Star, value: '4.9', label: 'Rating' },
    { icon: Shield, value: '100%', label: 'Secure' }
  ];

  // Diversified color palettes for icons and sections
  const featureIconColors = ['text-rose-600', 'text-sky-600', 'text-violet-600', 'text-amber-600'];
  const featureBgGradients = ['from-rose-50 to-white', 'from-sky-50 to-white', 'from-violet-50 to-white', 'from-amber-50 to-white'];
  const statIconColors = ['text-violet-700', 'text-sky-700', 'text-amber-700', 'text-emerald-700'];
  const statValueGradients = ['from-violet-700 to-fuchsia-600', 'from-sky-700 to-cyan-600', 'from-amber-600 to-orange-600', 'from-emerald-700 to-teal-600'];

  return (
    <div className="min-h-screen relative bg-white dark:bg-background text-foreground">
      {/* Light theme global gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/40 to-violet-50/40 dark:hidden -z-20" />
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* Interactive Background: visible grid + parallax blobs + floating particles */}
        <div className="absolute inset-0 -z-10">
          {/* Visible grid texture */}
          <div
            className="absolute inset-0 opacity-[0.10] dark:opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)',
              backgroundSize: '22px 22px'
            }}
          />
          {/* Parallax gradient blobs */}
          {(() => {
            const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
            const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
            const dx = mousePos.x - cx;
            const dy = mousePos.y - cy;
            return (
              <>
                <motion.div
                  className="absolute -top-48 -left-40 w-[40rem] h-[40rem] rounded-full blur-3xl mix-blend-multiply"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0) 60%)'
                  }}
                  animate={{ x: dx * 0.03, y: dy * 0.02 }}
                  transition={{ type: 'spring', stiffness: 30, damping: 20 }}
                />
                <motion.div
                  className="absolute top-20 -right-32 w-[34rem] h-[34rem] rounded-full blur-3xl mix-blend-multiply"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0) 60%)'
                  }}
                  animate={{ x: -dx * 0.02, y: dy * 0.03 }}
                  transition={{ type: 'spring', stiffness: 30, damping: 20 }}
                />
                <motion.div
                  className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl mix-blend-multiply"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(217,70,239,0.08) 0%, rgba(217,70,239,0) 60%)'
                  }}
                  animate={{ x: dx * 0.015, y: -dy * 0.02 }}
                  transition={{ type: 'spring', stiffness: 30, damping: 20 }}
                />
              </>
            );
          })()}
          {/* Floating particles (reduced for subtlety) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-sky-500/18"
                initial={{
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
                  y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800
                }}
                animate={{ y: [null, -120, null], opacity: [0, 1, 0] }}
                transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-32">
          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end items-center mb-20 gap-2"
          >
            {/* Events Button */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const eventsSection = document.getElementById('events');
                if (eventsSection) {
                  eventsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/events');
                }
              }}
              className="flex items-center gap-2 rounded-full border border-muted/50 hover:bg-muted/30"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </Button>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full border border-muted/50 hover:bg-muted/30">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {/* Sign In Button - gradient pill with shimmer */}
            <Button 
              onClick={() => navigate('/auth?force=true')}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-sky-600 text-white px-6 py-2 hover:opacity-90 shadow-soft group"
            >
              Sign In
              <span className="pointer-events-none absolute inset-y-0 left-[-30%] w-[60%] translate-x-[-100%] group-hover:translate-x-[250%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </Button>
          </motion.nav>

          {/* Hero Content - two-column layout with details and mosaic */}
          <div className="relative">

            <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
              {/* Left: Title and details */}
              <div className="max-w-xl text-center md:text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <AnimatedRegionTitle />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-4 text-lg md:text-xl text-muted-foreground"
                >
                  Discover, book and enjoy the best experiences around you.
                </motion.p>

                {/* Quick value bullets */}
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 space-y-3"
                >
                  <li className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-violet-600" />
                    <span className="text-foreground/90">Handpicked spots near you</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-sky-600" />
                    <span className="text-foreground/90">Easy booking for events and activities</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <span className="text-foreground/90">Secure and community‑trusted reviews</span>
                  </li>
                </motion.ul>

                {/* CTA + social stats */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    size="lg"
                    className="relative overflow-hidden text-lg px-8 py-5 rounded-full bg-gradient-to-r from-violet-600 to-sky-600 text-white hover:opacity-90 group shadow-soft"
                    onClick={() => navigate('/auth?force=true')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    <span className="pointer-events-none absolute inset-y-0 left-[-30%] w-[60%] translate-x-[-100%] group-hover:translate-x-[250%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </Button>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-violet-600" />
                      <span className="text-muted-foreground">{activeUsers.toLocaleString()} active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-sky-600" />
                      <span className="text-muted-foreground">{reviewsToday.toLocaleString()} reviews today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span className="text-muted-foreground">{liveCheckins} live check‑ins</span>
                    </div>
                  </div>
                </div>

                {/* Notifications: stacked list under the Get Started button (no overlap) */}
                <div className="mt-4 w-full max-w-md mx-auto md:mx-0">
                  <AnimatePresence initial={false}>
                    <div className="space-y-2">
                      {events.slice(-3).map((evt) => (
                        <motion.div
                          key={evt.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-soft text-sm"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{evt.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-foreground/90 font-medium">{evt.name}</span>
                          <span className="text-muted-foreground">{evt.action}</span>
                          <span className="text-foreground/90 font-semibold">{evt.place}</span>
                          <Heart className="h-4 w-4 text-rose-500" />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: Mosaic gallery */}
              <div className="relative">
                <div className="grid grid-cols-2 grid-rows-2 gap-3">
                  <motion.img src={heroCity} alt="Cityscape" className="rounded-2xl object-cover h-36 sm:h-44 md:h-56 w-full shadow-soft"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                  />
                  <motion.img src={heroRestaurant} alt="Restaurant" className="rounded-2xl object-cover h-44 sm:h-56 md:h-72 w-full shadow-soft"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                  />
                  <motion.img src={heroNightlife} alt="Nightlife" className="rounded-2xl object-cover h-44 sm:h-56 md:h-72 w-full shadow-soft"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                  />
                  <motion.img src={heroHotel} alt="Hotel" className="rounded-2xl object-cover h-36 sm:h-44 md:h-56 w-full shadow-soft"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 }}
                  />
                </div>
                {/* Reactions overlay removed to avoid overlapping images */}
              </div>
            </div>
          </div>

          {/* Hero Image / Mockup removed for a cleaner, non-card hero */}
        </div>
      </section>

      {/* Features Section - Everything You Need */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background accents (extra light in white theme) */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-violet-700 to-sky-600 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you discover, book, and experience the best
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group relative rounded-2xl p-6 bg-gradient-to-br ${featureBgGradients[index % featureBgGradients.length]} dark:from-gray-900 dark:to-background border border-foreground/10 shadow-card hover:shadow-xl`}
              >
                {/* Gradient border glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(56,189,248,0.25))',
                  filter: 'blur(8px)'
                }} />

                <div className="relative z-10">
                  {/* Standalone icon without box */}
                  <feature.icon className={`w-9 h-9 mb-4 ${featureIconColors[index % featureIconColors.length]} drop-shadow-md`} />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tags Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Trending Now</h2>
            <p className="text-muted-foreground mt-2">Jump into popular categories and hotspots</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: '#Restaurants', path: '/restaurants' },
              { label: '#Events', path: '/events' },
              { label: '#Hotels', path: '/hotels' },
              { label: '#Attractions', path: '/attractions' },
              { label: '#Lifestyle', path: '/lifestyle' },
              { label: '#Shopping', path: '/shopping' },
              { label: '#FunPlaces', path: '/funplaces' },
            ].map((tag, i) => (
              <motion.button
                key={tag.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(tag.path)}
                className="px-4 py-2 rounded-full border border-foreground/10 bg-gradient-to-r from-violet-600/10 to-sky-600/10 text-foreground hover:from-violet-600/20 hover:to-sky-600/20"
              >
                {tag.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - sleek counters */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-900 border border-foreground/10 hover:shadow-lg"
              >
                {/* Standalone stat icon */}
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${statIconColors[index % statIconColors.length]} drop-shadow-md`} />
                <div className={`text-4xl font-bold mb-1 bg-gradient-to-r ${statValueGradients[index % statValueGradients.length]} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-foreground/70">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/12 to-sky-500/12"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Start Exploring?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of users discovering amazing places and experiences
            </p>
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 rounded-full bg-gradient-to-r from-violet-600 to-sky-600 text-white hover:opacity-90 group shadow-soft"
              onClick={() => navigate('/auth?force=true')}
            >
              Create Your Free Account
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <EventsSection />

      {/* Footer */}
      <footer className="py-12 border-t bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">TourPH</span>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Use</Link>
            </nav>
            <p className="text-muted-foreground text-sm">
              © 2024 TourPH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
