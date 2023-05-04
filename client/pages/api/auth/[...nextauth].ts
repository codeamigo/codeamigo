import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

let redirection = '';

const options: NextAuthOptions = {
  // A database is optional, but required to persist accounts in a database
  //   database: process.env.NEXT_PUBLIC_API_URL,
  callbacks: {
    async redirect({ url }) {
      redirection = url;
      return Promise.resolve(url);
    },
    async signIn({ account, credentials, email, profile }) {
      if (!account) {
        return false;
      }
      if (!profile) {
        return false;
      }

      if (account.provider === 'github') {
        return `/auth/github/${
          'login' in profile ? profile.login : profile.name
        }/${profile.email}/${account.providerAccountId}/${encodeURIComponent(
          redirection
        )}`;
      }

      if (account.provider === 'google') {
        console.log(account);
        return `/auth/google/${profile.name}/${profile.email}/${
          account.providerAccountId
        }/${encodeURIComponent(redirection)}`;
      }

      return true;
    },
  },
  debug: false,
  pages: {
    error: '/auth/error',
    signIn: '/auth/signin',
  },
  providers: [
    GoogleProvider({
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      },
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET!,
};

// @ts-ignore
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
