import vine from '@vinejs/vine'

export const indexRoleValidator = vine.create(
  vine.object({
    limit: vine.number().optional(),
    lastRoleId: vine.string().optional(),
  })
)

export const storeRoleValidator = vine.create(
  vine.object({
    name: vine.string(),
    permissionIds: vine.array(vine.string()).minLength(1),
  })
)
