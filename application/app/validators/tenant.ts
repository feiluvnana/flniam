import vine from '@vinejs/vine'

export const storeTenantValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(100),
    description: vine.string().minLength(3).maxLength(100).optional(),
  })
)
