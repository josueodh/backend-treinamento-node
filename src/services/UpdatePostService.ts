import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload'
import Post from '../models/Post';

interface Request {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

class UpdateUserService {
    public async execute({ id, title, description, imageUrl }: Request): Promise<Post> {

        const postRepository = getRepository(Post);

        const post = await postRepository.findOneOrFail(id);
        if (!post) {
            throw new Error("Can't find this post.");
        }

        if (post.imageUrl) {
            const postImageFilePath = path.join(uploadConfig.directory, post.imageUrl);
            try {
                const postImageFileExists = fs.promises.stat(postImageFilePath);
                if (postImageFileExists) {
                    await fs.promises.unlink(postImageFilePath);
                }
            } catch (err) {
                throw new Error('Error to remove the file');
            }
        }

        post.title = title;
        post.description = description;
        post.imageUrl = imageUrl;

        await postRepository.save(post);

        return post;
    }
}

export default UpdateUserService;