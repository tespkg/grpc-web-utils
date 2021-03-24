import * as grpcWeb from "grpc-web";
import { EventType } from "./common";

export class LogStreamInterceptor<
  REQ extends grpcWeb.Request<REQ, RESP>,
  RESP
> {
  private log: (...data: any[]) => void;

  constructor(log = console.log) {
    this.log = log;
  }

  Intercept = class {
    stream: grpcWeb.ClientReadableStream<RESP>;
    log: (...data: any[]) => void;

    constructor(stream: grpcWeb.ClientReadableStream<RESP>, log = console.log) {
      this.stream = stream;
      this.log = log;
    }

    on<F extends Function>(eventType: EventType, callback: F) {
      if (eventType === "error") {
        this.stream.on("error", (err: grpcWeb.Error) => {
          this.log("[gRPC-Web] on error", err);
          callback(err);
        });
      } else if (eventType === "data") {
        this.stream.on("data", (resp) => {
          this.log("[gRPC-Web] response", (resp as any)?.toObject());
          callback(resp);
        });
      } else if (eventType === "status") {
        this.stream.on("status", (status) => {
          this.log("[gRPC-Web] status", status);
          callback(status);
        });
      } else if (eventType === "end") {
        this.stream.on("end", callback as any);
      }
      return this;
    }

    cancel() {
      this.log("[gRPC-Web] cancelled");
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
    // request logging
    // here the request should be a protobuf message, but we don't want to depend on protobuf, hence the cast
    const message = (request.getRequestMessage() as any)?.toObject();
    const method = (request.getMethodDescriptor() as any).name;
    const md = request.getMetadata();
    this.log(
      "[gRPC-Web] calling",
      method,
      " request:",
      message,
      "metadata:",
      md
    );

    const stream = invoker(request);
    const newStream = new this.Intercept(stream, this.log);
    return newStream;
  }
}

export class LogUnaryInterceptor<
  REQ extends grpcWeb.Request<REQ, RESP>,
  RESP extends grpcWeb.UnaryResponse<REQ, RESP>
> {
  private log: (...data: any[]) => void;

  constructor(log = console.log) {
    this.log = log;
  }

  async intercept(request: REQ, invoker: (request: REQ) => Promise<RESP>) {
    const md = request.getMetadata();
    this.log(
      "[gRPC-Web] request:",
      (request.getRequestMessage() as any)?.toObject(),
      "metadata:",
      md
    );
    try {
      const resp = await invoker(request);
      this.log("[gRPC-Web] unary response:", resp.getResponseMessage());
      return resp;
    } catch (e) {
      this.log("[gRPC-Web] unary error", e);
      throw e;
    }
  }
}
