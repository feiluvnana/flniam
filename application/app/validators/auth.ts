import vine from '@vinejs/vine'

const checkAuthValidator = vine.create(
  vine.array(
    vine.object({
      action: vine.string(),
      resource: vine.string(),
    })
  )
)

export { checkAuthValidator }
