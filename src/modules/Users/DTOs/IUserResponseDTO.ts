// interface to type data transfer object when passing it on response object

interface IUserResponseDTO {
    id: string
    name: string
    email: string
    username: string
    avatar: string
}

export { IUserResponseDTO }