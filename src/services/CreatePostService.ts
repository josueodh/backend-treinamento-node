import { getRepository } from 'typeorm';
import Post from '../models/Post';

interface Request {
    title: string;
    description: Text;
    user_id: string;
    imageUrl: string;
}

class CreateUserService {
    public async execute({ title, description, user_id, imageUrl }: Request): Promise<Post> {

        const postRepository = getRepository(Post);

        const post = postRepository.create({
            title, description, user_id, imageUrl
        });

        await postRepository.save(post);

        return post;
    }
}

export default CreateUserService;