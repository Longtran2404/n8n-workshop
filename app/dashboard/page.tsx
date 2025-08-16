"use client";

import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

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

declare global {
  interface Window {
    FB: any;
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<FacebookUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (window.FB) {
        window.FB.getLoginStatus((response: any) => {
          if (response.status === 'connected') {
            // User is logged in, get user info
            window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo: FacebookUser) => {
              setUser(userInfo);
              setIsLoading(false);
            });
          } else {
            // User is not logged in, redirect to login
            window.location.href = '/auth/signin';
          }
        });
      } else {
        // Facebook SDK not loaded yet, try again
        setTimeout(checkLoginStatus, 100);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    if (window.FB) {
      window.FB.logout(() => {
        window.location.href = '/';
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* User Header */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user?.picture && (
                  <img 
                    src={user.picture.data.url} 
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-4 border-blue-200"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Chào mừng, {user?.name}!
                  </h1>
                  {user?.email && (
                    <p className="text-gray-600">{user.email}</p>
                  )}
                  <p className="text-sm text-green-600 font-medium">
                    ✅ Đăng nhập thành công qua Facebook
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </div>
          </Card>
        </div>

        {/* Dashboard Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-lg mb-2">Workflows</h3>
            <p className="text-gray-600 mb-4">Quản lý workflow của bạn</p>
            <Button variant="primary" size="sm" className="w-full">
              Xem workflows
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">�</div>
            <h3 className="font-semibold text-lg mb-2">Dự án</h3>
            <p className="text-gray-600 mb-4">Tạo và quản lý dự án</p>
            <Button variant="primary" size="sm" className="w-full">
              Tạo dự án mới
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="font-semibold text-lg mb-2">Cài đặt</h3>
            <p className="text-gray-600 mb-4">Cấu hình tài khoản</p>
            <Button variant="primary" size="sm" className="w-full">
              Cài đặt
            </Button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Đăng nhập thành công</p>
                <p className="text-sm text-gray-600">Đăng nhập qua Facebook</p>
              </div>
              <span className="text-sm text-gray-500">Vừa xong</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium">Chào mừng đến với Workflow Market</p>
                <p className="text-sm text-gray-600">Khám phá các workflow chuyên nghiệp</p>
              </div>
              <span className="text-sm text-gray-500">Vừa xong</span>
            </div>
          </div>
        </Card>

        {/* API Information */}
        <div className="mt-8">
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">🎉 Facebook API Integration Success!</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Facebook SDK v23.0 hoạt động bình thường</p>
              <p>• User ID: {user?.id}</p>
              <p>• Phạm vi quyền: public_profile, email</p>
              <p>• Trạng thái: Connected và verified</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
