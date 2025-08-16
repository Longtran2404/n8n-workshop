"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md p-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Đăng nhập</h1>
        <p className="text-base text-neutral-600">Chọn phương thức đăng nhập để tiếp tục. Giao diện chỉ văn bản, không dùng icon.</p>
      </header>
      <form className="space-y-4" onSubmit={e => e.preventDefault()}>
        <button
          type="button"
          className="w-full border border-neutral-300 rounded-lg py-3 px-4 text-base font-medium hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onClick={() => signIn("google")}
        >
          Đăng nhập bằng Google
        </button>
        <button
          type="button"
          className="w-full border border-neutral-300 rounded-lg py-3 px-4 text-base font-medium hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onClick={() => signIn("facebook")}
        >
          Đăng nhập bằng Facebook
        </button>
      </form>
      <div className="text-xs text-neutral-400 pt-4 border-t mt-6">Chúng tôi không lưu thông tin cá nhân ngoài mục đích xác thực tài khoản.</div>
    </main>
  );
}
