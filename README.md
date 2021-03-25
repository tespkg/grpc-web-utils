# grpc-web-utils

grpc-web utils for nodejs

check release



Cancellation example usage:

* deadline

```
// feature: deadline
// const deadline = new Date()
// deadline.setMilliseconds(deadline.getMilliseconds() + 1000)
// md['deadline'] = deadline.getTime()
    // feature: cancellation:
    // const controller = new AbortController()
    // client.call(req, {signal: controller.signal})
    // controller.abort()

**N.B.**

* *StreamInterceptor works with RPC client and UnaryInterceptor works with Promise client

