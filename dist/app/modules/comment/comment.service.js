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
exports.CommentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const card_utils_1 = require("../card/card.utils");
const addComment = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const card = yield prisma_1.default.card.findUnique({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.cardId,
        },
    });
    if (!card)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Card not found');
    yield card_utils_1.CardUtils.checkEitherAdminOrMemberInBoard(card === null || card === void 0 ? void 0 : card.listId, user === null || user === void 0 ? void 0 : user.userId);
    const result = yield prisma_1.default.cardComment.create({
        data: payload,
    });
    return result;
});
exports.CommentService = {
    addComment,
};
