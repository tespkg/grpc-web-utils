import * as grpcWeb from 'grpc-web';

import * as tests_pb_echo_pb from '../../tests/pb/echo_pb';


export class EchoServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  echo(
    request: tests_pb_echo_pb.EchoRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: tests_pb_echo_pb.EchoResponse) => void
  ): grpcWeb.ClientReadableStream<tests_pb_echo_pb.EchoResponse>;

  serverStreamingEcho(
    request: tests_pb_echo_pb.ServerStreamingEchoRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<tests_pb_echo_pb.ServerStreamingEchoResponse>;

  echoStatus(
    request: tests_pb_echo_pb.EchoStatusRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: tests_pb_echo_pb.EchoStatusResponse) => void
  ): grpcWeb.ClientReadableStream<tests_pb_echo_pb.EchoStatusResponse>;

}

export class EchoServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  echo(
    request: tests_pb_echo_pb.EchoRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tests_pb_echo_pb.EchoResponse>;

  serverStreamingEcho(
    request: tests_pb_echo_pb.ServerStreamingEchoRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<tests_pb_echo_pb.ServerStreamingEchoResponse>;

  echoStatus(
    request: tests_pb_echo_pb.EchoStatusRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<tests_pb_echo_pb.EchoStatusResponse>;

}

