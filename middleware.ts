// Middleware temporarily disabled for development
// Uncomment when OAuth providers are properly configured

// export { auth as middleware } from "./auth"

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
// };

// Temporary middleware for development
export function middleware() {
  // Allow all requests during development setup
  return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
