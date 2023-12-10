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
exports.registerMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
const authUtil_1 = require("../utils/authUtil");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "sfiav8.profile@gmail.com",
        pass: "xwdwlrgriraifzqo"
    }
});
const mailGenerator = new mailgen_1.default({
    theme: "default",
    product: {
        name: "SFIAv8 Competency Profile System",
        link: 'https://mailgen.js/'
    }
});
const registerMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, text, subject } = req.body;
    var userEmail = {
        body: {
            name: email,
            info: text || 'Welcome to Daily Tution! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to email, we\'d loveto help.'
        }
    };
    var emailBody = mailGenerator.generate(userEmail);
    let message = {
        from: 'sfiav8.profile@gmail.com',
        to: email,
        subject: subject || "Signup Successful",
        html: emailBody
    };
    //send mail
    transporter.sendMail(message)
        .then(() => {
        return res.status(200).send({ msg: "You should receive an email from us." });
    })
        .catch(error => res.status(500).send({ error }));
});
exports.registerMail = registerMail;
exports.generateOTPHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email; // อ่านค่า email จาก query parameter
        const OTP = (0, authUtil_1.generateOTP)();
        req.app.locals.OTP = OTP;
        // ส่งอีเมล
        const mailOptions = {
            from: 'sfiav8.profile@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is: ${OTP}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP email. An internal server error occurred.'
                });
            }
            else {
                console.log('Email sent: ' + info.response);
                res.status(201).json({ code: OTP });
            }
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate OTP. An internal server error occurred.'
        });
    }
});
