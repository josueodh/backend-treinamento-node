"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const multer_1 = __importDefault(require("multer"));
const upload_1 = __importDefault(require("../config/upload"));
const AuthenticateUserService_1 = __importDefault(require("../services/AuthenticateUserService"));
const CreateUserService_1 = __importDefault(require("../services/CreateUserService"));
const UpdateUserService_1 = __importDefault(require("../services/UpdateUserService"));
const User_1 = __importDefault(require("../models/User"));
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const usersRouter = express_1.Router();
const upload = multer_1.default(upload_1.default);
usersRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = request.body;
        const createUser = new CreateUserService_1.default();
        const user = yield createUser.execute({
            name,
            email,
            password
        });
        const newUser = {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
        };
        return response.status(200).json(newUser);
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
}));
usersRouter.put('/:id/image', ensureAuthenticated_1.default, upload.single('avatar'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = request.body;
    const { id } = request.params;
    const updateUser = new UpdateUserService_1.default();
    const avatar = request.file ? request.file.filename : undefined;
    const user = yield updateUser.execute({
        id,
        name,
        avatar: avatar
    });
    const newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };
    return response.status(200).json(newUser);
}));
usersRouter.put('/:id', ensureAuthenticated_1.default, upload.single('avatar'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, avatar } = request.body;
    const { id } = request.params;
    const usersRepository = typeorm_1.getRepository(User_1.default);
    const user = yield usersRepository.findOne(id);
    if (user) {
        if (name != null) {
            user.name = name;
        }
        if (avatar == null) {
            user.avatar = "https://secure.gravatar.com/avatar/84a92f9a532e6d110dc0056cd2377b09?s=96&d=mm&r=g";
        }
        else {
            user.avatar = avatar;
        }
        usersRepository.save(user);
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        };
        return response.status(200).json(newUser);
    }
    return response.status(404).json('Not Found');
}));
usersRouter.post('/login', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
        const usersRepository = typeorm_1.getRepository(User_1.default);
        const hasUser = yield usersRepository.findOne({ email });
        if (!hasUser) {
            const createUser = new CreateUserService_1.default();
            const avatar = "https://secure.gravatar.com/avatar/84a92f9a532e6d110dc0056cd2377b09?s=96&d=mm&r=g";
            const newUser = yield createUser.execute({
                name, email, password, avatar
            });
        }
        const authenticateUser = new AuthenticateUserService_1.default();
        const { user, token } = yield authenticateUser.execute({
            email,
            password
        });
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        };
        return response.status(200).json({ newUser, token });
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
}));
exports.default = usersRouter;
