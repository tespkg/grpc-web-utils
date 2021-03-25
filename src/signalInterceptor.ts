import * as grpcWeb from "grpc-web";

export type MetadataWithSignal = {
  signal?: AbortSignal;
} & grpcWeb.Metadata;

export class SignalStreamInterceptor<
  REQ extends grpcWeb.Request<REQ, RESP>,
  RESP = any
> {
  intercept(
    request: REQ,
    invoker: (
      request: REQ,
      metadata?: grpcWeb.Metadata
    ) => grpcWeb.ClientReadableStream<RESP>
  ) {
    const md = request.getMetadata();
    const signal = md.signal as any;
    delete md.signal;
    const stream = invoker(request);
    if (signal && signal instanceof AbortSignal) {
      signal.addEventListener("abort", () => {
        stream.cancel();
      });
    }
    return stream;
  }
}

export function isMetadataWithSignal(m: any): m is MetadataWithSignal {
  return m.signal && m.signal instanceof AbortSignal;
}
