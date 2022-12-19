import { NextServer, NextServerOptions } from "next/dist/server/next";
export declare class BootServer {
    protected isDev: boolean;
    private nextApp;
    private nextConfig;
    private httpServer;
    private readonly onCreateServerHook;
    constructor({ nextConfig, onCreateServer }: {
        nextConfig?: Partial<import("next/dist/server/dev/next-dev-server").Options> | undefined;
        onCreateServer?: Function | undefined;
    });
    createNextApp(): void;
    getNextConfig(): Partial<import("next/dist/server/dev/next-dev-server").Options>;
    getNextApp(): NextServer;
    setNextConfig(nextConfig: NextServerOptions): void;
    start(): Promise<void>;
}
