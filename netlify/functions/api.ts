import serverless from 'serverless-http';
import { app, configureApp } from '../../server';
import prisma from '../../server/prisma';

let serverlessHandler;

export const handler = async (event: any, context: any) => {
    console.log(`[Netlify Function] Handling request for: ${event.path}`);
    try {
        if (!serverlessHandler) {
            console.log('[Netlify Function] Initializing Express app...');
            await configureApp();

            console.log('[Netlify Function] Verifying Database connection...');
            try {
                await prisma.$connect();
                console.log('[Netlify Function] Database connected successfully.');
            } catch (dbError: any) {
                console.error('[Netlify Function] Database CONNECTION FAILED:', dbError.message);
            }

            serverlessHandler = serverless(app);
            console.log('[Netlify Function] Express app initialized.');
        }
        return await serverlessHandler(event, context);
    } catch (error: any) {
        console.error('[Netlify Function] Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error (Netlify Function)',
                error: error.message,
                stack: error.stack
            })
        };
    }
};
