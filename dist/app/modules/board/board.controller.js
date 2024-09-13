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
exports.BoardController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const board_service_1 = require("./board.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield board_service_1.BoardService.insertIntoDB(req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Board created',
        data: result,
    });
}));
const addBoardMembers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield board_service_1.BoardService.addBoardMembers(req.params.id, req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Members added',
        data: result,
    });
}));
const removeBoardMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield board_service_1.BoardService.removeBoardMember(req.params.id, req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Member removed',
        data: result,
    });
}));
const leaveBoard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield board_service_1.BoardService.leaveBoard(req.params.id, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'You left from the board',
        data: result,
    });
}));
const getAllBoardsOfMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield board_service_1.BoardService.getAllBoardsOfMember(req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Fetched Boards',
        data: result,
    });
}));
const getAllBoardsOfSingleWorkspace = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield board_service_1.BoardService.getAllBoardsOfSingleWorkspace((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.workspaceId, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Fetched Boards',
        data: result,
    });
}));
const getSingleData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield board_service_1.BoardService.getSingleData((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Board Fetched',
        data: result,
    });
}));
const updateBoardTitle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const result = yield board_service_1.BoardService.updateBoardTitle((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id, req === null || req === void 0 ? void 0 : req.body, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Board updated',
        data: result,
    });
}));
const deleteSingleBoard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const result = yield board_service_1.BoardService.deleteSingleBoard((_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id, req === null || req === void 0 ? void 0 : req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Board deleted',
        data: result,
    });
}));
exports.BoardController = {
    insertIntoDB,
    addBoardMembers,
    removeBoardMember,
    leaveBoard,
    getAllBoardsOfMember,
    getAllBoardsOfSingleWorkspace,
    getSingleData,
    updateBoardTitle,
    deleteSingleBoard,
};
