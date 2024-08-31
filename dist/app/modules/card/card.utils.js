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
exports.CardUtils = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const board_utils_1 = require("../board/board.utils");
const checkEitherAdminOrMemberInBoard = (listId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield prisma_1.default.list.findUnique({
        where: {
            id: listId,
        },
    });
    if (list) {
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(list === null || list === void 0 ? void 0 : list.boardId, userId);
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "List doesn't exist");
    }
});
exports.CardUtils = {
    checkEitherAdminOrMemberInBoard,
};
