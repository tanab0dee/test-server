"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = exports.loginValidation = void 0;
// LoginValidation.ts
const joi_1 = __importDefault(require("joi"));
const loginValidation = (data) => {
    const entity_user = joi_1.default.object({
        email: joi_1.default.string().min(6).required().email().messages({
            "string.email": `รูปแบบ E-mail ไม่ถูกต้อง`,
            "string.empty": `E-mail ไม่สามารถเป็นค่าว่างได้`,
            "string.min": `E-mail ต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่ E-mail`,
        }),
        password: joi_1.default.string().min(6).required().messages({
            "string.empty": `รหัสผ่านไม่สามารถเป็นค่าว่างได้`,
            "string.min": `รหัสผ่านต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่รหัสผ่าน`,
        }),
    });
    return entity_user.validate(data);
};
exports.loginValidation = loginValidation;
const registerValidation = (data) => {
    const entity_user = joi_1.default.object({
        email: joi_1.default.string().min(6).required().email().messages({
            "string.email": `รูปแบบ E-mail ไม่ถูกต้อง`,
            "string.empty": `E-mail ไม่สามารถเป็นค่าว่างได้`,
            "string.min": `E-mail ต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่ E-mail`,
        }),
        password: joi_1.default.string().min(6).required().messages({
            "string.empty": `รหัสผ่านไม่สามารถเป็นค่าว่างได้`,
            "string.min": `รหัสผ่านต้องไม่ต่ำกว่า {#limit} ตัวอักษร`,
            "any.required": `จำเป็นต้องใส่รหัสผ่าน`,
        }),
    });
    return entity_user.validate(data);
};
exports.registerValidation = registerValidation;
