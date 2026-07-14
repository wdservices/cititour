import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone, Target, TrendingUp, Users, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import StampIcon from "@/components/StampIcon";

const adTypes = [
  {
    type: "Banner Ad",
    price: "₦50,000/week",
    description: "Featured banner on homepage and category pages",
    features: ["Prime visibility", "Click tracking", "Mobile optimized"],
    icon: Eye,
    tone: "primary" as const,
    rotate: "-rotate-6" as const,
  },
  {
    type: "Sponsored Listing",
    price: "₦30,000/week",
    description: "Appear at the top of search results",
    features: ["Priority placement", "Enhanced visibility", "Performance analytics"],
    icon: TrendingUp,
    tone: "accent" as const,
    rotate: "rotate-3" as const,
  },
  {
    type: "Featured Event",
    price: "₦100,000/week",
    description: "Highlighted across all relevant pages",
    features: ["Maximum exposure", "Social media promotion", "Premium support"],
    icon: Target,
    tone: "success" as const,
    rotate: "-rotate-3" as const,
  },
];

const campaignStats = [
  { label: "Total Impressions", value: "12,547", icon: Eye, tone: "primary" as const },
  { label: "Click-through Rate", value: "3.2%", icon: TrendingUp, tone: "accent" as const },
  { label: "Total Clicks", value: "402", icon: Users, tone: "success" as const },
  { label: "Cost Per Click", value: "₦750", icon: Megaphone, tone: "primary-dark" as const },
];

const RunAdsPage = () => {
  const navigate = useNavigate();
  const [selectedAdType, setSelectedAdType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background">
        <div className="px-4 py-8 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-muted mb-4"
            onClick={() => navigate("/explore")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 group">
            <StampIcon icon={Megaphone} tone="accent" size="md" />
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Promote</span>
              <h1 className="font-display text-3xl font-extrabold">Run Ads</h1>
              <p className="text-muted-foreground">Promote your business to thousands of users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <div>
              <h2 className="font-display text-xl font-bold mb-4">Choose ad format</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {adTypes.map((ad) => (
                  <button
                    key={ad.type}
                    type="button"
                    onClick={() => setSelectedAdType(ad.type)}
                    className={`group text-left p-6 rounded-2xl bg-card border transition-all ${
                      selectedAdType === ad.type
                        ? "border-primary shadow-card"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <StampIcon icon={ad.icon} tone={ad.tone} size="md" rotate={ad.rotate} className="mb-4" />
                    <h3 className="font-display text-lg font-bold">{ad.type}</h3>
                    <p className="text-accent font-semibold mt-1">{ad.price}</p>
                    <p className="text-sm text-muted-foreground mt-2 mb-3">{ad.description}</p>
                    <ul className="space-y-1.5">
                      {ad.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-6 rounded-2xl bg-card border border-border p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold">Campaign details</h2>

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
                    <Label htmlFor="budget">Weekly Budget (₦)</Label>
                    <Input id="budget" placeholder="100000" type="number" />
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  Campaigns are reviewed within 2 hours. Payment is processed upon approval.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full" onClick={() => (window.history.length > 2 ? navigate(-1) : navigate("/explore"))}>
                    Cancel
                  </Button>
                  <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Launch Campaign
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Summer Restaurant Promotion
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-success text-success-foreground border-0">Active</Badge>
                  <Badge variant="outline">Banner Ad</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="font-display text-2xl font-bold text-primary">1,247</p>
                    <p className="text-sm text-muted-foreground">Impressions</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-primary">2.8%</p>
                    <p className="text-sm text-muted-foreground">CTR</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-primary">35</p>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-primary">5 days</p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Edit</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Pause</Button>
                  <Button variant="destructive" size="sm" className="rounded-full">Stop</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {campaignStats.map((stat) => (
                <div key={stat.label} className="group rounded-2xl bg-card border border-border p-5 shadow-soft">
                  <StampIcon icon={stat.icon} tone={stat.tone} size="sm" className="mb-3" />
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="font-display">Campaign performance</CardTitle>
                <CardDescription>Last 30 days — mock preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-muted-foreground">
                  <div className="text-center px-4">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary opacity-60" />
                    <p className="font-medium text-foreground">Analytics preview</p>
                    <p className="text-sm mt-1">Live metrics connect once a campaign is running</p>
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
