# grpc-web-utils

grpc-web utils for nodejs

check release

## install

```
npm install grpc-web-utils
# or
yarn add grpc-web-utils
```

## usage

### Authentication

see [tests/authInterceptor.test.ts](tests/authInterceptor.test.ts)

```
const getToken = () => "xxx.yyy.zzz";
const onUnauthenticated = () => redirectToLogin(navigate);

const options = {
  unaryInterceptors: [
    new AuthUnaryInterceptor(onUnauthenticated, getToken),
  ],
  streamInterceptors: [
    new AuthStreamInterceptor(onUnauthenticated, getToken),
  ],
};

const client = new EchoServiceClient("localhost:9111", null, options);
const req = new ServerStreamingEchoRequest();
const resp = await client.echo(req);
```

### Cancellation

Cancellation example usage:

- deadline (see [tests/signalInterceptor.test.ts](tests/signalInterceptor.test.ts))

```

const deadline = new Date();
deadline.setMilliseconds(deadline.getMilliseconds() + 1000); // timeout 1000 ms
md["deadline"] = deadline.getTime().toString();

```

- cancellation (streaming)

```

const options = {
streamInterceptors: [new SignalStreamInterceptor()],
};
const client = new EchoServiceClient("", null, options);
const req = new ServerStreamingEchoRequest();
const controller = new AbortController(); // controller usually created by frameworks e.g. redux-toolkit
const stream = client.serverStreamingEcho(req, { signal: controller.signal, } as MetadataWithSignal);
controller.abort();

```

**N.B.**

- StreamInterceptor works with RPC client
- createPromiseClient doesn't work for cancellation, see `tests/promiseClient.test.ts` skipped test

