"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = void 0;
const uuid_1 = require("uuid");
// const { v4: uuidv4 } = require('uuid');
function generateUUID() {
    return (0, uuid_1.v4)();
}
exports.generateUUID = generateUUID;
