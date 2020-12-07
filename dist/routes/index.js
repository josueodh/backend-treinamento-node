"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users.routes"));
const sessions_routes_1 = __importDefault(require("./sessions.routes"));
const posts_routes_1 = __importDefault(require("./posts.routes"));
const comments_routes_1 = __importDefault(require("./comments.routes"));
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const routes = express_1.Router();
routes.use('/users', users_routes_1.default);
routes.use('/sessions', ensureAuthenticated_1.default, sessions_routes_1.default);
routes.use('/posts', ensureAuthenticated_1.default, posts_routes_1.default);
routes.use('/comments', ensureAuthenticated_1.default, comments_routes_1.default);
exports.default = routes;
