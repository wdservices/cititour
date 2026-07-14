import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, User, ArrowRight, 
  MapPin, Calendar, ShoppingBag, Utensils, 
  Star, Shield, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useRegion } from '@/contexts/RegionContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';

interface AuthPageProps {
  onAuthenticated: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [googleUnavailable, setGoogleUnavailable] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { loginWithEmail, signUpWithEmailPassword, loginWithGoogle, resetPassword, isAuthenticated, isLoading } = useAuth();
  const { brandName, locationName } = useRegion();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const forceLogin = searchParams.get('force') === 'true';

  useEffect(() => {
    try {
      const opts = (auth.app.options || {}) as { authDomain?: string; apiKey?: string };
      const authDomain = opts.authDomain;
      const apiKey = opts.apiKey;
      if (!authDomain || !apiKey) return;
      const url = `https://${authDomain}/__/auth/iframe?apiKey=${encodeURIComponent(apiKey)}&appName=%5BDEFAULT%5D&v=12.3.0`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      fetch(url, { method: 'GET', mode: 'no-cors', signal: controller.signal })
        .then(() => setGoogleUnavailable(false))
        .catch(() => setGoogleUnavailable(true))
        .finally(() => clearTimeout(timeout));

      return () => clearTimeout(timeout);
    } catch {
      setGoogleUnavailable(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && !acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms of Service to create an account.",
        variant: "destructive",
      });
      return;
    }

    setIsWorking(true);

    try {
      const email = formData.email.trim();
      const password = formData.password;
      if (!email || !password) {
        toast({
          title: "Missing credentials",
          description: "Please enter your email and password.",
        });
        return;
      }
      if (isSignUp) {
        await signUpWithEmailPassword(email, password);
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully.",
        });
        onAuthenticated?.();
        navigate('/explore');
      } else {
        await loginWithEmail(email, password);
        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
        });
        onAuthenticated?.();
        navigate('/explore');
      }
    } catch (error: any) {
      const code = String(error?.code || '');
      if (isSignUp && code === 'auth/email-already-in-use') {
        toast({
          title: "Email already in use",
          description: "Please sign in or use Forgot Password to reset.",
          variant: "destructive",
        });
        setIsSignUp(false);
      } else {
        const description =
          code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential'
            ? 'Incorrect email or password.'
            : code === 'auth/too-many-requests'
              ? 'Too many attempts. Please try again later or reset your password.'
              : code === 'auth/invalid-api-key' || code === 'auth/operation-not-allowed'
                ? 'Email/password sign-in is not configured for this project.'
                : error?.message || 'Please check your credentials and try again.';
        toast({
          title: 'Authentication Failed',
          description,
          variant: 'destructive',
        });
      }
    } finally {
      setIsWorking(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsWorking(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      });
      onAuthenticated?.();
      navigate('/explore');
    } catch (error: any) {
      const code = String(error?.code || '');
      if (code === 'auth/popup-closed-by-user') {
        toast({
          title: 'Popup closed',
          description: 'You closed the sign-in window. Please try again.',
        });
      } else {
        const description =
          code === 'auth/network-request-failed'
            ? 'Network issue during Google sign-in. Check your connection and try again.'
            : error?.message || 'Please try again.';
        toast({
          title: 'Google Sign-In Failed',
          description,
          variant: 'destructive',
        });
      }
    } finally {
      setIsWorking(false);
    }
  };



  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
    setAcceptTerms(false);
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      toast({
        title: "Enter your email",
        description: "Please fill in your email to reset your password.",
      });
      return;
    }
    setIsWorking(true);
    try {
      await resetPassword(formData.email);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link.",
      });
    } catch (error: any) {
      const code = String(error?.code || '');
      const description =
        code === 'auth/user-not-found'
          ? 'No account found for this email. Try Sign Up.'
          : error.message || 'Could not send reset email. Please try again.';
      toast({ title: 'Reset failed', description, variant: 'destructive' });
    } finally {
      setIsWorking(false);
    }
  };

  useEffect(() => {
    if (!forceLogin && !isLoading && isAuthenticated) {
      navigate('/explore', { replace: true });
    }
  }, [forceLogin, isAuthenticated, isLoading, navigate]);

  const features = [
    { icon: MapPin, title: 'Discover Places', color: 'text-primary' },
    { icon: Calendar, title: 'Book Events', color: 'text-accent' },
    { icon: ShoppingBag, title: 'Shop Local', color: 'text-success' },
    { icon: Utensils, title: 'Dine Out', color: 'text-primary-dark' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-8 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-success/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-lg text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <img src="/cititour-logo.png" alt="CitiTour Logo" className="h-12 w-auto object-contain" />
              </div>
              <h2 className="text-5xl font-extrabold mt-4 mb-2">CitiTour</h2>
            </div>
            
            <h3 className="text-3xl font-bold mb-6">
              Nigeria's Urban Concierge
            </h3>
            
            <p className="text-xl text-white/80 mb-8">
              Discover, book, and split bills across Lagos, Abuja, and Port Harcourt.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20"
                >
                  <feature.icon className={`w-8 h-8 mb-3 ${feature.color}`} />
                  <h4 className="font-bold text-lg">{feature.title}</h4>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 justify-center">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white/30 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">50K+ Active Users</p>
                <p className="text-sm text-white/70">Join the community</p>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-accent">1000+</div>
                <div className="text-sm text-white/70">Locations</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-success">4.9</div>
                <div className="flex items-center gap-1 justify-center text-sm text-white/70">
                  <Star className="w-4 h-4 fill-current text-accent" />
                  Rating
                </div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-primary-light">100%</div>
                <div className="text-sm text-white/70 flex items-center gap-1 justify-center">
                  <Shield className="w-4 h-4" />
                  Secure
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-3xl shadow-card p-6 sm:p-8 md:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6 lg:hidden">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <img src="/cititour-logo.png" alt="CitiTour Logo" className="h-7 w-auto object-contain" style={{ filter: 'invert(38%) sepia(70%) saturate(5894%) hue-rotate(200deg) brightness(94%) contrast(101%)' }} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground">CitiTour</h2>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className="text-muted-foreground">
                  {isSignUp ? 'Enter your details to get started' : 'Enter your credentials to continue'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-12 bg-background border-border focus:border-primary focus:ring-primary h-12"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 bg-background border-border focus:border-primary focus:ring-primary h-12"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-12 bg-background border-border focus:border-primary focus:ring-primary h-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isSignUp && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal leading-relaxed">
                      I accept the <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
                    </Label>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isWorking}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 rounded-xl mt-4 shadow-lg hover:shadow-xl transition-all"
                >
                  {isWorking ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <button
                  onClick={toggleMode}
                  className="mt-1 text-primary font-bold hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              <div className="mt-8">
                {googleUnavailable && (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 mb-4">
                    Google sign-in is unavailable on this network. Allowlist `*.web.app`, `*.firebaseapp.com`, and `apis.google.com`, or use email sign-in above.
                  </div>
                )}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="w-full">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isWorking || googleUnavailable}
                    className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <p className="mt-8 text-center text-xs text-muted-foreground">
                  By continuing, you agree to our <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;