import xhrMock from "xhr-mock";
import { LogStreamInterceptor } from "../src";
import { LogUnaryInterceptor } from "../src/logInterceptor";
import { messageToGrpcWebText } from "./mock";
import {
  EchoServiceClient,
  EchoServicePromiseClient,
} from "./pb/echo_grpc_web_pb";
import {
  EchoRequest,
  EchoResponse,
  ServerStreamingEchoRequest,
  ServerStreamingEchoResponse,
} from "./pb/echo_pb";

describe("test logging interceptor", () => {
  beforeEach(() => xhrMock.setup());
  afterEach(() => xhrMock.teardown());

  test("should log streaming call", (done) => {
    const log = jest.fn();

    const options = {
      // unaryInterceptors: [new LoggingUnaryInterceptor()],
      streamInterceptors: [new LogStreamInterceptor(log)],
    };
    const client = new EchoServiceClient("", null, options);
    const req = new ServerStreamingEchoRequest();
    req.setMessageCount(10);
    req.setMessageInterval(1);
    req.setMessage("foo");

    xhrMock.post(
      "/grpc.gateway.testing.EchoService/ServerStreamingEcho",
      (_req, res) => {
        const resp = new ServerStreamingEchoResponse();
        resp.setMessage("foo");

        const body = messageToGrpcWebText(resp);
        return res
          .status(200)
          .header("content-type", "application/grpc-web-text")
          .body(body);
      }
    );

    const stream = client.serverStreamingEcho(req);
    stream.on("error", () => {
      throw new Error("Shouldn't error");
    });
    stream.on("data", (d) => {
      expect(d.toObject()).toEqual({ message: "foo" });
    });

    stream.on("end", () => {
      expect(log.mock.calls.length).toBe(2);
      done();
    });
  });

  test("stream interceptor also work on unary call in RPC callback way", (done) => {
    const log = jest.fn();

    const options = {
      // unaryInterceptors: [new LoggingUnaryInterceptor()],
      streamInterceptors: [new LogStreamInterceptor(log)],
    };
    const client = new EchoServiceClient("", null, options);

    // test streaming interceptor doesn't work for unary calls
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
    client.echo(req, {}, (err, resp) => {
      expect(err).toBeNull();
      expect(log.mock.calls.length).toBe(2);
      expect(resp.toObject()).toEqual({ message: "bar", value: "2" });
      done();
    });
  });

  test("stream interceptor doesn't on unary call in promise client", async () => {
    const log = jest.fn();

    const options = {
      // unaryInterceptors: [new LoggingUnaryInterceptor()],
      streamInterceptors: [new LogStreamInterceptor(log)],
    };
    const client = new EchoServicePromiseClient("", null, options);

    // test streaming interceptor doesn't work for unary calls
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

    const resp = await client.echo(req);
    expect(resp.toObject()).toEqual({ message: "bar", value: "2" });
    expect(log.mock.calls.length).toBe(0);
  });

  test("unary interceptor works with promise client", async () => {
    const log = jest.fn();

    const options = {
      unaryInterceptors: [new LogUnaryInterceptor(log)],
      // streamInterceptors: [new LoggingStreamInterceptor(log)],
    };
    const client = new EchoServicePromiseClient("", null, options);

    // test streaming interceptor doesn't work for unary calls
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

    const resp = await client.echo(req);
    expect(resp.toObject()).toEqual({ message: "bar", value: "2" });
    expect(log.mock.calls.length).toBe(2);
  });
});
