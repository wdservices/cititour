import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Star, ThumbsUp, Bug, Lightbulb, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const feedbackTypes = [
  { value: "general", label: "General Feedback", icon: MessageSquare, description: "Overall app experience" },
  { value: "bug", label: "Bug Report", icon: Bug, description: "Something isn't working" },
  { value: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggest new features" },
  { value: "business", label: "Business Inquiry", icon: User, description: "Business-related questions" }
];

const recentFeedback = [
  {
    id: "1",
    type: "Feature Request",
    subject: "Dark mode support",
    date: "2024-01-15",
    status: "In Progress",
    response: "Thanks for the suggestion! We're working on dark mode and it will be available in the next update."
  },
  {
    id: "2", 
    type: "Bug Report",
    subject: "Search not working on iOS",
    date: "2024-01-10",
    status: "Resolved",
    response: "This issue has been fixed in version 1.2.1. Please update your app."
  }
];

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState("");
  const [rating, setRating] = useState(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate submission
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your feedback. We'll respond within 24 hours.",
    });

    // Reset form
    setFeedbackType("");
    setRating(0);
    setSubject("");
    setMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-yellow-500";
      case "Resolved": return "bg-green-500";
      case "Under Review": return "bg-blue-500";
      default: return "bg-gray-500";
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Feedback</h1>
              <p className="text-white/90">Help us improve TourPH</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Share Your Feedback</CardTitle>
                <CardDescription>
                  We value your opinion and use it to improve our app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Type */}
                  <div>
                    <Label className="text-base font-medium">What type of feedback do you have? *</Label>
                    <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="mt-3">
                      {feedbackTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div key={type.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                            <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                            <div className="flex-1 cursor-pointer" onClick={() => setFeedbackType(type.value)}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-primary" />
                                <Label htmlFor={type.value} className="cursor-pointer font-medium">
                                  {type.label}
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="text-base font-medium">Overall Rating</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition-colors"
                        >
                          <Star 
                            className={`h-8 w-8 ${
                              star <= rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        You rated {rating} star{rating !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your feedback"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Detailed Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed feedback. The more specific you are, the better we can help..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {message.length}/500 characters
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Provide your email if you'd like a response
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Response Time */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Quick Response</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to feedback within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Previous Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Your Previous Feedback</CardTitle>
                <CardDescription>Track the status of your submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{feedback.type}</Badge>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{feedback.subject}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Submitted on {new Date(feedback.date).toLocaleDateString()}
                      </p>
                      {feedback.response && (
                        <div className="bg-muted/50 p-3 rounded text-sm">
                          <strong>Response:</strong> {feedback.response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-medium">Email Support</Label>
                  <p className="text-sm text-muted-foreground">support@gardencityexplore.com</p>
                </div>
                <Separator />
                <div>
                  <Label className="font-medium">Phone Support</Label>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                </div>
                <Separator />
                <div>
                  <Label className="font-medium">Live Chat</Label>
                  <p className="text-sm text-muted-foreground">Available 24/7 in the app</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;