import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

// Only include Supabase adapter if environment variables are properly configured
// Temporarily disabled to fix module resolution issues
const useSupabaseAdapter = false; // process.env.NEXT_PUBLIC_SUPABASE_URL && 
                          // process.env.SUPABASE_ANON_KEY &&
                          // process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
                          // process.env.SUPABASE_ANON_KEY !== "your_supabase_anon_key";

const config: any = {
  providers: [],
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ token, session }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ user, token }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

// Add Google provider if configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET &&
    process.env.AUTH_GOOGLE_ID !== "your_google_client_id") {
  config.providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

// Add Facebook provider if configured
if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET &&
    process.env.AUTH_FACEBOOK_ID !== "your_facebook_app_id") {
  config.providers.push(
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    })
  );
}

// Add Supabase adapter if properly configured
// Temporarily disabled - Supabase adapter removed to fix compilation issues
// if (useSupabaseAdapter) {
//   const { SupabaseAdapter } = require("@auth/supabase-adapter");
//   config.adapter = SupabaseAdapter({
//     url: process.env.NEXT_PUBLIC_SUPABASE_URL,
//     secret: process.env.SUPABASE_ANON_KEY,
//   });
// }

export const { handlers, signIn, signOut, auth } = NextAuth(config);
