"use client";

import { useEffect, useState } from 'react';
import { Button } from "./ui/Button";

interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    }
  }
}

interface FacebookLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  }
}

export function FacebookLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FacebookUser | null>(null);
  const [isSDKReady, setIsSDKReady] = useState(false);

  useEffect(() => {
    // Check if Facebook SDK is ready
    const checkSDK = () => {
      if (window.FB) {
        setIsSDKReady(true);
        // Check current login status
        window.FB.getLoginStatus((response: FacebookLoginResponse) => {
          statusChangeCallback(response);
        });
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    checkSDK();
  }, []);

  const statusChangeCallback = (response: FacebookLoginResponse) => {
    console.log('Facebook login status:', response);
    
    if (response.status === 'connected') {
      // User is logged in and authenticated
      testAPI();
    } else {
      // User is not logged in or not authorized
      setUser(null);
    }
  };

  const testAPI = () => {
    console.log('Welcome! Fetching your information...');
    window.FB.api('/me', { fields: 'name,email,picture' }, (response: FacebookUser) => {
      console.log('Facebook API response:', response);
      setUser(response);
    });
  };

  const handleFacebookLogin = () => {
    if (!isSDKReady) return;
    
    setIsLoading(true);
    window.FB.login((response: FacebookLoginResponse) => {
      setIsLoading(false);
      statusChangeCallback(response);
    }, { scope: 'public_profile,email' });
  };

  const handleFacebookLogout = () => {
    window.FB.logout((response: any) => {
      setUser(null);
      console.log('Logged out:', response);
    });
  };

  if (user) {
    return (
      <div className="w-full p-4 border border-green-200 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          {user.picture && (
            <img 
              src={user.picture.data.url} 
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-green-800">Đăng nhập thành công!</p>
            <p className="text-sm text-green-600">Xin chào, {user.name}</p>
            {user.email && (
              <p className="text-xs text-green-500">{user.email}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1"
          >
            Vào Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleFacebookLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      type="button" 
      variant="primary" 
      size="lg" 
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50" 
      onClick={handleFacebookLogin}
      disabled={!isSDKReady || isLoading}
    >
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      {isLoading ? 'Đang đăng nhập...' : isSDKReady ? 'Đăng nhập Facebook' : 'Đang tải...'}
    </Button>
  );
}
