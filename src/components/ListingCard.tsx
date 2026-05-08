import { MapPin, Star, Phone, Globe, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating?: number;
  price?: string;
  location: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
  onClick: () => void;
}

const ListingCard = ({
  title,
  description,
  image,
  category,
  rating = 0,
  price,
  location,
  phone,
  website,
  isOpen = true,
  onClick
}: ListingCardProps) => {
  const renderValue = (val: any) => {
    if (val === null || val === undefined) return "";
    if (typeof val === 'object') {
      if (val._lat !== undefined && val._long !== undefined) {
        return `${val._lat.toFixed(4)}, ${val._long.toFixed(4)}`;
      }
      return JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <Card className="overflow-hidden cursor-pointer group hover:shadow-card transition-all duration-300 animate-fade-in">
      <div className="relative h-48 overflow-hidden" onClick={onClick}>
        <img 
          src={renderValue(image)} 
          alt={renderValue(title)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-primary">
            {renderValue(category)}
          </Badge>
        </div>
        {price && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white">
              {renderValue(price)}
            </Badge>
          </div>
        )}
        {isOpen !== undefined && (
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant={isOpen ? "default" : "destructive"}
              className={isOpen ? "bg-green-500" : ""}
            >
              {isOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {renderValue(title)}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{renderValue(rating)}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {renderValue(description)}
        </p>
        
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground line-clamp-1">{renderValue(location)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {phone && (
            <Button size="sm" variant="outline" className="flex-1">
              <Phone className="h-4 w-4" />
            </Button>
          )}
          {website && (
            <Button size="sm" variant="outline" className="flex-1">
              <Globe className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" className="flex-1">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;