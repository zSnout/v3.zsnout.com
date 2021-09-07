import { FastifyInstance, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyReply {
    /**
     * Renders an EJS file into a complete HTML file, then sends it as a response.
     * @param file A path to the file to be rendered, relative to the project root.
     * @param data An object containing data to be passed to the EJS file.
     * @returns A rendered version of the EJS file as a complete HTML file.
     */
    view(file: string, data?: object, frame?: boolean): Promise<void>;
  }

  interface FastifyInstance {
    /**
     * Redirects a URL to another URL.
     * @param route The original route that the request comes from.
     * @param newRoute The route to redirect requests to.
     */
    redirect(route: string, newRoute: string): void;

    /**
     * Exposes a file from the filesystem on the server.
     * @param route The route to expose the file on.
     * @param file The file that will be exposed, relative to `client`.
     */
    static(route: string, file: string): void;

    /**
     * Shorthand for sending an EJS template.
     * @param route The route to expose the template on.
     * @param file The EJS file that will be sent, relative to `client`.
     * @param data Data to pass along with the file.
     */
    template(route: string, file: string, data?: object): void;

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
     * @returns A rendered version of the EJS file as a complete HTML file.
     */
    format(file: string, data?: object): Promise<string>;
  }
}
