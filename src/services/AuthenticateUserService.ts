import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';

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
        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn: expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;