
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a pending URL from the homepage
    const storedUrl = localStorage.getItem('pendingUrl');
    if (storedUrl) {
      setPendingUrl(storedUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful!",
        description: "Welcome back to LinkSnap",
      });
      
      // Clear the pending URL from localStorage
      localStorage.removeItem('pendingUrl');
      
      // If there was a pending URL, redirect to dashboard with URL, otherwise just to dashboard
      if (pendingUrl) {
        // You can pass the URL as a query parameter or handle it in the dashboard
        window.location.href = `/dashboard?url=${encodeURIComponent(pendingUrl)}`;
      } else {
        window.location.href = '/dashboard';
      }
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <RouterLink to="/" className="inline-flex items-center space-x-2 text-white hover:text-purple-200 transition-colors">
            <Link className="h-8 w-8" />
            <span className="text-2xl font-bold">LinkSnap</span>
          </RouterLink>
        </div>

        {/* Login Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <p className="text-purple-100">
              {pendingUrl ? 'Sign in to shorten your URL' : 'Sign in to your account'}
            </p>
            {pendingUrl && (
              <div className="mt-2 p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-purple-200 mb-1">URL ready to shorten:</p>
                <p className="text-sm text-white truncate">{pendingUrl}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-white/80 border-white/30 focus:border-white"
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-white/80 border-white/30 focus:border-white pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <p className="text-purple-100">
                  Don't have an account?{' '}
                  <RouterLink to="/register" className="text-white font-semibold hover:underline">
                    Sign up here
                  </RouterLink>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
