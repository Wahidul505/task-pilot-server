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
        for (let index = 0; index < members.length; index++) {
            yield prisma_1.default.boardMember.create({
                data: {
                    boardId: id,
                    userId: members[index],
                },
            });
        }
        return payload;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already Added');
    }
});
const removeBoardMember = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield board_utils_1.BoardUtils.checkAdminExistInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove the board member from all cards within the board
        yield prisma.cardMember.deleteMany({
            where: {
                userId: payload.memberId,
                card: {
                    list: {
                        boardId: id,
                    },
                },
            },
        });
        // Remove the board member from the board
        yield prisma.boardMember.deleteMany({
            where: {
                boardId: id,
                userId: payload.memberId,
            },
        });
        return payload;
    }));
    return result;
});
const leaveBoard = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ id });
    console.log({ user: user === null || user === void 0 ? void 0 : user.userId });
    yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
    yield prisma_1.default.boardMember.deleteMany({
        where: {
            boardId: id,
            userId: user === null || user === void 0 ? void 0 : user.userId,
        },
    });
    return user;
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
const getAllBoardsOfSingleWorkspace = (workspaceId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.board.findMany({
        where: {
            workspaceId,
            OR: [
                {
                    BoardMembers: {
                        some: {
                            userId: user === null || user === void 0 ? void 0 : user.userId,
                        },
                    },
                },
                {
                    admin: user === null || user === void 0 ? void 0 : user.userId,
                },
            ],
        },
        include: {
            template: true,
            workspace: {
                include: {
                    WorkspaceAdmins: {
                        include: {
                            user: true,
                        },
                    },
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
            Lists: true,
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
const deleteSingleBoard = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is an admin of the board
    yield board_utils_1.BoardUtils.checkAdminExistInBoard(id, user === null || user === void 0 ? void 0 : user.userId);
    try {
        // Start a transaction to ensure all deletions happen atomically
        const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete related CardMembers
            yield prisma.cardMember.deleteMany({
                where: {
                    card: {
                        list: {
                            boardId: id,
                        },
                    },
                },
            });
            // Delete related CardComments
            yield prisma.cardComment.deleteMany({
                where: {
                    card: {
                        list: {
                            boardId: id,
                        },
                    },
                },
            });
            // Delete related ChecklistItems
            yield prisma.checklistItem.deleteMany({
                where: {
                    checklist: {
                        card: {
                            list: {
                                boardId: id,
                            },
                        },
                    },
                },
            });
            // Delete related Checklists
            yield prisma.checklist.deleteMany({
                where: {
                    card: {
                        list: {
                            boardId: id,
                        },
                    },
                },
            });
            // Delete related Cards
            yield prisma.card.deleteMany({
                where: {
                    list: {
                        boardId: id,
                    },
                },
            });
            // Delete related Lists
            yield prisma.list.deleteMany({
                where: {
                    boardId: id,
                },
            });
            // Delete related BoardMembers
            yield prisma.boardMember.deleteMany({
                where: {
                    boardId: id,
                },
            });
            // Finally, delete the Board itself
            const deletedBoard = yield prisma.board.delete({
                where: {
                    id: id,
                },
            });
            return deletedBoard;
        }));
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete board');
    }
});
exports.BoardService = {
    insertIntoDB,
    addBoardMembers,
    removeBoardMember,
    leaveBoard,
    getAllBoardsOfMember,
    getSingleData,
    updateBoardTitle,
    getAllBoardsOfSingleWorkspace,
    deleteSingleBoard,
};
