import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Clock, MapPin, Star, Percent, Gift, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import eventMusic from "@/assets/event-music.jpg";
import eventFood from "@/assets/event-food.jpg";
import restaurantFine from "@/assets/restaurant-fine.jpg";
import hotelLuxury from "@/assets/hotel-luxury.jpg";

const upcomingEvents = [
  {
    id: "1",
    title: "Garden City Summer Festival",
    description: "3-day music and arts festival with local and international performers",
    image: eventMusic,
    date: "2024-07-15",
    time: "6:00 PM",
    location: "Central Park",
    price: "Free Entry",
    category: "Music",
    rating: 4.8,
    attendees: 2500,
    isNew: true
  },
  {
    id: "2", 
    title: "Wine & Dine Experience",
    description: "Premium food and wine tasting event featuring top local restaurants",
    image: eventFood,
    date: "2024-06-20",
    time: "7:00 PM",
    location: "Garden City Convention Center",
    price: "$75",
    category: "Food",
    rating: 4.9,
    attendees: 150,
    isNew: false
  }
];

const activeDeals = [
  {
    id: "1",
    title: "50% Off Fine Dining",
    business: "Garden Bistro",
    description: "Half price on all main courses. Valid Monday-Thursday.",
    image: restaurantFine,
    discount: "50%",
    originalPrice: "$80",
    salePrice: "$40",
    validUntil: "2024-06-30",
    category: "Restaurant",
    rating: 4.8,
    isLimited: true,
    claimed: 45,
    maxClaims: 100
  },
  {
    id: "2",
    title: "Weekend Getaway Deal",
    business: "Garden City Grand Hotel", 
    description: "Luxury hotel stay with complimentary breakfast and spa access.",
    image: hotelLuxury,
    discount: "30%",
    originalPrice: "$300",
    salePrice: "$210",
    validUntil: "2024-07-15",
    category: "Hotel",
    rating: 4.9,
    isLimited: false,
    claimed: 23,
    maxClaims: 50
  }
];

const dealCategories = [
  { name: "All Deals", count: 24, icon: Tag },
  { name: "Restaurants", count: 12, icon: "🍽️" },
  { name: "Hotels", count: 6, icon: "🏨" },
  { name: "Events", count: 4, icon: "🎟️" },
  { name: "Shopping", count: 2, icon: "🛍️" }
];

const EventsDealsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Deals");

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
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Events & Deals</h1>
              <p className="text-white/90">Discover events and exclusive offers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="deals">Active Deals</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">This Week's Events</h2>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.isNew && (
                        <Badge className="absolute top-3 left-3 bg-red-500">
                          New Event
                        </Badge>
                      )}
                      <Badge className="absolute top-3 right-3 bg-primary">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{event.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {event.attendees} attending
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-primary mb-3">{event.price}</p>
                          <Button className="bg-gradient-primary hover:opacity-90">
                            Get Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center py-8">
              <Button variant="outline" className="w-full md:w-auto">
                View All Events
              </Button>
            </div>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {dealCategories.map((category) => (
                <Card 
                  key={category.name}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === category.name 
                      ? "ring-2 ring-primary border-primary" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">
                      {typeof category.icon === 'string' ? category.icon : <category.icon className="h-6 w-6 mx-auto text-primary" />}
                    </div>
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.count} deals</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeDeals.map((deal) => (
                <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={deal.image}
                      alt={deal.business}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                        -{deal.discount} OFF
                      </Badge>
                    </div>
                    {deal.isLimited && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500 text-black">
                        <Zap className="h-3 w-3 mr-1" />
                        Limited Time
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{deal.title}</h3>
                        <p className="text-sm text-muted-foreground">{deal.business}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{deal.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">{deal.salePrice}</span>
                      <span className="text-lg text-muted-foreground line-through">{deal.originalPrice}</span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">
                          {deal.claimed}/{deal.maxClaims} claimed
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Valid until {new Date(deal.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(deal.claimed / deal.maxClaims) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      <Gift className="h-4 w-4 mr-2" />
                      Claim Deal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center py-8">
              <Button variant="outline" className="w-full md:w-auto">
                View All Deals
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventsDealsPage;