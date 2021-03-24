import * as grpcWeb from "grpc-web";
import { EventType } from "./common";

export type MetadataWithSignal = {
  signal?: AbortSignal;
} & grpcWeb.Metadata;

// const getAuthToken = () => "";

export class AuthStreamInterceptor<
  REQ extends grpcWeb.Request<REQ, RESP>,
  RESP = any
> {
  Intercept = class {
    stream: grpcWeb.ClientReadableStream<RESP>;

    constructor(stream: grpcWeb.ClientReadableStream<RESP>) {
      this.stream = stream;
    }

    on<F extends Function>(eventType: EventType, callback: F) {
      if (eventType === "error") {
        this.stream.on("error", (err: grpcWeb.Error) => {
          if (err.code === grpcWeb.StatusCode.UNAUTHENTICATED) {
            this.onUnauthenticated();
          }
          callback(err);
        });
      } else if (eventType === "data") {
        this.stream.on("data", (resp) => {
          callback(resp);
        });
      } else if (eventType === "status") {
        this.stream.on("status", (status) => {
          callback(status);
        });
      } else if (eventType === "end") {
        this.stream.on("end", callback as any);
      }
      return this;
    }

    cancel() {
      this.stream.cancel();
      return this;
    }
  };

  intercept(
    request: REQ,
    invoker: (
      request: REQ,
      metadata?: grpcWeb.Metadata
    ) => grpcWeb.ClientReadableStream<RESP>
  ) {
    const stream = invoker(request);
    const newStream = new this.Intercept(stream);
    return newStream;
  }
}

// class UnaryAuthInterceptor<
//   REQ extends grpcWeb.Request,
//   RESP extends grpcWeb.UnaryResponse<REQ>
// > {
//   async intercept(request: REQ, invoker: (request: REQ) => Promise<RESP>) {
//     const md = request.getMetadata();
//     md["Authorization"] = `Bearer ${getAuthToken()}`;
//     if (process.env.NODE_ENV === "development") {
//       if (!disable)
//         console.log(
//           "grpc-web request:",
//           request.getRequestMessage()?.toObject(),
//           "metadata:",
//           md
//         );
//     }
//     // cancellation
//     // const signal = md.signal // UnaryCall doesn't allow cancellation
//     delete md.signal;
//     try {
//       const resp = await invoker(request);
//       if (process.env.NODE_ENV === "development") {
//         if (!disable)
//           console.log("grpc-web unary response:", resp.getResponseMessage());
//       }
//       return resp;
//     } catch (e) {
//       if (process.env.NODE_ENV === "development") {
//         if (!disable) console.log("grpc-web unary error", e);
//       }
//       throw e;
//     }
//   }
// }

// const options = {
//   streamInterceptors: [new AuthInterceptor()],
//   unaryInterceptors: [new UnaryAuthInterceptor()],
// };

// const statusCodeNames = Object.entries(grpcWeb.StatusCode).reduce(
//   (acc, [k, v]) => {
//     acc[v] = k;
//     return acc;
//   },
//   {} as { [code: number]: string }
// );

// // see https://jackieli.dev/posts/grpc-web-interceptor/ for the journey on why
// export const createPromiseClient = <PromiseClient, RpcClient = unknown>(
//   client: RpcClient
// ): PromiseClient => {
//   const methods = Object.getPrototypeOf(client);
//   return Object.keys(methods).reduce((acc, method) => {
//     const rpc = methods[method].bind(client);
//     if (rpc.length < 3) {
//       // streaming method only has 2 arguments
//       acc[method] = rpc;
//     } else {
//       acc[method] = (request: any, metadata?: grpcWeb.Metadata) =>
//         new Promise((resolve, reject) => {
//           rpc(request, metadata, (err: grpcWeb.Error, resp: any) => {
//             if (err) {
//               // TODO: somehow other properties of the error are overwritten down the chain, we need to find where
//               // here we manually set the message if it's empty
//               if (!err.message) {
//                 err.message = `server returned status ${
//                   statusCodeNames[err.code]
//                 } with empty message`;
//               }
//               reject(err);
//               return;
//             }
//             resolve(resp);
//           });
//         });
//     }
//     return acc;
//   }, {} as any);
// };
