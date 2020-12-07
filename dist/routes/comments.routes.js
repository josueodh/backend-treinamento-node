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
const Comment_1 = __importDefault(require("../models/Comment"));
const commentsRouter = express_1.Router();
commentsRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id, text } = request.body;
    const commentRepository = typeorm_1.getRepository(Comment_1.default);
    const comment = commentRepository.create({
        post_id,
        text,
        user_id: request.user.id
    });
    yield commentRepository.save(comment);
    return response.status(200).json(comment);
}));
commentsRouter.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const commentRepository = typeorm_1.getRepository(Comment_1.default);
    const comments = yield commentRepository.find();
    return response.status(200).json(comments);
}));
commentsRouter.put('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = request.body;
    const { id } = request.params;
    const commentRepository = typeorm_1.getRepository(Comment_1.default);
    const comment = yield commentRepository.findOneOrFail(id);
    if (comment.text) {
        comment.text = text;
        commentRepository.save(comment);
    }
    return response.status(200).json(comment);
}));
commentsRouter.delete('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const commentRepository = typeorm_1.getRepository(Comment_1.default);
    commentRepository.delete(id);
    return response.status(200).json();
}));
exports.default = commentsRouter;
