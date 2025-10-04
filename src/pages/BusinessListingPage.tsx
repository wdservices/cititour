import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Upload, Star, MapPin, Phone, Globe, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const categories = [
  "Restaurant", "Hotel", "Event Venue", "Shopping", "Entertainment", 
  "Attraction", "Spa & Wellness", "Business Services", "Other"
];

const pricingPlans = [
  {
    name: "Basic Listing",
    price: "$29/month",
    features: ["Business profile", "Contact information", "Basic photos", "Customer reviews"],
    popular: false
  },
  {
    name: "Featured Listing",
    price: "$59/month", 
    features: ["Everything in Basic", "Featured placement", "Priority support", "Analytics dashboard", "Social media links"],
    popular: true
  },
  {
    name: "Premium Listing",
    price: "$99/month",
    features: ["Everything in Featured", "Top search results", "Custom branding", "Advanced analytics", "Priority customer support"],
    popular: false
  }
];

const BusinessListingPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-8">
        <div className="px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Business Listing</h1>
              <p className="text-white/90">List your business on TourPH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.name 
                    ? "ring-2 ring-primary border-primary" 
                    : "hover:shadow-md"
                } ${plan.popular ? "relative" : ""}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Business Information Form */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" placeholder="Enter your business name" />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="+1234567890" />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourwebsite.com" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input id="address" placeholder="Enter your business address" />
              </div>

              <div>
                <Label htmlFor="hours">Operating Hours</Label>
                <Input id="hours" placeholder="e.g., Mon-Fri: 9AM-5PM" />
              </div>

              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">$ - Budget Friendly</SelectItem>
                    <SelectItem value="moderate">$$ - Moderate</SelectItem>
                    <SelectItem value="expensive">$$$ - Expensive</SelectItem>
                    <SelectItem value="luxury">$$$$ - Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Contact Email *</Label>
                <Input id="email" placeholder="contact@yourbusiness.com" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Business Description *</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your business, services, and what makes it unique..."
              rows={4}
            />
          </div>

          <div>
            <Label>Business Photos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Click to upload or drag and drop photos</p>
              <p className="text-sm text-gray-400">PNG, JPG up to 10MB each (max 10 photos)</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <p className="text-sm text-muted-foreground">
              * Required fields. Your listing will be reviewed within 24 hours.
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90">
                Submit Listing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessListingPage;