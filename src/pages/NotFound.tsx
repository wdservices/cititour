import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* 404 Icon */}
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-hero">
          <span className="text-6xl text-primary-foreground font-bold">404</span>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. Let's get you back to exploring the Philippines.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/5"
            onClick={() => window.location.href = '/'}
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-primary"
            onClick={() => window.location.href = '/?search=true'}
          >
            <Search className="mr-2 h-4 w-4" />
            Search Instead
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;