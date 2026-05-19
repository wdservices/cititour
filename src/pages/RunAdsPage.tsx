import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone, Target, TrendingUp, Users, Eye, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const adTypes = [
  {
    type: "Banner Ad",
    price: "$50/week",
    description: "Featured banner on homepage and category pages",
    features: ["Prime visibility", "Click tracking", "Mobile optimized"],
    icon: Eye
  },
  {
    type: "Sponsored Listing", 
    price: "$30/week",
    description: "Appear at the top of search results",
    features: ["Priority placement", "Enhanced visibility", "Performance analytics"],
    icon: TrendingUp
  },
  {
    type: "Featured Business",
    price: "$100/week", 
    description: "Highlighted across all relevant pages",
    features: ["Maximum exposure", "Social media promotion", "Premium support"],
    icon: Target
  }
];

const campaignStats = [
  { label: "Total Impressions", value: "12,547", icon: Eye },
  { label: "Click-through Rate", value: "3.2%", icon: TrendingUp },
  { label: "Total Clicks", value: "402", icon: Users },
  { label: "Cost Per Click", value: "$0.75", icon: DollarSign }
];

const RunAdsPage = () => {
  const navigate = useNavigate();
  const [selectedAdType, setSelectedAdType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-8">
        <div className="px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate('/explore')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Run Ads</h1>
              <p className="text-white/90">Promote your business to thousands of users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Create Campaign Tab */}
          <TabsContent value="create" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose Ad Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {adTypes.map((ad) => {
                  const Icon = ad.icon;
                  return (
                    <Card 
                      key={ad.type}
                      className={`cursor-pointer transition-all ${
                        selectedAdType === ad.type 
                          ? "ring-2 ring-primary border-primary" 
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedAdType(ad.type)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{ad.type}</CardTitle>
                        </div>
                        <CardDescription className="text-lg font-semibold text-primary">
                          {ad.price}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
                        <ul className="space-y-1">
                          {ad.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Campaign Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaignName">Campaign Name *</Label>
                    <Input id="campaignName" placeholder="Enter campaign name" />
                  </div>
                  
                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="local">Local Residents</SelectItem>
                        <SelectItem value="tourists">Tourists & Visitors</SelectItem>
                        <SelectItem value="business">Business Travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget">Weekly Budget</Label>
                    <Input id="budget" placeholder="$100" type="number" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>

                  <div>
                    <Label htmlFor="duration">Campaign Duration</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Week</SelectItem>
                        <SelectItem value="2">2 Weeks</SelectItem>
                        <SelectItem value="4">1 Month</SelectItem>
                        <SelectItem value="12">3 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Business Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="adContent">Ad Content</Label>
                <Textarea 
                  id="adContent" 
                  placeholder="Write compelling ad content that highlights your business..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <p className="text-sm text-muted-foreground">
                  Campaigns are reviewed within 2 hours. Payment is processed upon approval.
                </p>
                <div className="space-x-4">
                  <Button variant="outline" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Launch Campaign
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Active Campaigns Tab */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Summer Restaurant Promotion
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">Active</Badge>
                  <Badge variant="outline">Banner Ad</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">1,247</p>
                    <p className="text-sm text-muted-foreground">Impressions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">2.8%</p>
                    <p className="text-sm text-muted-foreground">CTR</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">35</p>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">5 days</p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Pause</Button>
                  <Button variant="destructive" size="sm">Stop</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {campaignStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-primary mt-2">{stat.value}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Overview</CardTitle>
                <CardDescription>Last 30 days performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics chart will be displayed here</p>
                    <p className="text-sm">Connect to analytics service for detailed insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RunAdsPage;