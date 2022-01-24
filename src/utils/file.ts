import fs from 'fs'

// function responsible to delete files of the system 
export const deleteFile = async (filename: string) => {

    try {
        await fs.promises.stat(filename)
    } catch {
        return
    }

    await fs.promises.unlink(filename)
}