import { FastifyInstance, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyReply {
    /**
     * Renders an EJS file into a complete HTML file, then sends it as a response.
     * @param file A path to the file to be rendered, relative to the project root.
     * @param data An object containing data to be passed to the EJS file.
     * @returns A rendered version of the EJS file as a complete HTML file.
     */
    view: (
      this: FastifyReply,
      file: string,
      { frame, ...data }: { frame: boolean; [x: string]: any }
    ) => Promise<void>;
  }

  interface FastifyInstance {
    /**
     * Renders an EJS file.
     * @param file A path to the file to be rendered, relative to the root.
     * @param data The data to be passed to the file.
     * @returns A rendered version of the EJS file.
     */
    view: (file: string, data: object) => Promise<string>;

    /**
     * Renders an EJS file into a complete HTML file.
     * @param file A path to the file to be rendered, relative to the project root.
     * @param data An object containing data to be passed to the EJS file.
     * @returns A rendered version of the EJS file as a complete HTML file.
     */
    format: (
      file: string,
      { frame, ...data }: { frame: boolean; [x: string]: any }
    ) => Promise<string>;
  }
}
