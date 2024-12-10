// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/auth/login', 
    },
});

export const config = {
    matcher: ['/','/informes/:path*', '/user/:path*', '/proyectos/:path*'],
};
