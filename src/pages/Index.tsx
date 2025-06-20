
import { useState } from 'react';
import { Link, Copy, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock authentication state - replace with actual auth logic
  const isAuthenticated = false; // This should come from your auth context/state

  const handleShorten = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "Enter a valid URL to shorten",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the URL in localStorage so we can use it after login
      localStorage.setItem('pendingUrl', url);
      toast({
        title: "Join LinkSnap to Continue",
        description: "Create your free account to shorten URLs and track analytics",
      });
      // Redirect to login page
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    // Simulate API call for authenticated users
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "URL Shortened!",
        description: "Your link has been shortened successfully",
      });
      setUrl('');
    }, 1000);
  };

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Shorten URLs in milliseconds with our optimized system"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "All links are scanned for malware and phishing attempts"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track clicks, locations, and referrers for your links"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">LinkSnap</span>
          </div>
          <div className="space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/register'}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
          Shorten Your Links
          <span className="block text-4xl mt-2 text-purple-200">Share with Style</span>
        </h1>
        <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
          Transform long, messy URLs into clean, shareable links. Track performance, 
          customize your links, and boost your brand.
        </p>

        {/* URL Shortener Card */}
        <Card className="p-8 mb-16 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="url"
              placeholder="Enter your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 h-14 text-lg bg-white/80 border-white/30 focus:border-white"
              onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
            />
            <Button
              onClick={handleShorten}
              disabled={isLoading}
              className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
            >
              {isLoading ? 'Shortening...' : 'Shorten Now'}
            </Button>
          </div>
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white font-medium mb-2">🎉 Join LinkSnap to unlock amazing features:</p>
            <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-100">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-purple-300" />
                Track clicks & analytics
              </div>
              <div className="flex items-center">
                <Copy className="h-4 w-4 mr-2 text-purple-300" />
                View all your shortened links
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-purple-300" />
                Secure link management
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-300" />
                Lightning fast shortening
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <feature.icon className="h-12 w-12 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-100">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-purple-100 mb-8">
            Join thousands of users who trust LinkSnap for their URL shortening needs.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
            onClick={() => window.location.href = '/register'}
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
