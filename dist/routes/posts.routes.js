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
const Post_1 = __importDefault(require("../models/Post"));
const CreatePostService_1 = __importDefault(require("../services/CreatePostService"));
const UpdatePostService_1 = __importDefault(require("../services/UpdatePostService"));
const postsRouter = express_1.Router();
const upload = multer_1.default(upload_1.default);
postsRouter.post('/image', upload.single('imageUrl'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = request.body;
        const createPost = new CreatePostService_1.default();
        const post = yield createPost.execute({
            title,
            description,
            user_id: request.user.id,
            imageUrl: request.file.filename,
        });
        return response.status(200).json(post);
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
}));
postsRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, imageUrl } = request.body;
        const postRepository = typeorm_1.getRepository(Post_1.default);
        const post = postRepository.create({
            title,
            description,
            user_id: request.user.id,
            imageUrl,
        });
        yield postRepository.save(post);
        return response.status(200).json(post);
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
}));
postsRouter.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postRepository = typeorm_1.getRepository(Post_1.default);
        const posts = yield postRepository.find({ relations: ["user", "comments"] });
        return response.status(200).json(posts);
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
}));
postsRouter.get('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const postRepository = typeorm_1.getRepository(Post_1.default);
    const post = yield postRepository.findOne(id);
    return response.status(200).json(post);
}));
postsRouter.put('/:id', upload.single('imageUrl'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = request.body;
    const { id } = request.params;
    const updatePost = new UpdatePostService_1.default();
    const post = yield updatePost.execute({
        id,
        title,
        description,
        imageUrl: request.file.filename,
    });
    return response.status(200).json(post);
}));
postsRouter.delete('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const postRepository = typeorm_1.getRepository(Post_1.default);
    yield postRepository.delete(id);
    return response.status(200).json();
}));
postsRouter.patch('/:id/like', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const postRepository = typeorm_1.getRepository(Post_1.default);
    const post = yield postRepository.findOneOrFail(id);
    post.like += 1;
    postRepository.save(post);
    return response.status(200).json(post);
}));
exports.default = postsRouter;
