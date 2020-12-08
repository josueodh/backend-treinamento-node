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
const bcryptjs_1 = require("bcryptjs");
const User_1 = __importDefault(require("../models/User"));
class CreateUserService {
    execute({ name, email, password, avatar }) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersReposity = typeorm_1.getRepository(User_1.default);
            const checkUserExists = yield usersReposity.findOne({
                where: { email },
            });
            if (checkUserExists) {
                throw new Error('E-mail address already used by another person');
            }
            const hashedPassword = yield bcryptjs_1.hash(password, 8);
            const user = usersReposity.create({
                name,
                email,
                password: hashedPassword,
                avatar
            });
            yield usersReposity.save(user);
            return user;
        });
    }
}
exports.default = CreateUserService;
