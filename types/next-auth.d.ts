import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "customer" | "admin" | "stylist";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "customer" | "admin" | "stylist";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "customer" | "admin" | "stylist";
  }
}
