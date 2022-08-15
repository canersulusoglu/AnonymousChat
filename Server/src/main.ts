import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { WebSocketServer  } from 'ws';
import { useServer } from "graphql-ws/lib/use/ws";

import { inMemoryDatabase } from './database';

let Database = inMemoryDatabase;

const main = async () => {
    const PORT = process.env.PORT || 4000;
    const REDIS_DOMAIN_NAME =process.env.REDIS_DOMAIN_NAME || "localhost";
    const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
    const REDIS_OPTIONS = {
        retryStrategy: (times : any) => Math.min(times * 50, 2000)
    };

    const app = express();
    app.use(cors());
    app.use(express.json());
    const httpServer = http.createServer(app);
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    });
    const graphqlSchema = makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers
    });
    
    const pubsub = new RedisPubSub({
        subscriber: new Redis(REDIS_PORT, REDIS_DOMAIN_NAME, REDIS_OPTIONS),
        publisher: new Redis(REDIS_PORT, REDIS_DOMAIN_NAME, REDIS_OPTIONS)
    });

    const serverCleanup = useServer(
        { 
            schema: graphqlSchema, 
            context: (_ctx, _msg, _args) => ({
                pubsub,
                db: Database
            })
        }, 
        wsServer
    );

    const apolloServer = new ApolloServer({
        schema: graphqlSchema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
            },
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
        context: ({ req, res }) => ({
            req, 
            res, 
            pubsub,
            db: Database
        })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        path: '/'
    });

    httpServer.listen(PORT, () => {
        console.log(
        `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
        );
    });
}

main();