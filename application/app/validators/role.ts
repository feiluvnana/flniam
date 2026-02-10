import vine from '@vinejs/vine'

export const indexRoleValidator = vine.create(
  vine.object({
    tenantId: vine.string(),
    limit: vine.number().optional(),
    lastRoleId: vine.string().optional(),
  })
)

export const storeRoleValidator = vine.create(
  vine.object({
    tenantId: vine.string(),
    name: vine.string(),
    permissionIds: vine.array(vine.string()).minLength(1),
  })
)
