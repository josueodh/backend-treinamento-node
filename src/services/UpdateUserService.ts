import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload'
import User from '../models/User';

interface Request {
    id: string;
    name: string;
    avatar?: string;
}

class UpdateUserService {
    public async execute({ id, name, avatar }: Request): Promise<User> {
        const usersReposity = getRepository(User);

        const user = await usersReposity.findOneOrFail(id);

        if (name) {
            user.name = name;
        }

        if (avatar) {
            if (user.avatar) {
                const userImageFilePath = path.join(uploadConfig.directory, user.avatar);
                try {
                    const postImageFileExists = fs.promises.stat(userImageFilePath);
                    if (postImageFileExists) {
                        await fs.promises.unlink(userImageFilePath);
                    }
                } catch (err) {
                    throw new Error('Error to remove the file');
                }
            }
            user.avatar = avatar;
        }

        await usersReposity.save(user);

        return user;
    }
}

export default UpdateUserService;