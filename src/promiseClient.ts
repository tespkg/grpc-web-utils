import * as grpcWeb from "grpc-web";

// see https://jackieli.dev/posts/grpc-web-interceptor/ for the journey on why.
// TL;DR: grpc-web built-in PromiseClient doesn't support cancelling the call.
//
// Under the hood it just cancels the XMLHttpRequest: if browser closes
// request, the server would also receive and cancellation signal.
//
// But to do it progmatically: RPC client exposes using stream.abort, while
// Promise client doesn't
//
// Also see tests/signalInterceptor.test.ts
export const createPromiseClient = <PromiseClient, RpcClient = unknown>(
  client: RpcClient
): PromiseClient => {
  const methods = Object.getPrototypeOf(client);
  return Object.keys(methods).reduce((acc, method) => {
    const rpc = methods[method].bind(client);
    if (rpc.length < 3) {
      // streaming method only has 2 arguments
      acc[method] = rpc;
    } else {
      acc[method] = (request: any, metadata?: grpcWeb.Metadata) =>
        new Promise((resolve, reject) => {
          let completed = false; // fulfilled or rejected
          const stream: grpcWeb.ClientReadableStream<any> = rpc(
            request,
            metadata,
            (err: grpcWeb.Error, resp: any) => {
              if (err) {
                completed = true;
                reject(err);
                return;
              }
              completed = true;
              resolve(resp);
            }
          );
          stream.on("end", () => {
            if (!completed) {
              reject(new Error("aborted?"));
            }
          });
        });
    }
    return acc;
  }, {} as any);
};
