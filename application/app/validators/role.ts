import vine from '@vinejs/vine'

export const storeRoleValidator = vine.create(
  vine.object({
    tenantId: vine.string(),
    name: vine.string(),
    permissionIds: vine.array(vine.string()).minLength(1),
  })
)
