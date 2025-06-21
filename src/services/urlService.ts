
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export const urlService = {
  shortenUrl: async (originalUrl: string, token: string): Promise<ShortenedUrl | null> => {
    try {
      const response = await fetch('http://localhost:8080/api/urls/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          id: data.id || Date.now().toString(),
          originalUrl: data.originalUrl || originalUrl,
          shortUrl: data.shortUrl || data.shortenedUrl,
          clicks: data.clicks || 0,
          createdAt: data.createdAt || new Date().toISOString().split('T')[0]
        };
      }
      return null;
    } catch (error) {
      console.error('URL shortening error:', error);
      return null;
    }
  },

  getMyUrls: async (token: string): Promise<ShortenedUrl[]> => {
    try {
      const response = await fetch('http://localhost:8080/api/urls/myurls', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          id: item.id || item._id || Math.random().toString(),
          originalUrl: item.originalUrl,
          shortUrl: item.shortUrl || item.shortenedUrl,
          clicks: item.clicks || 0,
          createdAt: item.createdAt || new Date().toISOString().split('T')[0]
        }));
      }
      return [];
    } catch (error) {
      console.error('Fetch URLs error:', error);
      return [];
    }
  }
};
