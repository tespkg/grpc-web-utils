import xhrMock from "xhr-mock";
import {
  AuthStreamInterceptor,
  AuthUnaryInterceptor,
  isGrpcWebError,
} from "../src";
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

describe("test auth interceptor", () => {
  beforeEach(() => xhrMock.setup());
  afterEach(() => xhrMock.teardown());

  test("should call onUnauthenticated in streaming", (done) => {
    const getToken = jest.fn().mockReturnValue("foo token");
    const onUnauthenticated = jest.fn();

    const options = {
      // unaryInterceptors: [new LoggingUnaryInterceptor()],
      streamInterceptors: [
        new AuthStreamInterceptor(onUnauthenticated, getToken),
      ],
    };

    const client = new EchoServiceClient("", null, options);
    const req = new ServerStreamingEchoRequest();
    req.setMessageCount(10);
    req.setMessageInterval(1);
    req.setMessage("foo");

    xhrMock.post(
      "/grpc.gateway.testing.EchoService/ServerStreamingEcho",
      (req, res) => {
        const authHeader = req.header("Authorization");
        expect(authHeader).toContain("foo token");

        const resp = new ServerStreamingEchoResponse();
        resp.setMessage("foo");
        const body = messageToGrpcWebText(resp);
        return res
          .status(200)
          .header("content-type", "application/grpc-web-text")
          .header("grpc-message", "foobar grpc message")
          .header("grpc-status", "16")
          .body(body);
      }
    );

    const stream = client.serverStreamingEcho(req);
    stream.on("error", (e) => {
      expect(isGrpcWebError(e)).toBeTruthy();
      expect(onUnauthenticated.mock.calls.length).toBe(1);
      expect(getToken.mock.calls.length).toBe(1);
      done();
    });
    stream.on("data", (d) => {
      expect(d.toObject()).toEqual({ message: "foo" });
    });
  });

  test("should call onUnauthenticated in promise client", async () => {
    const getToken = jest.fn().mockReturnValue("foo token");
    const onUnauthenticated = jest.fn();

    const options = {
      unaryInterceptors: [
        new AuthUnaryInterceptor(onUnauthenticated, getToken),
      ],
    };

    const client = new EchoServicePromiseClient("", null, options);
    const req = new EchoRequest();
    req.setValue(1);
    req.setMessage("foo");

    xhrMock.post("/grpc.gateway.testing.EchoService/Echo", (req, res) => {
      const resp = new EchoResponse();
      resp.setMessage("bar");
      resp.setValue("2");

      const authHeader = req.header("Authorization");
      expect(authHeader).toContain("foo token");

      const body = messageToGrpcWebText(resp);
      return res
        .status(200)
        .header("content-type", "application/grpc-web-text")
        .header("grpc-message", "foobar grpc message")
        .header("grpc-status", "16")
        .body(body);
    });

    try {
      await client.echo(req);
      throw new Error("shouldn't be here");
    } catch (e) {
      expect(isGrpcWebError(e)).toBeTruthy();
      expect(onUnauthenticated.mock.calls.length).toBe(1);
      expect(getToken.mock.calls.length).toBe(1);
    }
  });
});
