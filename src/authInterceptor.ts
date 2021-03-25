import * as grpcWeb from "grpc-web";
import { EventType, isGrpcWebError } from "./common";

export class AuthStreamInterceptor<
  REQ extends grpcWeb.Request<REQ, RESP>,
  RESP = any
> {
  private onUnauthenticated: () => void;
  private getToken: () => string;

  constructor(onUnauthenticated: () => void, getToken: () => string) {
    this.onUnauthenticated = onUnauthenticated;
    this.getToken = getToken;
  }

  Intercept = class {
    stream: grpcWeb.ClientReadableStream<RESP>;
    onUnauthenticated: () => void;

    constructor(
      stream: grpcWeb.ClientReadableStream<RESP>,
      onUnauthenticated: () => void
    ) {
      this.stream = stream;
      this.onUnauthenticated = onUnauthenticated;
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
    const md = request.getMetadata();
    md["Authorization"] = `Bearer ${this.getToken()}`;
    const stream = invoker(request);
    const newStream = new this.Intercept(stream, this.onUnauthenticated);
    return newStream;
  }
}

export class AuthUnaryInterceptor<
  REQ extends grpcWeb.Request<REQ, RESP>,
  RESP extends grpcWeb.UnaryResponse<REQ, RESP>
> {
  private onUnauthenticated: () => void;
  private getToken: () => string;

  constructor(onUnauthenticated: () => void, getToken: () => string) {
    this.onUnauthenticated = onUnauthenticated;
    this.getToken = getToken;
  }

  async intercept(request: REQ, invoker: (request: REQ) => Promise<RESP>) {
    const md = request.getMetadata();
    md["Authorization"] = `Bearer ${this.getToken()}`;
    try {
      const resp = await invoker(request);
      return resp;
    } catch (e) {
      if (isGrpcWebError(e) && e.code === grpcWeb.StatusCode.UNAUTHENTICATED) {
        this.onUnauthenticated();
      }
      throw e;
    }
  }
}
