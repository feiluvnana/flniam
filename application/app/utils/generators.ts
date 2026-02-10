import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export default class Generators {
  static id(prefix: string): string {
    const characters = '-0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz'
    let now = DateTime.now().toMillis()
    let result = `${prefix}.`
    while (now > 0) {
      result += characters.charAt(now % characters.length)
      now = Math.floor(now / characters.length)
    }
    result += Array.from({ length: 12 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('')
    return result
  }

  static secret() {
    return crypto.randomBytes(32).toString('base64')
  }
}
