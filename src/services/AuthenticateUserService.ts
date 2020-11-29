import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';

interface Request {
    email: string;
    password: string;
}
class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<{ user: User, token: string }> {
        const usersRepository = await getRepository(User);

        const user = await usersRepository.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('Incorrect e-mail/password combination.');
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new Error('Incorrect e-mail/password combination.');
        }

        const token = sign({}, 'd4a83f41e68b99c2030c9d3b6f1cbd5a', {
            subject: user.id,
            expiresIn: '1d',
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;