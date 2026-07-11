import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share, Copy, MessageCircle, Mail, Facebook, Twitter, Instagram, QrCode, Gift, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const socialPlatforms = [
  { name: "WhatsApp", icon: MessageCircle, color: "bg-green-500", shareUrl: "whatsapp://send?text=" },
  { name: "Facebook", icon: Facebook, color: "bg-primary", shareUrl: "https://facebook.com/sharer/sharer.php?u=" },
  { name: "Twitter", icon: Twitter, color: "bg-accent", shareUrl: "https://twitter.com/intent/tweet?text=" },
  { name: "Instagram", icon: Instagram, color: "bg-pink-500", shareUrl: "" },
  { name: "Email", icon: Mail, color: "bg-gray-600", shareUrl: "mailto:?subject=Check out CititourNG&body=" }
];

const rewards = [
  { milestone: 1, reward: "$5 Credit", description: "First successful referral" },
  { milestone: 5, reward: "$25 Credit", description: "5 friends join" },
  { milestone: 10, reward: "$60 Credit", description: "10 friends join" },
  { milestone: 25, reward: "VIP Status", description: "25 friends join" }
];

const ShareAppPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [referralCode] = useState("GC2024JOHN");
  const [referrals] = useState(3);

  const referralLink = `https://cititourng.com/join?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const shareToSocial = (platform: typeof socialPlatforms[0]) => {
    const message = `🌟 Discover amazing places in Nigeria with CititourNG! Join me and get exclusive deals. Use my referral code: ${referralCode} ${referralLink}`;
    
    if (platform.name === "WhatsApp") {
      window.open(`${platform.shareUrl}${encodeURIComponent(message)}`, '_blank');
    } else if (platform.name === "Email") {
      window.open(`${platform.shareUrl}${encodeURIComponent(message)}`, '_blank');
    } else if (platform.name === "Facebook") {
      window.open(`${platform.shareUrl}${encodeURIComponent(referralLink)}`, '_blank');
    } else if (platform.name === "Twitter") {
      window.open(`${platform.shareUrl}${encodeURIComponent(message)}`, '_blank');
    } else if (platform.name === "Instagram") {
      toast({
        title: "Instagram Sharing",
        description: "Share your referral code in your Instagram stories or posts!",
      });
    }
  };

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
              <Share className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Share CititourNG</h1>
              <p className="text-white/90">Invite friends and earn rewards</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Referral Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{referrals}</p>
              <p className="text-sm text-muted-foreground">Friends Joined</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Gift className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">$15</p>
              <p className="text-sm text-muted-foreground">Rewards Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">Gold</p>
              <p className="text-sm text-muted-foreground">Current Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends and earn $5 for each successful referral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referralCode">Your Referral Code</Label>
              <div className="flex gap-2">
                <Input
                  id="referralCode"
                  value={referralCode}
                  readOnly
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(referralCode)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="referralLink">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  id="referralLink"
                  value={referralLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(referralLink)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div className="text-center">
                <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">QR Code</p>
                <p className="text-xs text-muted-foreground">Let friends scan to join instantly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Share on Social Media</CardTitle>
            <CardDescription>
              Choose your preferred platform to share with friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                    onClick={() => shareToSocial(platform)}
                  >
                    <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm">{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Program */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Referral Rewards</CardTitle>
            <CardDescription>
              Earn amazing rewards for every friend you bring to CititourNG
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div 
                  key={reward.milestone}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    referrals >= reward.milestone 
                      ? "bg-green-50 border-green-200" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      referrals >= reward.milestone 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-300 text-gray-600"
                    }`}>
                      {reward.milestone}
                    </div>
                    <div>
                      <p className="font-semibold">{reward.reward}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  {referrals >= reward.milestone ? (
                    <Badge className="bg-green-500">Earned</Badge>
                  ) : (
                    <Badge variant="outline">
                      {reward.milestone - referrals} more
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>How Referrals Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Share Your Link</h3>
                <p className="text-sm text-muted-foreground">
                  Send your unique referral link to friends and family
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Friend Joins</h3>
                <p className="text-sm text-muted-foreground">
                  They download the app and complete their first booking
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. You Both Earn</h3>
                <p className="text-sm text-muted-foreground">
                  You get $5 credit, they get $5 welcome bonus
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShareAppPage;