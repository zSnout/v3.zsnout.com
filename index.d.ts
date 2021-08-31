/// <reference types="node" />

import { FastifyInstance, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    redirect(from: string, to?: string): void;
    static(path: string, to?: string): void;
    verifyEmail(email: string): boolean;
    verifyUsername(username: string): boolean;
    view(file: string, data?: object): Promise<string>;
    format(file: string, data?: object): Promise<string>;
  }

  interface FastifyReply {
    view(
      file: string,
      data?: object,
      options?: { frame: boolean }
    ): Promise<void>;
  }
}
