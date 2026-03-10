import serverless from 'serverless-http';
import { app, configureApp } from '../../server';

let serverlessHandler;

export const handler = async (event: any, context: any) => {
    if (!serverlessHandler) {
        await configureApp();
        serverlessHandler = serverless(app);
    }
    return serverlessHandler(event, context);
};
