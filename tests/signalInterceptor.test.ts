import * as grpcWeb from "grpc-web";
import { MetadataWithSignal, SignalStreamInterceptor } from "../src";
import {
  EchoServiceClient,
  EchoServicePromiseClient,
} from "./pb/echo_grpc_web_pb";
import {
  EchoRequest,
  EchoResponse,
  ServerStreamingEchoRequest,
} from "./pb/echo_pb";
import xhrMock from "xhr-mock";
import { messageToGrpcWebText } from "./mock";

describe("signal interceptor", () => {
  beforeEach(() => xhrMock.setup());
  afterEach(() => xhrMock.teardown());

  test("should cancel streaming", () => {
    const options = {
      // unaryInterceptors: [new LoggingUnaryInterceptor()],
      streamInterceptors: [new SignalStreamInterceptor()],
    };

    const client = new EchoServiceClient("", null, options);
    const req = new ServerStreamingEchoRequest();
    req.setMessageCount(10);
    req.setMessageInterval(1);
    req.setMessage("foo");

    const handler = jest.fn();
    xhrMock.post(
      "/grpc.gateway.testing.EchoService/ServerStreamingEcho",
      handler
    );

    const controller = new AbortController();

    const stream = client.serverStreamingEcho(req, {
      signal: controller.signal,
    } as MetadataWithSignal);

    controller.abort();

    stream.on("error", () => {
      throw new Error("shouldn't error");
    });
    // stream.on("status", console.log);
    // stream.on("end", () => {});
    expect(handler.mock.calls.length).toBe(0);
  });

  test("doesn't cancel Promise client", async () => {
    const options = {
      unaryInterceptors: [new SignalStreamInterceptor()],
      streamInterceptors: [new SignalStreamInterceptor()],
    };

    const client = new EchoServicePromiseClient("", null, options);

    const req = new EchoRequest();
    req.setValue(1);
    req.setMessage("foo");

    xhrMock.post("/grpc.gateway.testing.EchoService/Echo", (_req, res) => {
      const resp = new EchoResponse();
      resp.setMessage("bar");
      resp.setValue("2");

      const body = messageToGrpcWebText(resp);
      return res
        .status(200)
        .header("content-type", "application/grpc-web-text")
        .body(body);
    });

    const controller = new AbortController();

    const p = client.echo(req, {
      signal: controller.signal,
    } as MetadataWithSignal);

    controller.abort();

    const resp = await p;

    expect(resp).toBeTruthy();
  });

  test("example set deadline", (done) => {
    const client = new EchoServiceClient("");
    const req = new EchoRequest();
    req.setValue(1);
    req.setMessage("foo");

    xhrMock.post("/grpc.gateway.testing.EchoService/Echo", (req, res) => {
      expect(req.header("grpc-timeout")).toBe("1000m");
      const resp = new EchoResponse();
      resp.setMessage("bar");
      resp.setValue("2");

      const body = messageToGrpcWebText(resp);
      return res
        .status(200)
        .header("content-type", "application/grpc-web-text")
        .body(body);
    });
    const md = {} as grpcWeb.Metadata;
    const deadline = new Date();

    deadline.setMilliseconds(deadline.getMilliseconds() + 1000); // timeout 1000 ms
    md["deadline"] = deadline.getTime().toString();

    client.echo(req, md, (err, _resp) => {
      expect(err).toBe(null);
      done();
    });
  });
});
