import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export default class Generators {
  static id(prefix: string): string {
    const characters = '-0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz'
    let now = DateTime.now().toMillis()
    let timestamp = ''
    let temp = now
    while (temp > 0) {
      timestamp = characters.charAt(temp % characters.length) + timestamp
      temp = Math.floor(temp / characters.length)
    }
    const random = Array.from({ length: 12 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('')
    return `${prefix}.${timestamp}${random}`
  }

  static secret(): string {
    return crypto.randomBytes(32).toString('hex')
  }
}
