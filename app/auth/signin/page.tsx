import { SignIn } from "../../../components/SignIn";
import { Card } from "../../../components/ui/Card";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-gray-600">
            Đăng nhập để tiếp tục với platform workflow chuyên nghiệp
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đăng nhập nhanh chóng
            </h2>
            <p className="text-sm text-gray-600">
              Chọn phương thức đăng nhập yêu thích của bạn
            </p>
          </div>

          <SignIn />

          <div className="mt-6 text-center text-sm text-gray-500">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản sử dụng
            </a>{" "}
            và{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Chính sách bảo mật
            </a>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <a href="/" className="text-blue-600 hover:underline font-medium">
              Khám phá platform →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
