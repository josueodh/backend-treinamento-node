import { response, Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import Post from '../models/Post';
import CreatePostService from '../services/CreatePostService';
import UpdatePostService from '../services/UpdatePostService';

const postsRouter = Router();
const upload = multer(uploadConfig);


postsRouter.post('/', upload.single('imageUrl'), async (request, response) => {
    try {
        const { title, description } = request.body;

        const createPost = new CreatePostService();

        const post = await createPost.execute({
            title,
            description,
            user_id: request.user.id,
            imageUrl: request.file.filename,
        });

        return response.status(200).json(post);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

postsRouter.get('/', async (request, response) => {
    try {
        const postRepository = getRepository(Post);
        const posts = await postRepository.find();
        return response.status(200).json(posts);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

postsRouter.get('/:id', async (request, response) => {
    const { id } = request.params;

    const postRepository = getRepository(Post);

    const post = await postRepository.findOne(id);

    return response.status(200).json(post);
})

postsRouter.put('/:id', upload.single('imageUrl'), async (request, response) => {
    const { title, description } = request.body;
    const { id } = request.params;

    const updatePost = new UpdatePostService();

    const post = await updatePost.execute({
        id,
        title,
        description,
        imageUrl: request.file.filename,
    });

    return response.status(200).json(post);

});

postsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;

    const postRepository = getRepository(Post);

    await postRepository.delete(id);

    return response.status(200).json();
})

postsRouter.patch('/:id/like', async (request, response) => {
    const { id } = request.params;

    const postRepository = getRepository(Post);

    const post = await postRepository.findOneOrFail(id);

    post.like += 1;

    postRepository.save(post);

    return response.status(200).json(post);
})
export default postsRouter;