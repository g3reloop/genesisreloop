import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '../db/utils';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { createClient } from '../supabase/server';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Use Supabase Auth for authentication
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error('Invalid email or password');
        }

        // Get user from database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            supplier: true,
            processor: true,
            buyer: true,
            collector: true,
          },
        });

        if (!user) {
          // Create user if doesn't exist
          const newUser = await prisma.user.create({
            data: {
              id: data.user.id,
              email: credentials.email,
              name: data.user.email?.split('@')[0] || 'User',
              role: 'SUPPLIER', // Default role
            },
          });
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          };
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          supplierId: user.supplier?.id,
          processorId: user.processor?.id,
          buyerId: user.buyer?.id,
          collectorId: user.collector?.id,
        };
      }
    }),

    // Email Magic Link Provider
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@reloop.eco',
    }),

    // OAuth Providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/onboarding',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth sign in
      if (account?.provider !== 'credentials') {
        return true;
      }

      // For credentials, already handled in authorize
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.supplierId = user.supplierId;
        token.processorId = user.processorId;
        token.buyerId = user.buyerId;
        token.collectorId = user.collectorId;
      }

      // Update session
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as UserRole;
        session.user.supplierId = token.supplierId as string | undefined;
        session.user.processorId = token.processorId as string | undefined;
        session.user.buyerId = token.buyerId as string | undefined;
        session.user.collectorId = token.collectorId as string | undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      // Log successful sign in
      await prisma.agentActivity.create({
        data: {
          agentName: 'AuthSystem',
          action: 'user_signin',
          inputData: { 
            userId: user.id, 
            provider: account?.provider,
            isNewUser 
          },
          outputData: {},
          success: true,
          duration: 0,
        },
      });
    },

    async signOut({ session, token }) {
      // Log sign out
      if (token?.id) {
        await prisma.agentActivity.create({
          data: {
            agentName: 'AuthSystem',
            action: 'user_signout',
            inputData: { userId: token.id },
            outputData: {},
            success: true,
            duration: 0,
          },
        });
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
