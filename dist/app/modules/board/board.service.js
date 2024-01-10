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
exports.BoardService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const board_utils_1 = require("./board.utils");
const insertIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkAdminExistInWorkspace(user === null || user === void 0 ? void 0 : user.userId, payload === null || payload === void 0 ? void 0 : payload.workspaceId);
    payload.admin = user === null || user === void 0 ? void 0 : user.userId;
    const result = yield prisma_1.default.board.create({
        data: payload,
    });
    return result;
});
const addBoardMembers = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
        const members = (_a = payload === null || payload === void 0 ? void 0 : payload.members) === null || _a === void 0 ? void 0 : _a.filter((member) => member !== (user === null || user === void 0 ? void 0 : user.userId));
        console.log({ members });
        for (let index = 0; index < members.length; index++) {
            const result = yield prisma_1.default.boardMember.create({
                data: {
                    boardId: id,
                    userId: members[index],
                },
            });
            console.log({ result });
        }
        return payload;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already Added');
    }
});
const removeBoardMember = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkAdminExistInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
    yield prisma_1.default.boardMember.deleteMany({
        where: {
            boardId: id,
            userId: payload.memberId,
        },
    });
    return payload;
});
const getAllBoardsOfMember = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.boardMember.findMany({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.userId,
        },
        include: {
            board: {
                include: {
                    workspace: true,
                },
            },
        },
    });
    return result;
});
const getSingleData = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.board.findUnique({
        where: {
            id,
        },
        include: {
            workspace: {
                include: {
                    Boards: {
                        include: {
                            template: true,
                        },
                    },
                },
            },
            BoardMembers: {
                include: {
                    user: true,
                },
            },
            user: true,
            template: true,
        },
    });
    return result;
});
const updateBoardTitle = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkAdminExistInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.board.update({
        where: {
            id,
        },
        data: { title: payload === null || payload === void 0 ? void 0 : payload.title },
    });
    return result;
});
exports.BoardService = {
    insertIntoDB,
    addBoardMembers,
    removeBoardMember,
    getAllBoardsOfMember,
    getSingleData,
    updateBoardTitle,
};
