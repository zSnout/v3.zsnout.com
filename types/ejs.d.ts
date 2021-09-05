import { FastifyInstance, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyReply {
    /**
     * Renders an EJS file into a complete HTML file, then sends it as a response.
     * @param file A path to the file to be rendered, relative to the project root.
     * @param data An object containing data to be passed to the EJS file.
     * @param frame Whether the HTML should include a navicon & navbar.
     * @returns A rendered version of the EJS file as a complete HTML file.
     */
    view(file: string, data?: object, frame?: boolean): Promise<void>;
  }

  interface FastifyInstance {
    /**
     * Renders an EJS file.
     * @param file A path to the file to be rendered, relative to the root.
     * @param data The data to be passed to the file.
     * @returns A rendered version of the EJS file.
     */
    view(file: string, data?: object): Promise<string>;

    /**
     * Renders an EJS file into a complete HTML file.
     * @param file A path to the file to be rendered, relative to the project root.
     * @param data An object containing data to be passed to the EJS file.
     * @param frame Whether the HTML should include a navicon & navbar.
     * @returns A rendered version of the EJS file as a complete HTML file.
     */
    format(file: string, data?: object, frame?: boolean): Promise<string>;
  }
}
