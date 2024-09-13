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
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
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
    // Find the list to ensure it exists and retrieve related data
    const list = yield prisma_1.default.list.findUnique({
        where: { id },
        include: {
            board: true,
            Cards: {
                include: {
                    Checklists: {
                        include: {
                            ChecklistItems: true,
                        },
                    },
                    CardMembers: true,
                    CardComments: true,
                },
            },
        },
    });
    if (!list)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'List not found');
    // Check if the user is either an admin or a member of the board
    yield board_utils_1.BoardUtils.checkEitherAdminOrMemberInBoard(list.boardId, user === null || user === void 0 ? void 0 : user.userId);
    // Start a transaction to delete the list and its dependencies atomically
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete checklist items
        for (const card of list.Cards) {
            for (const checklist of card.Checklists) {
                yield prisma.checklistItem.deleteMany({
                    where: { checklistId: checklist.id },
                });
            }
        }
        // Delete checklists
        for (const card of list.Cards) {
            yield prisma.checklist.deleteMany({
                where: { cardId: card.id },
            });
        }
        // Delete card members
        for (const card of list.Cards) {
            yield prisma.cardMember.deleteMany({
                where: { cardId: card.id },
            });
        }
        // Delete card comments
        for (const card of list.Cards) {
            yield prisma.cardComment.deleteMany({
                where: { cardId: card.id },
            });
        }
        // Delete cards
        yield prisma.card.deleteMany({
            where: { listId: id },
        });
        // Finally, delete the list itself
        const deletedList = yield prisma.list.delete({
            where: { id },
        });
        return deletedList;
    }));
    return result;
});
exports.ListService = {
    createList,
    getSingleList,
    getAllLists,
    updateListTitle,
    deleteSingleList,
};
