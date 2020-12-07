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
const User_1 = __importDefault(require("../models/User"));
class UpdateUserService {
    execute({ id, name, avatar }) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersReposity = typeorm_1.getRepository(User_1.default);
            const user = yield usersReposity.findOneOrFail(id);
            if (name) {
                user.name = name;
            }
            if (avatar) {
                if (user.avatar) {
                    const userImageFilePath = path_1.default.join(upload_1.default.directory, user.avatar);
                    try {
                        const postImageFileExists = fs_1.default.promises.stat(userImageFilePath);
                        if (postImageFileExists) {
                            yield fs_1.default.promises.unlink(userImageFilePath);
                        }
                    }
                    catch (err) {
                        throw new Error('Error to remove the file');
                    }
                }
                user.avatar = avatar;
            }
            yield usersReposity.save(user);
            return user;
        });
    }
}
exports.default = UpdateUserService;
