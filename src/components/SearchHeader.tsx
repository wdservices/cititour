import { Search, Filter, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SearchHeaderProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const SearchHeader = ({ 
  title, 
  searchValue, 
  onSearchChange,
  placeholder = "Search..."
}: SearchHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/explore')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-primary transition-colors rounded-full"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;