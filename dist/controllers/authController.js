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
const user_entity_1 = require("../entitys/user.entity");
const connectDatabase_1 = require("../configs/connectDatabase");
const validation_1 = require("../utils/validation");
const authUtil_1 = require("../utils/authUtil");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const token_entity_1 = require("../entitys/token.entity");
const typeorm_1 = require("typeorm");
const fs_1 = __importDefault(require("fs"));
const portfolio_entity_1 = require("../entitys/portfolio.entity");
const datacollection_entity_1 = require("../entitys/datacollection.entity");
dotenv_1.default.config();
/**POST http://localhost:8080/api/register  --> Under Test
  *  @param: {
  * "email": "example@mail.com",
  * "password": "example1234"
}
*/
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // registerValidation here
        const { error } = (0, validation_1.registerValidation)({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const userRepository = connectDatabase_1.myDataSource.getRepository(user_entity_1.User);
        const hashedPasswordValue = yield (0, authUtil_1.hashedPassword)(password);
        const newUser = userRepository.create({
            email,
            password: hashedPasswordValue,
        });
        yield userRepository.save(newUser);
        // เพิ่มข้อมูลในตาราง Portfolio
        const portfolioRepository = connectDatabase_1.myDataSource.getRepository(portfolio_entity_1.Portfolio);
        const newPortfolioEntry = portfolioRepository.create({
            user: newUser,
        });
        yield portfolioRepository.save(newPortfolioEntry);
        // เพิ่มข้อมูลในตาราง datacollectioin
        const datacollectioinRepository = connectDatabase_1.myDataSource.getRepository(datacollection_entity_1.Datacollection);
        const newDatacollectionEntry = datacollectioinRepository.create({
            user: newUser,
        });
        yield datacollectioinRepository.save(newDatacollectionEntry);
        res.status(200).json({
            success: true,
            message: 'Registration successful. Please log in.',
        });
    }
    catch (err) {
        // ตรวจสอบว่ามี email นี้ในระบบแล้วหรือไม่
        if (err.code != undefined && err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Email has already exists",
            });
        }
        else {
            res.status(500).send("Server Error");
        }
    }
});
/**POST http://localhost:8080/api/login  --> Under Test
  *  @param: {
  * "email": "example@mail.com",
  * "password": "example1234"
}
*/
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { error } = (0, validation_1.loginValidation)({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const userRepository = connectDatabase_1.myDataSource.getRepository(user_entity_1.User);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "ไม่มีผู้ใช้ในระบบนี้" });
        }
        const validPass = yield (0, authUtil_1.matchPassword)(password, user.password);
        if (!validPass || !password)
            return res
                .status(400)
                .json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "1w" });
        res.cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, //7day
        });
        const expired_at = new Date();
        expired_at.setDate(expired_at.getDate() + 7);
        yield connectDatabase_1.myDataSource.getRepository(token_entity_1.Token).save({
            user_id: user.id,
            token: refreshToken,
            expired_at,
        });
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: "3h" });
        res.send({
            token,
        });
    }
    catch (err) {
        return res.status(500).send("Server Error");
    }
});
/**POST http://localhost:8080/api/logout  --> Under Test*/
exports.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies['refreshToken'];
    yield connectDatabase_1.myDataSource.getRepository(token_entity_1.Token).delete({ token: refreshToken });
    res.cookie('refreshToken', '', { maxAge: 0 });
    res.send({
        success: true,
        message: "Success",
    });
});
/**GET http://localhost:8080/api/authenticate&&getuserData  --> Under Test*/
exports.authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const accessToken = authorizationHeader.split(" ")[1];
        try {
            const verifyToken = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
            if (!verifyToken) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthenticated",
                });
            }
            const user = yield connectDatabase_1.myDataSource
                .getRepository(user_entity_1.User)
                .findOne({ where: { id: verifyToken.id } });
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthenticated",
                });
            }
            const { password } = user, data = __rest(user, ["password"]);
            return res.send(data);
        }
        catch (err) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
    }
    catch (err) {
        console.error("Error:", err);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
});
/**POST http://localhost:8080/api/refreshToken  --> Under Test*/
exports.refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies['refreshToken'];
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        if (!payload) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const tokenStore = yield connectDatabase_1.myDataSource.getRepository(token_entity_1.Token).findOne({
            where: {
                user_id: payload.id,
                expired_at: (0, typeorm_1.MoreThanOrEqual)(new Date()),
            },
        });
        if (!tokenStore) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: payload.id,
        }, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: "3h" });
        res.send({
            token,
        });
    }
    catch (err) {
        return res.status(401).send({
            success: false,
            message: "Unauthenticated",
        });
    }
});
/**PUT http://localhost:8080/api/updateUser  --> Under Test
  * @param: {
  * "id": "<userid>"
  * }
  * body: {
  * firstNameTH: '',
  * lastNameTH: '',
  * firstNameEN: '',
  * lastNameEN: '',
  * phone: '',
  * line: '',
  * address: '',
}
*/
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const user = yield connectDatabase_1.myDataSource
            .getRepository(user_entity_1.User)
            .findOne({ where: { id: userId } });
        if (!user) {
            return res.send(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        //if user has pass authenticated
        if (req.file) {
            if (user.profileImage && user.profileImage !== 'noimage.jpg') { // เพิ่มเงื่อนไขในการตรวจสอบว่าไม่ใช่ 'noimage.jpg'
                try {
                    fs_1.default.unlink('dist/uploads/' + user.profileImage, (err) => {
                        if (err) {
                            console.log('Error deleting old profile image:', err);
                        }
                        else {
                            console.log('Old profile image deleted');
                        }
                    });
                }
                catch (err) {
                    console.error('Error deleting old profile image:', err);
                }
            }
            user.profileImage = req.file.filename;
        }
        const { firstNameTH, lastNameTH, firstNameEN, lastNameEN, phone, line, address, } = req.body;
        user.firstNameTH = firstNameTH;
        user.lastNameTH = lastNameTH;
        user.firstNameEN = firstNameEN;
        user.lastNameEN = lastNameEN;
        user.phone = phone;
        user.line = line;
        user.address = address;
        yield connectDatabase_1.myDataSource.getRepository(user_entity_1.User).save(user);
        return res.status(200).send({
            success: true,
            message: "Record update success",
            user: user,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Server error",
        });
    }
});
/**GET http://localhost:8080/api/verifyOTP  --> Under Test  */
exports.verifyOTPHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    const otpFromLocal = parseInt(req.app.locals.OTP);
    if (!otpFromLocal) {
        return res.status(400).json({
            error: "OTP has not been generated. Please generate OTP first.",
        });
    }
    const enteredOTP = parseInt(code);
    if (enteredOTP === otpFromLocal) {
        req.app.locals.OTP = null; //reset the OTP value
        req.app.locals.resetSession = true; // start cookies for reset password
        return res.status(201).send({
            message: "Verify Success",
        });
    }
    return res.status(400).send({
        error: "Invalid OTP",
    });
});
//successfully redirect user when OTP is valid
/**GET http://localhost:8080/api/createResetSession  --> Under Test */
exports.createResetSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false; // allow accees to this route only once
        return res.status(201).send({ msg: "Access granted!" });
    }
    return res.status(404).send({ error: "Session has expired!" });
});
//update the password when we have valid session
/**GET http://localhost:8080/api/resetPassword  --> Under Test */
exports.resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.app.locals.resetSession)
            return res.status(404).send({ error: "Session has expired!" });
        const { email, password } = req.body;
        // Find the user by email
        const userRepository = connectDatabase_1.myDataSource.getRepository(user_entity_1.User);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        //Check if the new password is the same as the old password
        const isSamePassword = yield (0, authUtil_1.matchPassword)(password, user.password);
        if (isSamePassword) {
            return res.status(404).json({ error: "New password must be different from the old password" });
        }
        // Hash the new password
        const hashedPass = yield (0, authUtil_1.hashedPassword)(password);
        if (!hashedPass) {
            return res.status(404).json({ error: "Enable to hashed password" });
        }
        // Update the user's password
        yield userRepository.update({ email: user.email }, { password: hashedPass });
        return res.status(201).json({ msg: "Reset password success" });
    }
    catch (err) {
        return res.status(401).send({ err });
    }
});
