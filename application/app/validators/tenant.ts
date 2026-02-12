import vine from '@vinejs/vine'

export const storeTenantValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(100).unique({ table: 'tenants', column: 'name' }),
    description: vine.string().minLength(3).maxLength(100).optional(),
  })
)
