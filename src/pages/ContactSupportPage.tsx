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
    name: "Live Chat",
    description: "Get instant help from our support team",
    availability: "24/7",
    responseTime: "< 2 minutes",
    icon: MessageCircle,
    color: "bg-green-500",
    available: true
  },
  {
    name: "Email Support",
    description: "Send us a detailed message",
    availability: "24/7",
    responseTime: "< 4 hours",
    icon: Mail,
    color: "bg-blue-500",
    available: true
  },
  {
    name: "Phone Support",
    description: "Speak directly with our team",
    availability: "Mon-Fri, 9AM-6PM EST",
    responseTime: "Immediate",
    icon: Phone,
    color: "bg-purple-500",
    available: false
  }
];

const faqData = [
  {
    category: "Account & Profile",
    questions: [
      {
        question: "How do I reset my password?",
        answer: "Go to Settings > Account > Change Password, or use the 'Forgot Password' link on the login screen."
      },
      {
        question: "How can I update my profile information?",
        answer: "Navigate to Profile in the side menu and click the Edit button to update your personal information."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, go to Settings > Data > Delete Account. Note that this action cannot be undone."
      }
    ]
  },
  {
    category: "Bookings & Reservations",
    questions: [
      {
        question: "How do I cancel a booking?",
        answer: "Go to your booking confirmation email and click 'Cancel Booking', or contact the business directly."
      },
      {
        question: "What is your refund policy?",
        answer: "Refund policies vary by business. Check the cancellation policy when booking or contact the business directly."
      },
      {
        question: "I didn't receive my booking confirmation",
        answer: "Check your spam folder. If still missing, contact us with your booking details and we'll resend it."
      }
    ]
  },
  {
    category: "App Features",
    questions: [
      {
        question: "How do I save places to my favorites?",
        answer: "Tap the heart icon on any listing to save it to your favorites. Access them from the side menu."
      },
      {
        question: "Can I use the app offline?",
        answer: "Some features work offline, but you'll need internet connection for bookings and real-time information."
      },
      {
        question: "How do I share a place with friends?",
        answer: "Tap the share button on any listing to send it via social media, email, or messaging apps."
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
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Contact Support</h1>
              <p className="text-white/90">We're here to help you 24/7</p>
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
                        className={`w-full ${channel.available ? "bg-gradient-primary hover:opacity-90" : ""}`}
                        disabled={!channel.available}
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
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Check Order Status</h4>
                      <p className="text-sm text-muted-foreground">Track your bookings and reservations</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Report a Problem</h4>
                      <p className="text-sm text-muted-foreground">Having issues with the app or a business?</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Business Partnership</h4>
                      <p className="text-sm text-muted-foreground">Learn about listing your business</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Feature Request</h4>
                      <p className="text-sm text-muted-foreground">Suggest new features for the app</p>
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
                          <SelectItem value="booking">Booking Problems</SelectItem>
                          <SelectItem value="payment">Payment Issues</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="business">Business Inquiry</SelectItem>
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
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="normal">Normal - Standard issue</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical - App not working</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">What happens next?</h4>
                          <ul className="text-sm text-blue-600 mt-1 space-y-1">
                            <li>• We'll send you a confirmation email with your ticket ID</li>
                            <li>• Our team will review your request within 4 hours</li>
                            <li>• You'll receive updates via email as we work on your case</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
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