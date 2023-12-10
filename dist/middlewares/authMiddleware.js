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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDatabase_1 = require("../configs/connectDatabase");
const user_entity_1 = require("../entitys/user.entity");
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
exports.verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.method == "GET" ? req.query : req.body;
        const exists = yield connectDatabase_1.myDataSource.getRepository(user_entity_1.User).findOne({ where: { email } });
        if (!exists)
            return res.status(404).send({ error: "Can't find User!" });
        next();
    }
    catch (err) {
        return res.status(404).send({ error: "Authentocation Error" });
    }
});
exports.requireAuth = (req, res, next) => {
    const token = req.cookies['refreshToken'];
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
            }
            else {
                // console.log(decodedToken);
                next();
            }
        });
    }
    else {
        return res.status(401).send({
            success: false,
            message: "กรุณาเข้าสู่ระบบ"
        });
        next();
    }
};
exports.localVariables = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    };
    next();
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/dist/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profileImage-' + uniqueSuffix + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // ตรวจสอบว่าไฟล์ที่อัปโหลดเป็นรูปภาพหรือไม่
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
exports.upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter }).single('file');
