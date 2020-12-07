import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import AuthenticateUserService from '../services/AuthenticateUserService';
import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserService';
import User from '../models/User';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password
        });

        const newUser = {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
        }

        return response.status(200).json(newUser);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

usersRouter.put('/:id', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const { name } = request.body;
    const { id } = request.params;

    const updateUser = new UpdateUserService();

    const avatar = request.file ? request.file.filename : undefined;
    const user = await updateUser.execute({
        id,
        name,
        avatar: avatar
    });
    const newUser = {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    }

    return response.status(200).json(newUser);


});
usersRouter.post('/login', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const usersRepository = getRepository(User);

        const hasUser = await usersRepository.findOne({ email });

        if (!hasUser) {
            const createUser = new CreateUserService();

            const newUser = await createUser.execute({
                name, email, password
            })
        }

        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
            email,
            password
        });



        const newUser = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }

        return response.status(200).json({ newUser, token });

    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
})

export default usersRouter;