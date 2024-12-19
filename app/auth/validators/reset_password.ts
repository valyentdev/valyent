import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.compile(
  vine.object({
    newPassword: vine.string().minLength(8).confirmed({ confirmationField: 'confirmPassword' }),
  })
)
