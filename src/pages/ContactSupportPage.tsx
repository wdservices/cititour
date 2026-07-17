import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Phone, Mail, MessageCircle, Clock, Search, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

const supportChannels = [
  {
    name: "Email Support",
    description: "Send us a detailed message at hello.bluewavestech@gmail.com",
    availability: "24/7",
    responseTime: "< 4 hours",
    icon: Mail,
    color: "bg-primary",
    available: true
  },
  {
    name: "Live Chat",
    description: "Get instant help from our support team",
    availability: "Mon-Fri, 9AM-6PM WAT",
    responseTime: "< 5 minutes",
    icon: MessageCircle,
    color: "bg-green-500",
    available: false
  },
  {
    name: "Phone Support",
    description: "Speak directly with our team",
    availability: "Mon-Fri, 9AM-5PM WAT",
    responseTime: "Immediate",
    icon: Phone,
    color: "bg-accent",
    available: false
  }
];

const faqData = [
  {
    category: "Account & Authentication",
    questions: [
      {
        question: "How do I create an account?",
        answer: "Visit CitiTour and click 'Get Started' or 'Sign In'. You can sign up with your email and password, or use Google for one-click registration."
      },
      {
        question: "Why do I have to sign in again every time I reload the page?",
        answer: "CitiTour uses session-based authentication for security. Your sign-in state is cleared when you close your browser tab or reload the page. This protects your account if you're using a shared or public device."
      },
      {
        question: "How do I reset my password?",
        answer: "On the login page, click 'Forgot Password' and enter your email. You'll receive a password reset link. Alternatively, contact support for assistance."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes. Go to Settings in the side menu and find the option to delete your account. Note that this action cannot be undone — all your data will be permanently removed."
      }
    ]
  },
  {
    category: "Discovering Places & Events",
    questions: [
      {
        question: "How does CitiTour know my location?",
        answer: "When you first visit, CitiTour asks for your location (with your permission) to show localised content. Your city determines your regional branding — e.g., TourLAG for Lagos, TourRIV for Rivers, TourABJ for Abuja. You can change this in Settings."
      },
      {
        question: "What can I find on the Explore page?",
        answer: "The Explore page shows businesses, events, marketplace products, and property listings. You can scroll through each category or click 'View More' to see the full list."
      },
      {
        question: "How do I save a place or event?",
        answer: "Tap the heart icon on any listing card to add it to your favourites. Access all your saved items from the side menu under 'Favourites'."
      },
      {
        question: "How do I leave a review?",
        answer: "Open any business or event detail page and scroll to the Reviews section. You must be signed in to submit a review with a rating and comment."
      }
    ]
  },
  {
    category: "Marketplace",
    questions: [
      {
        question: "What is the Marketplace?",
        answer: "The Marketplace is where local sellers list products and services — electronics, fashion, vehicles, property, and more. Browse by category, compare prices, and contact sellers directly."
      },
      {
        question: "How do discounts work?",
        answer: "Sellers can set a regular price and a promo price. When the promo price is lower, CitiTour displays the original price with a strikethrough and highlights the discounted price."
      },
      {
        question: "How do I list a product for sale?",
        answer: "Go to your Dashboard (click the profile icon) and select 'Post a Product/Service'. Fill in the product name, price, promo price (optional), category, description, and upload an image. Your listing will appear on the Marketplace."
      },
      {
        question: "How do I contact a seller?",
        answer: "Open the product detail page and use the contact information provided by the seller (phone number, WhatsApp, etc.) to arrange purchase and delivery."
      }
    ]
  },
  {
    category: "Events & Ticketing",
    questions: [
      {
        question: "How do I buy an event ticket?",
        answer: "Open any event, select a ticket tier and quantity, fill in your registration details, and pay via card, bank transfer, or your CitiTour wallet. You'll receive a confirmation after payment."
      },
      {
        question: "Can I pay for event tickets with my wallet?",
        answer: "Yes! If you have sufficient balance in your CitiTour wallet, you can select 'Wallet' as your payment method when purchasing event tickets."
      },
      {
        question: "Where can I see my event tickets?",
        answer: "Go to your Dashboard and click the 'My Events' tab. You'll see a 'My Tickets' section showing all events you've registered for, with options to view details or cancel."
      },
      {
        question: "How do I create an event?",
        answer: "Go to your Dashboard and select the 'Events' tab. Click 'Create Event' and fill in the event title, category, dates, times, venue, ticket tiers, description, and location on the map. Upload a banner image and click 'Create Listing'."
      },
      {
        question: "Can I edit my event after creating it?",
        answer: "Yes. In your Dashboard's 'My Events' tab, click the 'Edit' button on any event. You can update all details including title, dates, ticket tiers, venue, map location, and banner image."
      },
      {
        question: "How do attendees get notified?",
        answer: "When someone registers for your event, their details (name, email, phone) appear in your Dashboard under 'Attendees'. You can also download a CSV report with full event analytics."
      }
    ]
  },
  {
    category: "Wallet & Payments",
    questions: [
      {
        question: "How do I fund my wallet?",
        answer: "Go to your Wallet page and click 'Add Money'. Enter an amount and complete the payment via Paystack — you can use debit card, bank transfer, or USSD."
      },
      {
        question: "How do I withdraw from my wallet?",
        answer: "Go to your Wallet page, click 'Withdraw', and enter the amount. You'll need to link a Nigerian bank account first (select your bank, enter account number — it's verified automatically). A 1.5% service fee applies."
      },
      {
        question: "Is my money safe in the wallet?",
        answer: "Your wallet balance is stored securely in Firebase. Payments are processed by Paystack, a PCI-compliant payment processor. We never see or store your card or bank details."
      },
      {
        question: "What can I use my wallet balance for?",
        answer: "You can use your wallet to purchase event tickets on CitiTour. Wallet funds cannot be transferred between users or withdrawn as cash outside the Platform."
      },
      {
        question: "What are the withdrawal fees?",
        answer: "A 1.5% service fee is deducted from your withdrawal amount. The fee breakdown is displayed before you confirm any withdrawal."
      }
    ]
  },
  {
    category: "Listings & Dashboard",
    questions: [
      {
        question: "How do I list my business on CitiTour?",
        answer: "Click the profile icon to go to your Dashboard, then select 'Listings' tab. Click 'Create New' and choose 'Register Business'. Fill in your business name, category, state, city, address, phone, and upload a cover image."
      },
      {
        question: "How do I list a property?",
        answer: "In your Dashboard, click 'Create New' and select 'List a Property'. Enter the property name, type (shortlet, apartment, land, etc.), state, city, address, and upload photos."
      },
      {
        question: "Can I edit or delete my listings?",
        answer: "Yes. In your Dashboard, find the listing you want to change and click 'Edit' or 'Delete'. Deletion requires double confirmation for safety. When you delete a listing, associated images are also removed from Cloudinary."
      },
      {
        question: "How do I run ads for my listing?",
        answer: "Go to your Wallet and click 'Run Ads', or visit the Run Ads page directly. You'll need a minimum wallet balance to create an ad campaign."
      }
    ]
  },
  {
    category: "Split It (Bill Splitting)",
    questions: [
      {
        question: "What is Split It?",
        answer: "Split It lets you split a bill or expense with friends. Enter the total amount, add the people splitting, and CitiTour calculates each person's share."
      },
      {
        question: "Does Split It handle payments?",
        answer: "Currently, Split It calculates and displays each person's share. Actual payment between friends is handled outside the app (bank transfer, cash, etc.)."
      }
    ]
  }
];

const ContactSupportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !ticketSubject || !ticketMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Support Ticket Created!",
      description: "We've received your request and will respond within 4 hours.",
    });

    setSelectedCategory("");
    setTicketSubject("");
    setTicketMessage("");
  };

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
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Contact Support</h1>
              <p className="text-white/90">We're here to help you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="channels">Contact Us</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
          </TabsList>

          {/* Contact Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">How can we help you today?</h2>
              <p className="text-muted-foreground">Choose your preferred way to get in touch with our support team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <Card 
                    key={channel.name} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      !channel.available ? "opacity-60" : "hover:scale-105"
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Availability:</span>
                          <Badge variant={channel.available ? "default" : "secondary"}>
                            {channel.availability}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Response:</span>
                          <span className="font-medium">{channel.responseTime}</span>
                        </div>
                      </div>

                      <Button 
                        className={`w-full ${channel.available ? "bg-primary hover:opacity-90" : ""}`}
                        disabled={!channel.available}
                        onClick={() => {
                          if (channel.name === "Email Support") {
                            window.location.href = "mailto:hello.bluewavestech@gmail.com";
                          }
                        }}
                      >
                        {channel.available ? `Start ${channel.name}` : "Currently Unavailable"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Separator />

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/docs')}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Browse Help Center</h4>
                      <p className="text-sm text-muted-foreground">Step-by-step guides for all CitiTour features</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/profile/dashboard')}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Manage Your Listings</h4>
                      <p className="text-sm text-muted-foreground">Edit, update, or delete your listings from your dashboard</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/wallet')}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Wallet & Payments</h4>
                      <p className="text-sm text-muted-foreground">Fund wallet, withdraw, or view transaction history</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => navigate('/feedback')}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Send Feedback</h4>
                      <p className="text-sm text-muted-foreground">Suggest new features or report issues</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Find quick answers to common questions</p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* FAQ Categories */}
            <div className="space-y-6">
              {filteredFAQs.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.questions.map((faq, index) => (
                        <Collapsible key={index}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-4 h-auto text-left">
                              <span className="font-medium">{faq.question}</span>
                              <ChevronRight className="h-4 w-4 transition-transform" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Submit Ticket Tab */}
          <TabsContent value="ticket" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Submit a Support Ticket</h2>
              <p className="text-muted-foreground">Can't find what you're looking for? Send us a message</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <CardDescription>
                    Provide as much detail as possible to help us resolve your issue quickly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-6">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="payment">Wallet & Payment Issues</SelectItem>
                          <SelectItem value="event">Event Ticketing</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="listing">Listing Problems</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, and any other relevant information..."
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low — General inquiry</SelectItem>
                          <SelectItem value="normal">Normal — Standard issue</SelectItem>
                          <SelectItem value="high">High — Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical — App not working</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium text-primary-dark">What happens next?</h4>
                          <ul className="text-sm text-primary mt-1 space-y-1">
                            <li>We'll send you a confirmation email with your ticket ID</li>
                            <li>Our team will review your request within 4 hours</li>
                            <li>You'll receive updates via email as we work on your case</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:opacity-90">
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContactSupportPage;
