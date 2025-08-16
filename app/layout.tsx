import "../styles/globals.css";
import { FacebookSDK } from "../components/FacebookSDK";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Temporarily disable session loading to avoid auth errors during development
  // const session = await auth();
  const session = null;

  return (
    <html lang="vi">
      <body className="bg-bg text-base font-sans">
        <FacebookSDK />
        <a href="#main-content" className="sr-only focus:not-sr-only bg-accent text-white px-4 py-2 rounded">Bỏ qua đến nội dung chính</a>
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 py-3">
          <nav className="container flex items-center justify-between mx-auto max-w-6xl px-4">
            <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workflow Market
            </div>
            <ul className="flex gap-6 text-base font-medium items-center">
              <li><a href="/" className="hover:text-blue-600 transition-colors">Trang chủ</a></li>
              <li><a href="/workflows" className="hover:text-blue-600 transition-colors">Workflows</a></li>
              <li><a href="/pricing" className="hover:text-blue-600 transition-colors">Bảng giá</a></li>
              {session?.user ? (
                <>
                  <li><a href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a></li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {session.user.image && (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || "User"} 
                          className="w-8 h-8 rounded-full border-2 border-blue-200"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {session.user.name}
                      </span>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li><a href="/auth/signin" className="hover:text-blue-600 transition-colors">Đăng nhập</a></li>
                  <li>
                    <a 
                      href="/auth/signin" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Bắt đầu ngay
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <main id="main-content" className="min-h-[80vh]">
          {children}
        </main>
        <footer className="border-t border-gray-100 py-6 mt-12 bg-bg-alt">
          <div className="container mx-auto max-w-6xl px-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-2">
            <div>© {new Date().getFullYear()} Workflow Market. Professional workflow platform.</div>
            <div className="flex gap-4">
              <a href="/legal/terms" className="hover:underline">Điều khoản</a>
              <a href="/legal/privacy" className="hover:underline">Bảo mật</a>
              <a href="/support" className="hover:underline">Hỗ trợ</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
