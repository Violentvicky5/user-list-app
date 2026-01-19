import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        if (
          credentials.email ===   process.env.EMAIL_ADD &&
          credentials.password === process.env.PASSWORD
        ) {
          return { id: "1", email: `${credentials.email}`, name: "vicky" };
        }
        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token }) {
      if (!token.createdAt) {
        token.createdAt = Date.now();
      }

const fifteenMinutes = 15 * 60 * 1000; // 900000 ms

      if (Date.now() - token.createdAt > fifteenMinutes) {
        return null;
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
