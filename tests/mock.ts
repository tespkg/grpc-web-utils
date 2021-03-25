import { bytesToBase64, base64ToBytes } from "byte-base64";
import { Message } from "google-protobuf";

export function messageToGrpcWebText(...messages: Message[]) {
  let len = 0;
  const bufs = messages.map((r) => {
    const bytes = r.serializeBinary();
    len += bytes.length;
    return bytes;
  });
  const result = Buffer.alloc(len + 5 * bufs.length); // 1 byte frame type, 4 byte length, then message
  let pos = 0;
  bufs.forEach((buf) => {
    pos++; // 0x00 frame type = DATA
    pos = result.writeInt32BE(len, pos); // 4 byte length
    result.set(buf, pos);
    pos += buf.length;
  });

  return bytesToBase64(result);
}

export function messageFromGrpcWebText<T extends Message>(
  bytes: string,
  messageConstruct: {
    deserializeBinary: (bytes: Uint8Array) => T;
  }
): T {
  const buf = Buffer.from(base64ToBytes(bytes));
  let pos = 0;
  if (buf.readInt8(pos) !== 0x00) {
    throw new Error("expecting FrameType.DATA: 0x00");
  }
  pos++;
  const len = buf.readInt32BE(pos);
  if (len <= 0) {
    throw new Error("expecting positive len");
  }
  pos += 4;
  return messageConstruct.deserializeBinary(buf.slice(pos, pos + len));
}
