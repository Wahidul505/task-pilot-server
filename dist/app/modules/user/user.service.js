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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const exclude_1 = require("../../../utils/exclude");
const validateUser_1 = require("../../../utils/validateUser");
const getSingleData = (userId, user) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validateUser_1.validateUser)(user, userId);
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    // eslint-disable-next-line no-unused-vars
    const { password } = result, userInfo = __rest(result, ["password"]);
    return userInfo;
});
const updateSingleData = (userId, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validateUser_1.validateUser)(user, userId);
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist');
    }
    const updateSingleData = {
        name: payload.name || isUserExist.name,
        dp: payload.dp || isUserExist.dp,
    };
    yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: updateSingleData,
    });
    return updateSingleData;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany();
    const result = users === null || users === void 0 ? void 0 : users.map(user => (0, exclude_1.exclude)(user, ['password']));
    return result;
});
exports.UserService = {
    getSingleData,
    updateSingleData,
    getAllFromDB,
};
