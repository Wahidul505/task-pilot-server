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
exports.ListService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const board_utils_1 = require("../board/board.utils");
const createList = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(payload === null || payload === void 0 ? void 0 : payload.boardId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.list.create({
        data: payload,
    });
    return result;
});
const getAllLists = (boardId, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(boardId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.list.findMany({
        where: {
            boardId: boardId,
        },
        include: {
            Cards: {
                include: {
                    list: {
                        include: {
                            board: {
                                include: {
                                    BoardMembers: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    CardMembers: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    return result;
});
const getSingleList = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.list.findUnique({
        where: {
            id,
        },
    });
    if (result)
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(result === null || result === void 0 ? void 0 : result.boardId, user === null || user === void 0 ? void 0 : user.userId);
    return result;
});
const updateListTitle = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(payload === null || payload === void 0 ? void 0 : payload.boardId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.list.update({
        where: {
            id,
        },
        data: { title: payload === null || payload === void 0 ? void 0 : payload.title },
    });
    return result;
});
const deleteSingleList = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.list.delete({
        where: {
            id,
            board: {
                admin: user === null || user === void 0 ? void 0 : user.userId,
            },
        },
    });
    return result;
});
exports.ListService = {
    createList,
    getSingleList,
    getAllLists,
    updateListTitle,
    deleteSingleList,
};
