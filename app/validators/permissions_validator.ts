import vine from '@vinejs/vine'

export const storePermissionValidator = vine.compile(
  vine.object({
    tenantId: vine.string(),
    action: vine.enum(['create', 'read', 'update', 'delete', 'manage']),
    resource: vine.string(),
    fields: vine.array(vine.string()).optional(),
    condition: vine.object({}).allowUnknownProperties().optional(),
  })
)
