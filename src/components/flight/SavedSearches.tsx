import { Plane, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SavedSearch } from '@/hooks/useSavedSearches';

interface SavedSearchesProps {
  searches: SavedSearch[];
  loading: boolean;
  onSelect: (originCode: string, destinationCode: string) => void;
  onDelete: (id: string) => void;
}

export function SavedSearches({ searches, loading, onSelect, onDelete }: SavedSearchesProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-32 flex-shrink-0" />
        ))}
      </div>
    );
  }

  if (searches.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Plane className="h-4 w-4" />
        Saved Routes
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {searches.map((search) => (
          <div
            key={search.id}
            className="flex items-center gap-1 bg-secondary/50 rounded-lg pl-3 pr-1 py-1 flex-shrink-0"
          >
            <button
              onClick={() => onSelect(search.origin_code, search.destination_code)}
              className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
            >
              <span className="font-medium">{search.origin_code}</span>
              <ArrowRight className="h-3 w-3" />
              <span className="font-medium">{search.destination_code}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(search.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
