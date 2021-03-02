import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

// @ts-ignore
export default NextAuth({
  // A database is optional, but required to persist accounts in a database
  //   database: process.env.NEXT_PUBLIC_API_URL,

  debug: true,
  providers: [
    Providers.Google({
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
      scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    }),
    Providers.GitHub({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!,
      scope: 'user',
    }),
  ],
});
