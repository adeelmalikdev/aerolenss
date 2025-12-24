import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecentSearch } from '@/hooks/useRecentSearches';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (originCode: string, destinationCode: string) => void;
  onClear: () => void;
}

export function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Searches
        </p>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-6">
          Clear
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {searches.map((search, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(search.originCode, search.destinationCode)}
            className="flex items-center gap-1 bg-muted/50 hover:bg-muted rounded-lg px-3 py-1.5 flex-shrink-0 text-sm transition-colors"
          >
            <span className="font-medium">{search.originCode}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{search.destinationCode}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
