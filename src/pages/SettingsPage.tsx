import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Shield, Bell, User, CreditCard, Download, Trash2, Eye, EyeOff, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegion } from "@/contexts/RegionContext";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { region, brandName, setRegion } = useRegion();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [bizCount, setBizCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [propertyCount, setPropertyCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [memberSince, setMemberSince] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", user.id));
        if (cancelled) return;
        if (userSnap.exists()) {
          const d = userSnap.data();
          const names = (d.name || user.name || "").split(" ");
          setFirstName(names[0] || "");
          setLastName(names.slice(1).join(" ") || "");
          setEmail(d.email || user.email || "");
          setPhone(d.phone || "");
          if (d.createdAt?.toDate) {
            setMemberSince(d.createdAt.toDate().toLocaleDateString("en-US", { month: "short", year: "numeric" }));
          }
        } else {
          const names = (user.name || "").split(" ");
          setFirstName(names[0] || "");
          setLastName(names.slice(1).join(" ") || "");
          setEmail(user.email || "");
        }

        const [bizSnap, prodSnap, propSnap, favSnap, walletSnap] = await Promise.all([
          getDocs(query(collection(db, "businesses"), where("ownerId", "==", user.id))),
          getDocs(query(collection(db, "marketplace"), where("ownerId", "==", user.id))),
          getDocs(query(collection(db, "house_listings"), where("ownerId", "==", user.id))),
          getDoc(doc(db, "users", user.id, "private", "favourites")),
          getDoc(doc(db, "wallets", user.id)),
        ]);

        if (cancelled) return;
        setBizCount(bizSnap.size);
        setProductCount(prodSnap.size);
        setPropertyCount(propSnap.size);
        if (favSnap.exists()) {
          const f = favSnap.data();
          setSavedCount((f.businesses?.length || 0) + (f.events?.length || 0) + (f.marketplace?.length || 0));
        }
        if (walletSnap.exists()) {
          setWalletBalance(walletSnap.data().balance || 0);
        }

        const reviewSnap = await getDocs(query(collection(db, "reviews"), where("userId", "==", user.id)));
        if (!cancelled) setReviewCount(reviewSnap.size);
      } catch (e) {
        console.error("Settings load error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleSaveAccount = async () => {
    if (!user?.id) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: [firstName, lastName].filter(Boolean).join(" "),
        phone,
      });
      setSaveMsg("Account info saved.");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      setSaveMsg("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const accountStats = [
    { label: "Account Created", value: loading ? "..." : memberSince || "N/A" },
    { label: "Total Listings", value: loading ? "..." : String(bizCount + productCount + propertyCount) },
    { label: "Reviews Written", value: loading ? "..." : String(reviewCount) },
    { label: "Wallet Balance", value: loading ? "..." : `₦${walletBalance.toLocaleString()}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-8">
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
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings & Privacy</h1>
              <p className="text-white/90">Manage your account and privacy preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {accountStats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold text-primary">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your personal and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} disabled className="opacity-70" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button className="bg-primary hover:opacity-90" onClick={handleSaveAccount} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                  {saveMsg && <span className="text-sm text-muted-foreground">{saveMsg}</span>}
                </div>
              </CardContent>
            </Card>

            {/* Region & Branding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Region & Branding
                </CardTitle>
                <CardDescription>Choose your region to personalize listings and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Brand</Label>
                  <p className="text-sm text-muted-foreground">{brandName}</p>
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={region} onValueChange={(val) => setRegion(val as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PH">Rivers (PH)</SelectItem>
                      <SelectItem value="LAG">Lagos (LAG)</SelectItem>
                      <SelectItem value="ABJ">Abuja (ABJ)</SelectItem>
                      <SelectItem value="KAN">Kano (KAN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Enhance your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Authenticator App</span>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your account is protected with Google Authenticator
                    </p>
                    <Button variant="outline" size="sm">
                      Reconfigure
                    </Button>
                  </div>
                )}

                <Separator />

                <div>
                  <Label>Login Activity</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Signed in now</p>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Controls</CardTitle>
                <CardDescription>Control who can see your information and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Allow others to find and view your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Location Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share your location for better recommendations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activity Status</Label>
                    <p className="text-sm text-muted-foreground">Show when you're active in the app</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Review Visibility</Label>
                    <p className="text-sm text-muted-foreground">Make your reviews visible to other users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div>
                  <Label>Data Usage Consent</Label>
                  <p className="text-sm text-muted-foreground mb-3">Choose how we use your data to improve the app</p>
                  <Select defaultValue="essential">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essential">Essential Only</SelectItem>
                      <SelectItem value="analytics">Analytics + Essential</SelectItem>
                      <SelectItem value="personalized">Full Personalization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Rights</CardTitle>
                <CardDescription>Exercise your data protection rights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Request Data Export
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/privacy")}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Privacy Policy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Cookie Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Notification Types</Label>
                  <div className="space-y-3 mt-3">
                    {[
                      { name: "Event Updates", desc: "Updates for events you registered for", enabled: true },
                      { name: "Special Offers", desc: "Deals and promotions", enabled: false },
                      { name: "New Events", desc: "Upcoming events near you", enabled: true },
                      { name: "Chat Messages", desc: "New messages from businesses", enabled: true },
                      { name: "App Updates", desc: "New features and updates", enabled: false }
                    ].map((notification) => (
                      <div key={notification.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label>{notification.name}</Label>
                          <p className="text-sm text-muted-foreground">{notification.desc}</p>
                        </div>
                        <Switch defaultChecked={notification.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your app data and storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{loading ? "..." : bizCount + productCount + propertyCount}</p>
                      <p className="text-sm text-muted-foreground">Your Listings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{loading ? "..." : savedCount}</p>
                      <p className="text-sm text-muted-foreground">Saved Places</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{loading ? "..." : reviewCount}</p>
                      <p className="text-sm text-muted-foreground">Reviews Written</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                </div>

                <Separator />

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-4">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  
                  <div className="space-y-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your account and all associated data. You will lose access to all your listings, reviews, and saved places. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default SettingsPage;
