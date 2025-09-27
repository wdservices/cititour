import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Phone, Globe, MessageCircle, Heart, Share2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/MapView";

// Mock detailed data
const getDetailData = (category: string, id: string) => {
  const mockData = {
    events: {
      "1": {
        title: "Garden City Music Festival",
        description: "Annual music festival featuring local and international artists. Experience live performances, food trucks, and amazing atmosphere. This three-day event brings together music lovers from all over the region for an unforgettable celebration of sound and culture.",
        images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
        category: "Music",
        rating: 4.8,
        reviews: 127,
        price: "$25-50",
        location: "Central Park, Garden City",
        address: "123 Central Park Ave, Garden City",
        phone: "+1234567890",
        email: "info@gcmusicfest.com",
        website: "https://gcmusicfest.com",
        whatsapp: "+1234567890",
        latitude: 40.7829,
        longitude: -73.9654,
        features: ["Live Music", "Food Trucks", "Art Installations", "Family Friendly"],
        hours: "Fri-Sun, 2PM-11PM",
        hasTickets: true
      }
    },
    hotels: {
      "1": {
        title: "Garden City Grand Hotel", 
        description: "Luxury 5-star hotel in the heart of Garden City. Featuring world-class amenities, spa services, and fine dining restaurants. Our elegant rooms and suites offer stunning city views and premium comfort for both business and leisure travelers.",
        images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
        category: "5-Star",
        rating: 4.9,
        reviews: 89,
        price: "$200-400/night",
        location: "Downtown Garden City",
        address: "456 Main Street, Garden City", 
        phone: "+1234567890",
        email: "reservations@gcgrand.com",
        website: "https://gcgrand.com",
        whatsapp: "+1234567890",
        latitude: 40.7580,
        longitude: -73.9855,
        features: ["Spa", "Fitness Center", "Restaurant", "Business Center", "Pool"],
        hours: "24/7",
        hasTickets: false
      }
    }
  };
  
  return mockData[category as keyof typeof mockData]?.[id];
};

const DetailPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  
  if (!category || !id) {
    return <div>Invalid page</div>;
  }
  
  const data = getDetailData(category, id);
  
  if (!data) {
    return <div>Item not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2 h-64">
          <img 
            src={data.images[0]} 
            alt={data.title}
            className="col-span-2 w-full h-full object-cover rounded-l-lg"
          />
          <div className="grid grid-rows-2 gap-2">
            <img 
              src={data.images[1]} 
              alt={data.title}
              className="w-full h-full object-cover rounded-tr-lg"
            />
            <img 
              src={data.images[2]} 
              alt={data.title}
              className="w-full h-full object-cover rounded-br-lg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6">
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">{data.title}</h1>
            <Badge variant="secondary">{data.category}</Badge>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{data.rating}</span>
              <span className="text-muted-foreground">({data.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{data.location}</span>
            </div>
          </div>
          <div className="text-lg font-semibold text-primary">{data.price}</div>
        </div>

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{data.description}</p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature, index) => (
                <Badge key={index} variant="outline">{feature}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>{data.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-primary">{data.website}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span>WhatsApp: {data.whatsapp}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Location & Directions</h3>
            <MapView
              latitude={data.latitude}
              longitude={data.longitude}
              title={data.title}
              address={data.address}
            />
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">{data.address}</p>
              <Button className="w-full mt-2" variant="outline">
                Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="pb-6">
          <div className="flex gap-3">
            <Button className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            {data.hasTickets && (
              <Button className="flex-1" variant="outline">
                <Ticket className="h-4 w-4 mr-2" />
                Buy Tickets
              </Button>
            )}
            <Button className="flex-1" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;