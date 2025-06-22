import { useState, useEffect } from 'react';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
import { Link, Copy, ExternalLink, BarChart3, Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { urlService, ShortenedUrl } from '@/services/urlService';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<ShortenedUrl[]>([]);
  const [fetchingLinks, setFetchingLinks] = useState(true);
  const { toast } = useToast();
  const { user, token, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const urlParam = searchParams.get('url');
    if (urlParam) {
      setUrl(decodeURIComponent(urlParam));
    }

    fetchUserLinks();
  }, [searchParams, isAuthenticated, token, navigate, authLoading]);

  const fetchUserLinks = async () => {
    if (!token) return;
    
    setFetchingLinks(true);
    const userLinks = await urlService.getMyUrls(token);
    setLinks(userLinks);
    setFetchingLinks(false);
  };

  const handleShorten = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "Enter a valid URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please login again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await urlService.shortenUrl(url, token);
    setIsLoading(false);
    
    if (result) {
      setLinks([result, ...links]);
      setUrl('');
      toast({
        title: "URL Shortened!",
        description: "Your link has been shortened successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
      {/* Navigation */}
      <nav className="p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <RouterLink to="/" className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors">
            <Link className="h-8 w-8" />
            <span className="text-2xl font-bold">LinkSnap</span>
          </RouterLink>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5" />
              <span>Welcome, {user?.username || 'User'}!</span>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Create New Link Section */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <Plus className="h-6 w-6 mr-2" />
              Create New Short Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="url"
                placeholder="Enter your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-12 bg-white/80 border-white/30 focus:border-white"
                onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
              />
              <Button
                onClick={handleShorten}
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                {isLoading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{links.length}</div>
              <div className="text-purple-100">Total Links</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {links.reduce((sum, link) => sum + link.clicks, 0)}
              </div>
              <div className="text-purple-100">Total Clicks</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {links.length > 0 ? Math.round(links.reduce((sum, link) => sum + link.clicks, 0) / links.length) : 0}
              </div>
              <div className="text-purple-100">Avg. Clicks</div>
            </CardContent>
          </Card>
        </div>

        {/* Links List */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <BarChart3 className="h-6 w-6 mr-2" />
              Your Shortened Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fetchingLinks ? (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg">Loading your links...</p>
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-12">
                <Link className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 text-lg">No links yet</p>
                <p className="text-purple-100">Create your first shortened link above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link) => (
                  <Card key={link.id} className="bg-white/10 border-white/10 hover:bg-white/20 transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white truncate">
                              {link.shortUrl}
                            </h3>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {link.clicks} clicks
                            </Badge>
                          </div>
                          <p className="text-purple-100 text-sm truncate">
                            {link.originalUrl}
                          </p>
                          <p className="text-purple-200 text-xs mt-1">
                            Created: {new Date(link.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => copyToClipboard(link.shortUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => window.open(link.shortUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
