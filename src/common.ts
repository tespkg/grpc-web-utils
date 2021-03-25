import * as grpcWeb from "grpc-web";

export type EventType = "data" | "error" | "status" | "end";

export function isGrpcWebError(e: any): e is grpcWeb.Error {
  return "message" in e && "code" in e;
}
