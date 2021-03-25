/**
 * @fileoverview gRPC-Web generated client stub for grpc.gateway.testing
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.grpc = {};
proto.grpc.gateway = {};
proto.grpc.gateway.testing = require('./echo_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.grpc.gateway.testing.EchoServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.grpc.gateway.testing.EchoServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.grpc.gateway.testing.EchoRequest,
 *   !proto.grpc.gateway.testing.EchoResponse>}
 */
const methodDescriptor_EchoService_Echo = new grpc.web.MethodDescriptor(
  '/grpc.gateway.testing.EchoService/Echo',
  grpc.web.MethodType.UNARY,
  proto.grpc.gateway.testing.EchoRequest,
  proto.grpc.gateway.testing.EchoResponse,
  /**
   * @param {!proto.grpc.gateway.testing.EchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.grpc.gateway.testing.EchoResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.grpc.gateway.testing.EchoRequest,
 *   !proto.grpc.gateway.testing.EchoResponse>}
 */
const methodInfo_EchoService_Echo = new grpc.web.AbstractClientBase.MethodInfo(
  proto.grpc.gateway.testing.EchoResponse,
  /**
   * @param {!proto.grpc.gateway.testing.EchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.grpc.gateway.testing.EchoResponse.deserializeBinary
);


/**
 * @param {!proto.grpc.gateway.testing.EchoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.grpc.gateway.testing.EchoResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.grpc.gateway.testing.EchoResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.grpc.gateway.testing.EchoServiceClient.prototype.echo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/grpc.gateway.testing.EchoService/Echo',
      request,
      metadata || {},
      methodDescriptor_EchoService_Echo,
      callback);
};


/**
 * @param {!proto.grpc.gateway.testing.EchoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.grpc.gateway.testing.EchoResponse>}
 *     Promise that resolves to the response
 */
proto.grpc.gateway.testing.EchoServicePromiseClient.prototype.echo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/grpc.gateway.testing.EchoService/Echo',
      request,
      metadata || {},
      methodDescriptor_EchoService_Echo);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.grpc.gateway.testing.ServerStreamingEchoRequest,
 *   !proto.grpc.gateway.testing.ServerStreamingEchoResponse>}
 */
const methodDescriptor_EchoService_ServerStreamingEcho = new grpc.web.MethodDescriptor(
  '/grpc.gateway.testing.EchoService/ServerStreamingEcho',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.grpc.gateway.testing.ServerStreamingEchoRequest,
  proto.grpc.gateway.testing.ServerStreamingEchoResponse,
  /**
   * @param {!proto.grpc.gateway.testing.ServerStreamingEchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.grpc.gateway.testing.ServerStreamingEchoResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.grpc.gateway.testing.ServerStreamingEchoRequest,
 *   !proto.grpc.gateway.testing.ServerStreamingEchoResponse>}
 */
const methodInfo_EchoService_ServerStreamingEcho = new grpc.web.AbstractClientBase.MethodInfo(
  proto.grpc.gateway.testing.ServerStreamingEchoResponse,
  /**
   * @param {!proto.grpc.gateway.testing.ServerStreamingEchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.grpc.gateway.testing.ServerStreamingEchoResponse.deserializeBinary
);


/**
 * @param {!proto.grpc.gateway.testing.ServerStreamingEchoRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.grpc.gateway.testing.ServerStreamingEchoResponse>}
 *     The XHR Node Readable Stream
 */
proto.grpc.gateway.testing.EchoServiceClient.prototype.serverStreamingEcho =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/grpc.gateway.testing.EchoService/ServerStreamingEcho',
      request,
      metadata || {},
      methodDescriptor_EchoService_ServerStreamingEcho);
};


/**
 * @param {!proto.grpc.gateway.testing.ServerStreamingEchoRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.grpc.gateway.testing.ServerStreamingEchoResponse>}
 *     The XHR Node Readable Stream
 */
proto.grpc.gateway.testing.EchoServicePromiseClient.prototype.serverStreamingEcho =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/grpc.gateway.testing.EchoService/ServerStreamingEcho',
      request,
      metadata || {},
      methodDescriptor_EchoService_ServerStreamingEcho);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.grpc.gateway.testing.EchoStatusRequest,
 *   !proto.grpc.gateway.testing.EchoStatusResponse>}
 */
const methodDescriptor_EchoService_EchoStatus = new grpc.web.MethodDescriptor(
  '/grpc.gateway.testing.EchoService/EchoStatus',
  grpc.web.MethodType.UNARY,
  proto.grpc.gateway.testing.EchoStatusRequest,
  proto.grpc.gateway.testing.EchoStatusResponse,
  /**
   * @param {!proto.grpc.gateway.testing.EchoStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.grpc.gateway.testing.EchoStatusResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.grpc.gateway.testing.EchoStatusRequest,
 *   !proto.grpc.gateway.testing.EchoStatusResponse>}
 */
const methodInfo_EchoService_EchoStatus = new grpc.web.AbstractClientBase.MethodInfo(
  proto.grpc.gateway.testing.EchoStatusResponse,
  /**
   * @param {!proto.grpc.gateway.testing.EchoStatusRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.grpc.gateway.testing.EchoStatusResponse.deserializeBinary
);


/**
 * @param {!proto.grpc.gateway.testing.EchoStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.grpc.gateway.testing.EchoStatusResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.grpc.gateway.testing.EchoStatusResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.grpc.gateway.testing.EchoServiceClient.prototype.echoStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/grpc.gateway.testing.EchoService/EchoStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_EchoStatus,
      callback);
};


/**
 * @param {!proto.grpc.gateway.testing.EchoStatusRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.grpc.gateway.testing.EchoStatusResponse>}
 *     Promise that resolves to the response
 */
proto.grpc.gateway.testing.EchoServicePromiseClient.prototype.echoStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/grpc.gateway.testing.EchoService/EchoStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_EchoStatus);
};


module.exports = proto.grpc.gateway.testing;

