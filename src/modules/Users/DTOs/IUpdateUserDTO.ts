// Interface to type data transfer object when updating user

interface IUpdateUserDTO {
    user_id: string
    name?: string
    avatar?: string
    email?: string
    old_password?: string
    new_password?: string
    username?: string
}

export { IUpdateUserDTO }