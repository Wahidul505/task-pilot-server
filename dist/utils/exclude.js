"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
const exclude = (object, keys) => {
    return Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));
};
exports.exclude = exclude;
