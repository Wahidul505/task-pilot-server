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
exports.CardService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const board_utils_1 = require("../board/board.utils");
const card_utils_1 = require("./card.utils");
const createCard = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield card_utils_1.CardUtils.checkEitherAdminOrMemberInBoard(payload === null || payload === void 0 ? void 0 : payload.listId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.card.create({
        data: payload,
    });
    return result;
});
const getAllCards = (listId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.card.findMany({
        where: {
            listId,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
    return result;
});
const updateListId = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield card_utils_1.CardUtils.checkEitherAdminOrMemberInBoard(payload === null || payload === void 0 ? void 0 : payload.listId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.card.update({
        where: {
            id,
        },
        data: { listId: payload === null || payload === void 0 ? void 0 : payload.listId },
    });
    return result;
});
const addCardMember = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const board = yield prisma_1.default.card.findUnique({
            where: {
                id,
            },
            include: {
                list: true,
            },
        });
        if (!board)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Board is not found');
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard((_a = board === null || board === void 0 ? void 0 : board.list) === null || _a === void 0 ? void 0 : _a.boardId, user === null || user === void 0 ? void 0 : user.userId);
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard((_b = board === null || board === void 0 ? void 0 : board.list) === null || _b === void 0 ? void 0 : _b.boardId, payload === null || payload === void 0 ? void 0 : payload.memberId);
        yield prisma_1.default.cardMember.create({
            data: {
                cardId: id,
                userId: payload === null || payload === void 0 ? void 0 : payload.memberId,
            },
        });
        return payload;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already Added');
    }
});
const removeCardMember = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const board = yield prisma_1.default.card.findUnique({
            where: {
                id,
            },
            include: {
                list: true,
            },
        });
        if (!board)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Board is not found');
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard((_c = board === null || board === void 0 ? void 0 : board.list) === null || _c === void 0 ? void 0 : _c.boardId, user === null || user === void 0 ? void 0 : user.userId);
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard((_d = board === null || board === void 0 ? void 0 : board.list) === null || _d === void 0 ? void 0 : _d.boardId, payload === null || payload === void 0 ? void 0 : payload.memberId);
        yield prisma_1.default.cardMember.deleteMany({
            where: {
                cardId: id,
                userId: payload === null || payload === void 0 ? void 0 : payload.memberId,
            },
        });
        return payload;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already removed');
    }
});
const updateSingleCard = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const board = yield prisma_1.default.card.findUnique({
            where: {
                id,
            },
            include: {
                list: true,
            },
        });
        if (!board)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Board is not found');
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard((_e = board === null || board === void 0 ? void 0 : board.list) === null || _e === void 0 ? void 0 : _e.boardId, user === null || user === void 0 ? void 0 : user.userId);
        const result = yield prisma_1.default.card.update({
            where: {
                id,
            },
            data: payload,
        });
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something Went Wrong');
    }
});
const removeSingleCard = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const board = yield prisma_1.default.card.findUnique({
            where: {
                id,
            },
            include: {
                list: true,
            },
        });
        if (!board)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Board is not found');
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard((_f = board === null || board === void 0 ? void 0 : board.list) === null || _f === void 0 ? void 0 : _f.boardId, user === null || user === void 0 ? void 0 : user.userId);
        yield prisma_1.default.checklist.deleteMany({
            where: {
                cardId: id,
            },
        });
        yield prisma_1.default.cardMember.deleteMany({
            where: {
                cardId: id,
            },
        });
        yield prisma_1.default.cardComment.deleteMany({
            where: {
                cardId: id,
            },
        });
        const result = yield prisma_1.default.card.delete({
            where: {
                id,
            },
        });
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something Went Wronggg');
    }
});
exports.CardService = {
    createCard,
    getAllCards,
    updateListId,
    addCardMember,
    removeCardMember,
    updateSingleCard,
    removeSingleCard,
};
