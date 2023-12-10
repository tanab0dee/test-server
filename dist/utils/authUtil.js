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
exports.findInformationByDatacollectionId = exports.findDatacollectionByUserId = exports.getUserIdFromRefreshToken = exports.generateOTP = exports.matchPassword = exports.hashedPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const information_entity_1 = require("../entitys/information.entity");
const datacollection_entity_1 = require("../entitys/datacollection.entity");
const connectDatabase_1 = require("../configs/connectDatabase");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    const newPassword = yield bcryptjs_1.default.hash(password, salt);
    return newPassword;
});
exports.hashedPassword = hashedPassword;
const matchPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(password, hashedPassword);
});
exports.matchPassword = matchPassword;
const generateOTP = () => {
    return otp_generator_1.default.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
};
exports.generateOTP = generateOTP;
const getUserIdFromRefreshToken = function (req) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.cookies["refreshToken"];
        const verifyToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        return verifyToken ? verifyToken.id : null;
    });
};
exports.getUserIdFromRefreshToken = getUserIdFromRefreshToken;
const findDatacollectionByUserId = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield connectDatabase_1.myDataSource
            .getRepository(datacollection_entity_1.Datacollection)
            .findOne({ where: { user: { id: userId } } });
    });
};
exports.findDatacollectionByUserId = findDatacollectionByUserId;
const findInformationByDatacollectionId = function (datacollectionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const datacollectionIdNumber = parseInt(datacollectionId, 10); // แปลงเป็น number
        return yield connectDatabase_1.myDataSource
            .getRepository(information_entity_1.Information)
            .find({
            where: { datacollection: { id: datacollectionIdNumber } },
            relations: ['description'],
        });
    });
};
exports.findInformationByDatacollectionId = findInformationByDatacollectionId;
