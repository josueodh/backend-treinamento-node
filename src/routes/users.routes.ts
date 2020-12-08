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

usersRouter.put('/:id/image', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
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
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    }

    return response.status(200).json(newUser);


});

usersRouter.put('/:id', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const { name, avatar } = request.body;
    const { id } = request.params;

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(id);
    if (user) {

        if (name != null) {
            user.name = name;
        }

        if (avatar == null) {
            user.avatar = "https://secure.gravatar.com/avatar/84a92f9a532e6d110dc0056cd2377b09?s=96&d=mm&r=g";
        } else {
            user.avatar = avatar;
        }

        usersRepository.save(user);

        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }

        return response.status(200).json(newUser);
    }

    return response.status(404).json('Not Found');


});
usersRouter.post('/login', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        if (name == "") {
            throw new Error("Name is required");
        }

        if (email == "") {
            throw new Error("E-mail is required");
        }

        if (password == "") {
            throw new Error("Password is required");
        }
        const usersRepository = getRepository(User);

        const hasUser = await usersRepository.findOne({ email });

        if (!hasUser) {
            const createUser = new CreateUserService();
            const avatar = "https://secure.gravatar.com/avatar/84a92f9a532e6d110dc0056cd2377b09?s=96&d=mm&r=g";
            const newUser = await createUser.execute({
                name, email, password, avatar
            });
        }

        const authenticateUser = new AuthenticateUserService();

        const { user, token } = await authenticateUser.execute({
            email,
            password
        });



        const newUser = {
            id: user.id,
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