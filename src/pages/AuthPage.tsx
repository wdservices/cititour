import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useRegion } from '@/contexts/RegionContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthPageProps {
  onAuthenticated: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { loginWithEmail, signUpWithEmailPassword, loginWithGoogle, loginWithFacebook, resetPassword, isAuthenticated, isLoading } = useAuth();
  const { brandName, locationName } = useRegion();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const forceLogin = searchParams.get('force') === 'true';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWorking(true);

    try {
      if (isSignUp) {
        await signUpWithEmailPassword(formData.email, formData.password);
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully.",
        });
        onAuthenticated?.();
        navigate('/explore');
      } else {
        await loginWithEmail(formData.email, formData.password);
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
        toast({
          title: "Authentication Failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
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
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWorking(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsWorking(true);
    try {
      await loginWithFacebook();
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Facebook.",
      });
      onAuthenticated?.();
      navigate('/explore');
    } catch (error: any) {
      toast({
        title: "Facebook Sign-In Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWorking(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: '', email: '', password: '' });
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

  // If user becomes authenticated (including redirect flows), send them to the app
  // Respect forceLogin param to allow viewing the login screen even when authenticated
  useEffect(() => {
    if (!forceLogin && !isLoading && isAuthenticated) {
      navigate('/explore', { replace: true });
    }
  }, [forceLogin, isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, null],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Welcome to CityTour
              </h1>
              <p className="text-white/80 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">{brandName}</span>
              </p>
              <p className="text-white/70">
                {isSignUp ? 'Create your account to get started' : 'Sign in to continue your journey'}
              </p>
            </motion.div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name Field (Sign Up Only) */}
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-white/90">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                        placeholder="Enter your full name"
                        required={isSignUp}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {!isSignUp && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="mt-2 text-purple-300 hover:text-purple-200 font-semibold transition-colors underline underline-offset-4"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: isWorking ? 1 : 1.02 }}
                  whileTap={{ scale: isWorking ? 1 : 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isWorking}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      {isWorking ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          {isSignUp ? 'Creating Account...' : 'Signing In...'}
                        </>
                      ) : (
                        <>
                          {isSignUp ? 'Create Account' : 'Sign In'}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </motion.form>
            </AnimatePresence>

            {/* Toggle Mode */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-white/70">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <button
                onClick={toggleMode}
                className="mt-2 text-purple-300 hover:text-purple-200 font-semibold transition-colors underline underline-offset-4"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </motion.div>

            {/* Social Login Options */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/70">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleSignIn}
                  disabled={isWorking}
                  className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium">Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFacebookSignIn}
                  disabled={isWorking}
                  className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-medium">Facebook</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;