import vine from '@vinejs/vine'

export const indexPermissionValidator = vine.create(
  vine.object({
    tenantId: vine.string().optional(),
    limit: vine.number().optional(),
    lastPermissionId: vine.string().optional(),
  })
)

export const storePermissionValidator = vine.create(
  vine.object({
    tenantId: vine.string(),
    action: vine.string(),
    resource: vine.string(),
  })
)

export const updatePermissionValidator = vine.create(
  vine.object({
    tenantId: vine.string().optional(),
    action: vine.string().optional(),
    resource: vine.string().optional(),
  })
)
