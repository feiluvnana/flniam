import vine from '@vinejs/vine'

export const storeTenantValidator = vine.create(
  vine.object({
    name: vine.string().trim().escape().minLength(1),
    description: vine.string().trim().escape().minLength(1).optional(),
  })
)
