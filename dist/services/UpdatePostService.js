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
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const upload_1 = __importDefault(require("../config/upload"));
const Post_1 = __importDefault(require("../models/Post"));
class UpdateUserService {
    execute({ id, title, description, imageUrl }) {
        return __awaiter(this, void 0, void 0, function* () {
            const postRepository = typeorm_1.getRepository(Post_1.default);
            const post = yield postRepository.findOneOrFail(id);
            if (!post) {
                throw new Error("Can't find this post.");
            }
            if (post.imageUrl) {
                const postImageFilePath = path_1.default.join(upload_1.default.directory, post.imageUrl);
                try {
                    const postImageFileExists = fs_1.default.promises.stat(postImageFilePath);
                    if (postImageFileExists) {
                        yield fs_1.default.promises.unlink(postImageFilePath);
                    }
                }
                catch (err) {
                    throw new Error('Error to remove the file');
                }
            }
            post.title = title;
            post.description = description;
            post.imageUrl = imageUrl;
            yield postRepository.save(post);
            return post;
        });
    }
}
exports.default = UpdateUserService;
