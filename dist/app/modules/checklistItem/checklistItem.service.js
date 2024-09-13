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
exports.ChecklistItemService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const checklistItem_utils_1 = require("./checklistItem.utils");
const createChecklistItem = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield checklistItem_utils_1.ChecklistItemUtils.checkEitherAdminOrMemberInBoard(payload === null || payload === void 0 ? void 0 : payload.checklistId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.checklistItem.create({
        data: payload,
    });
    return result;
});
const updateSingleChecklistItem = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const checklist = yield prisma_1.default.checklistItem.findUnique({
        where: {
            id,
        },
    });
    if (!checklist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Checklist not found');
    yield checklistItem_utils_1.ChecklistItemUtils.checkEitherAdminOrMemberInBoard(checklist === null || checklist === void 0 ? void 0 : checklist.checklistId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.checklistItem.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteSingleChecklistItem = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const checklist = yield prisma_1.default.checklistItem.findUnique({
        where: {
            id,
        },
    });
    if (!checklist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Checklist not found');
    yield checklistItem_utils_1.ChecklistItemUtils.checkEitherAdminOrMemberInBoard(checklist === null || checklist === void 0 ? void 0 : checklist.checklistId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.checklistItem.delete({
        where: {
            id,
        },
    });
    return result;
});
const getAllChecklistItems = (checklistId, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user is either an admin or a member of the board
    yield checklistItem_utils_1.ChecklistItemUtils.checkEitherAdminOrMemberInBoard(checklistId, user === null || user === void 0 ? void 0 : user.userId);
    // Retrieve all checklist items for the given checklist ID
    const checklistItems = yield prisma_1.default.checklistItem.findMany({
        where: {
            checklistId: checklistId,
        },
    });
    // Return the retrieved checklist items
    return checklistItems;
});
exports.ChecklistItemService = {
    createChecklistItem,
    updateSingleChecklistItem,
    deleteSingleChecklistItem,
    getAllChecklistItems,
};
