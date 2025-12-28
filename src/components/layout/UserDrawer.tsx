import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Moon, 
  Sun, 
  Bell, 
  Ticket, 
  Settings, 
  LogOut, 
  ChevronRight,
  Plane 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useBookings, Booking } from '@/hooks/useBookings';
import { usePriceAlerts, PriceAlert } from '@/hooks/usePriceAlerts';

export function UserDrawer() {
  const { user, signOut } = useAuth();
  const { bookings } = useBookings();
  const { alerts } = usePriceAlerts();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const getInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    return user.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const activeAlerts = alerts.filter(a => a.is_active);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="User menu">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {(activeAlerts.length > 0 || confirmedBookings.length > 0) && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              {activeAlerts.length + confirmedBookings.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base truncate">
                {user?.user_metadata?.full_name || 'Welcome'}
              </SheetTitle>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
              <span className="font-medium">Theme</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === 'light' ? 'Light' : 'Dark'}
            </Button>
          </div>

          <Separator />

          {/* Quick Access - My Bookings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                <span className="font-medium">My Bookings</span>
              </div>
              {confirmedBookings.length > 0 && (
                <Badge variant="secondary">{confirmedBookings.length}</Badge>
              )}
            </div>
            
            <ScrollArea className="max-h-[140px]">
              {confirmedBookings.length > 0 ? (
                <div className="space-y-2">
                  {confirmedBookings.slice(0, 3).map((booking) => (
                    <BookingPreviewCard key={booking.id} booking={booking} />
                  ))}
                  {confirmedBookings.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center py-1">
                      +{confirmedBookings.length - 3} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">No upcoming bookings</p>
              )}
            </ScrollArea>
          </div>

          <Separator />

          {/* Quick Access - Price Alerts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="font-medium">Price Alerts</span>
              </div>
              {activeAlerts.length > 0 && (
                <Badge variant="secondary">{activeAlerts.length}</Badge>
              )}
            </div>
            
            <ScrollArea className="max-h-[140px]">
              {activeAlerts.length > 0 ? (
                <div className="space-y-2">
                  {activeAlerts.slice(0, 3).map((alert) => (
                    <AlertPreviewCard key={alert.id} alert={alert} />
                  ))}
                  {activeAlerts.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center py-1">
                      +{activeAlerts.length - 3} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">No active alerts</p>
              )}
            </ScrollArea>
          </div>

          <Separator />

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link 
              to="/profile" 
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>Profile & Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BookingPreviewCard({ booking }: { booking: Booking }) {
  const flightData = booking.flight_data as Record<string, unknown>;
  const origin = (flightData?.origin as string) || 'N/A';
  const destination = (flightData?.destination as string) || 'N/A';

  return (
    <div className="p-2 rounded-md bg-muted/30 border">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{origin}</span>
        <Plane className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium">{destination}</span>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {booking.booking_reference}
        </span>
      </div>
    </div>
  );
}

function AlertPreviewCard({ alert }: { alert: PriceAlert }) {
  const priceDropped = alert.current_price && alert.current_price <= alert.target_price;

  return (
    <div className={`p-2 rounded-md border ${priceDropped ? 'bg-green-50 dark:bg-green-950/20 border-green-500' : 'bg-muted/30'}`}>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{alert.origin_code}</span>
        <Plane className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium">{alert.destination_code}</span>
        <span className={`ml-auto text-xs font-medium ${priceDropped ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
          ${alert.target_price}
        </span>
      </div>
    </div>
  );
}
