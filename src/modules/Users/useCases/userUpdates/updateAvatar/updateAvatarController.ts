import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAvatarUseCase } from "./updateAvatarUseCase";

class UpdateAvatarController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { id: user_id } = request.user

        const avatarFile = request.file.filename

        const updateAvatarUseCase = container.resolve(UpdateAvatarUseCase)

        const result = await updateAvatarUseCase.execute({
            user_id,
            avatar: avatarFile
        })

        return response.json(result)
    }
}

export { UpdateAvatarController }