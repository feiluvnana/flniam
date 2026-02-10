import { defineConfig, drivers } from '@adonisjs/core/hash'
import { HashDriverContract } from '@adonisjs/core/types/hash'
import crypto from 'node:crypto'

const hashConfig = defineConfig({
  list: {
    bcrypt: drivers.bcrypt({ rounds: 12 }),
    sha256: () => new Sha256Driver(),
  },
})
export default hashConfig
declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}

class Sha256Driver implements HashDriverContract {
  isValidHash(value: string): boolean {
    return /^[a-f0-9]{64}$/.test(value)
  }

  make(value: string): Promise<string> {
    return Promise.resolve(crypto.createHash('sha256').update(value).digest('hex'))
  }

  async verify(hashedValue: string, plainValue: string): Promise<boolean> {
    return Promise.resolve((await this.make(plainValue)) === hashedValue)
  }

  needsReHash(_: string): boolean {
    return false
  }
}
