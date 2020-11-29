import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
interface Request {
    name: string;
    email: string;
    password: string;
}
class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersReposity = getRepository(User);

        const checkUserExists = await usersReposity.findOne({
            where: { email },
        });
        if (checkUserExists) {
            throw new Error('E-mail address already used by another person');
        }
        const hashedPassword = await hash(password, 8);
        const user = usersReposity.create({
            name,
            email,
            password: hashedPassword
        });

        await usersReposity.save(user);

        return user;
    }
}

export default CreateUserService;