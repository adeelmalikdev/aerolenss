import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellOff, Trash2, Plane, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { usePriceAlerts, PriceAlert } from '@/hooks/usePriceAlerts';
import { format } from 'date-fns';

export default function Alerts() {
  const { user, loading: authLoading } = useAuth();
  const { alerts, loading, updateAlert, deleteAlert } = usePriceAlerts();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Price Alerts - AeroLens';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const activeAlerts = alerts.filter(a => a.is_active);
  const pausedAlerts = alerts.filter(a => !a.is_active);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Price Alerts</h1>
              <p className="text-muted-foreground">Get notified when prices drop</p>
            </div>
          </div>
        </div>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No price alerts</h2>
              <p className="text-muted-foreground mb-6">
                Search for flights and set alerts to track price drops
              </p>
              <Button asChild>
                <Link to="/">Search Flights</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {activeAlerts.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Active Alerts ({activeAlerts.length})
                </h2>
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onToggle={() => updateAlert(alert.id, { is_active: false })}
                      onDelete={() => deleteAlert(alert.id)}
                      onUpdatePrice={(price) => updateAlert(alert.id, { target_price: price })}
                    />
                  ))}
                </div>
              </section>
            )}

            {pausedAlerts.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                  <BellOff className="h-5 w-5" />
                  Paused Alerts ({pausedAlerts.length})
                </h2>
                <div className="space-y-4">
                  {pausedAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onToggle={() => updateAlert(alert.id, { is_active: true })}
                      onDelete={() => deleteAlert(alert.id)}
                      onUpdatePrice={(price) => updateAlert(alert.id, { target_price: price })}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

interface AlertCardProps {
  alert: PriceAlert;
  onToggle: () => void;
  onDelete: () => void;
  onUpdatePrice: (price: number) => void;
}

function AlertCard({ alert, onToggle, onDelete, onUpdatePrice }: AlertCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [newPrice, setNewPrice] = useState(alert.target_price.toString());
  const priceDropped = alert.current_price && alert.current_price <= alert.target_price;

  const handleSavePrice = () => {
    const price = parseFloat(newPrice);
    if (!isNaN(price) && price > 0) {
      onUpdatePrice(price);
      setEditOpen(false);
    }
  };

  return (
    <Card className={`${!alert.is_active ? 'opacity-60' : ''} ${priceDropped ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Route */}
            <div className="flex items-center gap-3 mb-3">
              <div className="text-center">
                <p className="text-xl font-bold">{alert.origin_code}</p>
                <p className="text-xs text-muted-foreground">{alert.origin_name}</p>
              </div>
              <Plane className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xl font-bold">{alert.destination_code}</p>
                <p className="text-xs text-muted-foreground">{alert.destination_name}</p>
              </div>
              {priceDropped && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ml-2">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Price dropped!
                </Badge>
              )}
            </div>

            {/* Prices */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Target: </span>
                <span className="font-semibold text-lg">${alert.target_price}</span>
              </div>
              {alert.current_price && (
                <div>
                  <span className="text-muted-foreground">Current: </span>
                  <span className={`font-semibold text-lg ${priceDropped ? 'text-green-600 dark:text-green-400' : ''}`}>
                    ${alert.current_price}
                  </span>
                </div>
              )}
            </div>

            {/* Meta */}
            <p className="text-xs text-muted-foreground mt-2">
              Created {format(new Date(alert.created_at), 'MMM d, yyyy')}
              {alert.last_checked_at && ` • Last checked ${format(new Date(alert.last_checked_at), 'MMM d, HH:mm')}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Price Alert</DialogTitle>
                  <DialogDescription>
                    Update your target price for {alert.origin_code} → {alert.destination_code}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Target Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="new-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="pl-8"
                        min="1"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSavePrice} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              title={alert.is_active ? 'Pause alert' : 'Resume alert'}
            >
              {alert.is_active ? (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bell className="h-4 w-4 text-primary" />
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Price Alert</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this price alert for {alert.origin_code} → {alert.destination_code}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
