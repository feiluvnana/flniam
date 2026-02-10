import vine from '@vinejs/vine'

export const storePrincipalValidator = vine.compile(
  vine.object({
    tenantId: vine.string(),
    type: vine.enum(['user', 'service_account']),
    status: vine.enum(['active', 'inactive']),
    user: vine
      .object({
        username: vine.string(),
        password: vine.string(),
      })
      .optional()
      .requiredWhen('type', '=', 'user'),
    roleIds: vine.array(vine.string()),
    permissionIds: vine.array(vine.string()),
  })
)
