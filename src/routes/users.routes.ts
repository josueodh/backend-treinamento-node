import { Router } from 'express';
import { getRepository } from 'typeorm';

import AuthenticateUserService from '../services/AuthenticateUserService';
import CreateUserService from '../services/CreateUserService';
import User from '../models/User';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password
        });

        delete user.password;

        return response.status(200).json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

usersRouter.post('/login', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            const createUser = new CreateUserService();

            const user = await createUser.execute({
                name, email, password
            })
        } else {

            const authenticateUser = new AuthenticateUserService();

            const { user, token } = await authenticateUser.execute({
                email,
                password
            });

        }

        delete user.password;

        return response.status(200).json(user);

    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
})

export default usersRouter;