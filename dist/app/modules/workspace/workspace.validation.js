"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeoverServiceValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        description: zod_1.z.string().optional(),
        admins: zod_1.z
            .array(zod_1.z.string({
            required_error: 'admin is required',
        }))
            .optional(),
    }),
});
exports.MakeoverServiceValidation = {
    create,
};
