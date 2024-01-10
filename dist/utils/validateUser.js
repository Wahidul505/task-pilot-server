"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const validateUser = (user, userId) => {
    if ((user === null || user === void 0 ? void 0 : user.userId) !== userId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not allowed');
    }
};
exports.validateUser = validateUser;
