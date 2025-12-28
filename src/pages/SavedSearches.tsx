import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, Search, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useSavedSearches } from '@/hooks/useSavedSearches';

export default function SavedSearches() {
  const { user, loading: authLoading } = useAuth();
  const { savedSearches, loading, deleteSearch } = useSavedSearches();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Saved Searches - AeroLens';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSearch = (originCode: string, destinationCode: string) => {
    // Navigate to home with search params
    navigate(`/?from=${originCode}&to=${destinationCode}`);
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Saved Searches</h1>
            <p className="text-muted-foreground">Your favorite flight routes</p>
          </div>
        </div>

        {savedSearches.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No saved searches</h2>
              <p className="text-muted-foreground mb-6">
                Save your favorite routes for quick access
              </p>
              <Button asChild>
                <Link to="/">Search Flights</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedSearches.map((search) => (
              <Card key={search.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xl font-bold">{search.origin_code}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                          {search.origin_name}
                        </p>
                      </div>
                      <Plane className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-xl font-bold">{search.destination_code}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[80px]">
                          {search.destination_name}
                        </p>
                      </div>
                    </div>
                    <Heart className="h-5 w-5 text-primary fill-primary" />
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Saved {format(new Date(search.created_at), 'MMM d, yyyy')}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleSearch(search.origin_code, search.destination_code)}
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Saved Search</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {search.origin_code} → {search.destination_code} from your saved searches?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSearch(search.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
