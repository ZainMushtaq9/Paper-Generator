import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from './prisma';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { institution: true },
                });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isValid = await compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Invalid password');
                }

                // Check if institution admin's institution is approved
                if (user.role === 'INSTITUTION_ADMIN' && user.institution && !user.institution.approved) {
                    throw new Error('Your institution is pending approval');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    institutionId: user.institutionId,
                    institutionName: user.institution?.name || null,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.institutionId = user.institutionId;
                token.institutionName = user.institutionName;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.institutionId = token.institutionId;
            session.user.institutionName = token.institutionName;
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
};
