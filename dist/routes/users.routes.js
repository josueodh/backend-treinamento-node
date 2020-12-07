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
usersRouter.put('/:id', ensureAuthenticated_1.default, upload.single('avatar'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };
    return response.status(200).json(newUser);
}));
usersRouter.post('/login', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = request.body;
        const usersRepository = typeorm_1.getRepository(User_1.default);
        const hasUser = yield usersRepository.findOne({ email });
        if (!hasUser) {
            const createUser = new CreateUserService_1.default();
            const newUser = yield createUser.execute({
                name, email, password
            });
        }
        const authenticateUser = new AuthenticateUserService_1.default();
        const { user, token } = yield authenticateUser.execute({
            email,
            password
        });
        const newUser = {
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
