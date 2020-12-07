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
const AuthenticateUserService_1 = __importDefault(require("../services/AuthenticateUserService"));
const sessionsRouter = express_1.Router();
sessionsRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        const authenticateUser = new AuthenticateUserService_1.default();
        const { user, token } = yield authenticateUser.execute({
            email,
            password
        });
        const newUser = {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
        };
        return response.status(200).json({ newUser, token });
    }
    catch (err) {
        return response.status(400).json({ error: err.message });
    }
}));
exports.default = sessionsRouter;
