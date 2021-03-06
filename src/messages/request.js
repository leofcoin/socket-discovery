import protons from 'protons'
import proto from './../proto/request.proto.js'
import CodecFormat from './../codec/codec-format-interface.js'

export default class RequestMessage extends CodecFormat {
  get keys() {
    return ['request']
  }

  constructor(data) {
    const name = 'peernet-request'
    super(data, protons(proto).PeernetRequestMessage, {name})
  }
}
