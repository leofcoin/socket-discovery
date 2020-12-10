export default class PeernetPeer {
  constructor(id, connection) {
    this.id = id
    this.connection = connection

    this.connection.on('data', (message) => pubsub.publish('peernet.data', message))
  }

  request(data) {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).slice(-12)
      data = Buffer.from(JSON.stringify({id, data}))
      const _onData = (message) => {
        message = JSON.parse(message.toString())
        if (message.id !== id) return

        resolve(message.data)
      }

      pubsub.subscribe('peernet.data.request', _onData)

      // cleanup subscriptions
      setTimeout(() => {
        pubsub.unsubscribe('peernet.data.request', _onData)
      }, 5000);

      this.write(data)
    });
  }

  write(data) {
    if (!Buffer.isBuffer(data)) data = Buffer.from(data)
    this.connection.write(data)
  }

  on(event = 'peernet.data', cb) {
    pubsub.subscribe(event, cb)
    // this.connection.on(event, cb)
  }

  removeListener(event = 'data', cb) {
    pubsub.unsubscribe(event, cb)
  }
}