import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // A database is optional, but required to persist accounts in a database
  //   database: process.env.DATABASE_URL,

  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    }),
  ],
});
