import { gql } from '@apollo/client';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { client } from '👨‍💻utils/withApollo';

// @ts-ignore
export default NextAuth({
  // A database is optional, but required to persist accounts in a database
  //   database: process.env.NEXT_PUBLIC_API_URL,
  callbacks: {
    async signIn(_: any, account: any, profile: any) {
      if (account.provider === 'github') {
        // const mutation = gql`
        //   mutation GitHubLogin(
        //     $id: Float!
        //     $accessToken: String!
        //     $username: String!
        //   ) {
        //     githubLogin(
        //       options: {
        //         id: $id
        //         accessToken: $accessToken
        //         username: $username
        //       }
        //     ) {
        //       user {
        //         id
        //         username
        //         createdAt
        //       }
        //     }
        //   }
        // `;

        // const user = await client.mutate({
        //   mutation,
        //   variables: {
        //     accessToken: account.accessToken,
        //     id: account.id,
        //     username: profile.login,
        //   },
        // });

        // return true;
        return `/auth/github/${account.accessToken}/${account.id}/${profile.login}`;
      }

      if (account.provider === 'google') {
        return `/auth/google/${profile.name}/${profile.email}/${profile.id}`;
      }
    },
  },
  debug: false,
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
      scope: 'user:email',
    }),
  ],
});
