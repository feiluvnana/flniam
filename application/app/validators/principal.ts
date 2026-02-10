import vine from '@vinejs/vine'

export const indexPrincipalValidator = vine.create(
  vine.object({
    limit: vine.number().optional(),
    lastPrincipalId: vine.string().optional(),
  })
)

export const storePrincipalValidator = vine.create(
  vine.object({
    type: vine.enum(['user', 'service_account']),
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
