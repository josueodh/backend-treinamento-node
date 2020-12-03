import { Router } from 'express';
import { getRepository } from 'typeorm';

import Comment from '../models/Comment';

const commentsRouter = Router();

interface Request {
    user_id: string;
    post_id: string;
    text: string;
}

commentsRouter.post('/', async (request, response) => {
    const { user_id, post_id, text }: Request = request.body;

    const commentRepository = getRepository(Comment);

    const comment = commentRepository.create({
        post_id, user_id, text
    });

    await commentRepository.save(comment);

    return response.status(200).json(comment);
});

commentsRouter.get('/', async (request, response) => {
    const commentRepository = getRepository(Comment);

    const comments = await commentRepository.find();

    return response.status(200).json(comments);

});

commentsRouter.put('/:id', async (request, response) => {
    const { text } = request.body;
    const { id } = request.params;
    const commentRepository = getRepository(Comment);

    const comment = await commentRepository.findOneOrFail(id);

    comment.text = text;

    commentRepository.save(comment);

    return response.status(200).json(comment);
});

commentsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;

    const commentRepository = getRepository(Comment);

    commentRepository.delete(id);

    return response.status(200).json();
})

export default commentsRouter;