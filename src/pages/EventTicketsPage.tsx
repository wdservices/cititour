import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Plus, Calendar, DollarSign } from "lucide-react";
import SearchHeader from "@/components/SearchHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ticketListings = [
  {
    id: "1",
    eventTitle: "Garden City Music Festival",
    ticketType: "General Admission",
    price: "$35",
    quantity: 50,
    sold: 23,
    commission: "$2.50",
    status: "active",
    date: "2024-03-15"
  },
  {
    id: "2",
    eventTitle: "Art Gallery Exhibition",
    ticketType: "VIP Access",
    price: "$25",
    quantity: 20,
    sold: 15,
    commission: "$1.75",
    status: "active",
    date: "2024-03-20"
  }
];

const EventTicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredTickets = ticketListings.filter(ticket =>
    ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Event Tickets"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search your tickets..."
      />
      
      <div className="px-4 py-6">
        {/* Create Ticket Button */}
        <Card className="mb-6 border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Create New Event Ticket</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start selling tickets for your upcoming event
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {ticket.eventTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {ticket.ticketType}
                    </p>
                  </div>
                  <Badge 
                    variant={ticket.status === 'active' ? 'default' : 'secondary'}
                    className={ticket.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {ticket.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{ticket.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sold</p>
                      <p className="font-medium">{ticket.sold}/{ticket.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Commission</p>
                      <p className="font-medium text-green-600">{ticket.commission}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-medium">{ticket.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Ticket
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Sales
                  </Button>
                  <Button size="sm" className="flex-1">
                    Promote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tickets found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTicketsPage;