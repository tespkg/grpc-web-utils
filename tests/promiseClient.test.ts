import xhrMock from "xhr-mock";
import { MetadataWithSignal, SignalStreamInterceptor } from "../src";
import { messageToGrpcWebText } from "./mock";
import {
  EchoServiceClient,
  EchoServicePromiseClient,
} from "./pb/echo_grpc_web_pb";
import { EchoRequest, EchoResponse } from "./pb/echo_pb";
import { createPromiseClient } from "../src/promiseClient";

describe("promise client", () => {
  beforeEach(() => xhrMock.setup());
  afterEach(() => xhrMock.teardown());
  test("Should cancel using create promise client", async () => {
    const rpc = new EchoServiceClient("");
    const client: EchoServicePromiseClient = createPromiseClient(rpc);

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
  });

  // this doesn't work, which means our promise client doesn't really make sense:
  //
  // when stream is cancelled, it doesn't call any handler, not even end handler:
  // https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientreadablestream.js#L251
  test.skip("Should cancel using create promise client", async () => {
    const options = {
      streamInterceptors: [new SignalStreamInterceptor()],
    };

    const rpc = new EchoServiceClient("", null, options);
    const client: EchoServicePromiseClient = createPromiseClient(rpc);

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

    try {
      await p;
      throw new Error("shouldn't be here");
    } catch (e) {
      console.log(e);
    }
  });
});
