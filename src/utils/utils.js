import fetch from 'node-fetch'
import Codec from './../codec/codec.js'

export const expected = (expected, actual) => {
  const rule = (entry) => {
    return !entry ? `: undefined - ${entry} ` :`: ${typeof entry} - `
  }

  const entries = Object.entries(actual)
      .map((entry) => entry.join(rule(entry[1])));

  return `\nExpected:
    ${expected.join('\n\t')}
    
    actual:
      ${entries.join('\n\t')}`;
}

export const debug = (log) => {
  if (globalThis.DEBUG) console.log(`%c ${log}`, 'color: #0080ff;')
}

export const protoFor = (data) => {
  if (!Buffer.isBuffer(data)) data = Buffer.from(data)
  const codec = new Codec(data)
  if (!codec.name) throw new Error('proto not found')
  const Proto = globalThis.peernet.protos[codec.name]
  if (!Proto) throw (new Error(`No proto defined for ${codec.name}`))
  return new Proto(data)
}

/**
 * wether or not a peernet daemon is active
 * @return {Boolean}
 */
export const hasDaemon = async () => {
  try {
    let response = await fetch('http://127.0.0.1:1000/api/version')
    response = await response.json()
    return Boolean(response.client === '@peernet/api/http')
  } catch (e) {
    return false
  }
}

export const https = () => {
  if (!globalThis.location) return false;
  return Boolean(globalThis.location.protocol === 'https:')
}

/**
 * Get current environment
 * @return {String} current environment [node, electron, browser]
 */
export const environment = () => {
  const _navigator = globalThis.navigator
  if (!_navigator) {
    return 'node'
  } else if (_navigator && /electron/i.test(_navigator.userAgent)) {
    return 'electron'
  } else {
    return 'browser'
  }
}

/**
 * * Get current environment
 * @return {Object} result
 * @property {Boolean} reult.daemon whether or not daemon is running
 * @property {Boolean} reult.environment Current environment
 */
export const target = async () => {
  let daemon = false
  const env = await environment()
  if (!https()) daemon = await hasDaemon()

  return {daemon, environment: env}
}
