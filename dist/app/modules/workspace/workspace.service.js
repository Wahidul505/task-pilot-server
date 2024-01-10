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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const workspace_utils_1 = require("./workspace.utils");
const insertIntoDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { admins } = payload, workspacePayload = __rest(payload, ["admins"]);
    const newAdmins = admins.find(admin => admin !== (user === null || user === void 0 ? void 0 : user.userId))
        ? [...admins, user === null || user === void 0 ? void 0 : user.userId]
        : [...admins];
    try {
        yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const newWorkspace = yield transactionClient.workspace.create({
                data: workspacePayload,
            });
            if (!newWorkspace) {
                throw new ApiError_1.default(http_status_1.default.BAD_GATEWAY, 'Something went wrong');
            }
            for (let index = 0; index < newAdmins.length; index++) {
                yield transactionClient.workspaceAdmin.create({
                    data: {
                        userId: newAdmins[index],
                        workspaceId: newWorkspace.id,
                    },
                });
            }
        }));
        return payload;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong');
    }
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.workspace.findMany({
        include: {
            WorkspaceAdmins: true,
        },
    });
    return result;
});
const getSingleFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield workspace_utils_1.WorkspaceUtils.checkAdminExistInWorkspace(user === null || user === void 0 ? void 0 : user.userId, id);
    const result = yield prisma_1.default.workspace.findUnique({
        where: {
            id,
        },
        include: {
            Boards: {
                include: {
                    template: true,
                },
            },
            WorkspaceAdmins: {
                include: {
                    user: true,
                },
            },
        },
    });
    return result;
});
const getAllWorkspacesOfAdmin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.workspaceAdmin.findMany({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.userId,
        },
        include: {
            workspace: true,
        },
    });
    return result;
});
const updateSingleData = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield workspace_utils_1.WorkspaceUtils.checkAdminExistInWorkspace(user === null || user === void 0 ? void 0 : user.userId, id);
    const result = yield prisma_1.default.workspace.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const addWorkspaceAdmins = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield workspace_utils_1.WorkspaceUtils.checkAdminExistInWorkspace(user === null || user === void 0 ? void 0 : user.userId, id);
        const admins = (_a = payload === null || payload === void 0 ? void 0 : payload.admins) === null || _a === void 0 ? void 0 : _a.filter((admin) => admin !== (user === null || user === void 0 ? void 0 : user.userId));
        for (let index = 0; index < admins.length; index++) {
            const result = yield prisma_1.default.workspaceAdmin.create({
                data: {
                    workspaceId: id,
                    userId: admins[index],
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
const removeWorkspaceAdmin = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    yield workspace_utils_1.WorkspaceUtils.checkAdminExistInWorkspace(user === null || user === void 0 ? void 0 : user.userId, id);
    yield prisma_1.default.workspaceAdmin.deleteMany({
        where: {
            workspaceId: id,
            userId: payload.adminId,
        },
    });
    return payload;
});
exports.WorkspaceService = {
    insertIntoDB,
    getAllFromDB,
    getSingleFromDB,
    getAllWorkspacesOfAdmin,
    updateSingleData,
    addWorkspaceAdmins,
    removeWorkspaceAdmin,
};
