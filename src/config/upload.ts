import multer from 'multer'
import crypto from 'crypto'
import { resolve } from 'path'

// Function to control the uploads made in the system,
// It receives the folder where it should be saved and create a randomic string as filename
// The extension of the file it catched by file.mimetype spliting what is after '/'
export default {
    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', folder),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString('hex')
                    const filename = `${fileHash}.${file.mimetype.split('/')[1]}`

                    return callback(null, filename)
                }
            })
        }
    }
}