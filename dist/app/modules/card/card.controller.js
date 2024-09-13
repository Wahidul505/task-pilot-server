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
exports.CardController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const card_service_1 = require("./card.service");
const createCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield card_service_1.CardService.createCard(req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Card created',
        data: result,
    });
}));
const getAllCards = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield card_service_1.CardService.getAllCards((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cards fetched',
        data: result,
    });
}));
const updateListId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield card_service_1.CardService.updateListId((_b = req.params) === null || _b === void 0 ? void 0 : _b.id, req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'List ID Updated',
        data: result,
    });
}));
const addCardMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const result = yield card_service_1.CardService.addCardMember((_c = req.params) === null || _c === void 0 ? void 0 : _c.id, req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Card member added',
        data: result,
    });
}));
const removeCardMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const result = yield card_service_1.CardService.removeCardMember((_d = req.params) === null || _d === void 0 ? void 0 : _d.id, req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Card member removed',
        data: result,
    });
}));
const updateSingleCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const result = yield card_service_1.CardService.updateSingleCard((_e = req.params) === null || _e === void 0 ? void 0 : _e.id, req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Card Updated',
        data: result,
    });
}));
const removeSingleCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const result = yield card_service_1.CardService.removeSingleCard((_f = req.params) === null || _f === void 0 ? void 0 : _f.id, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Card Deleted',
        data: result,
    });
}));
exports.CardController = {
    createCard,
    getAllCards,
    updateListId,
    addCardMember,
    removeCardMember,
    updateSingleCard,
    removeSingleCard,
};
