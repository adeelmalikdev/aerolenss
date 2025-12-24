import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOption } from '@/types/flight';

interface FlightSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function FlightSort({ value, onChange }: FlightSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="best">Best</SelectItem>
          <SelectItem value="price">Cheapest</SelectItem>
          <SelectItem value="duration">Fastest</SelectItem>
          <SelectItem value="departure">Departure time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
