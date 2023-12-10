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
Object.defineProperty(exports, "__esModule", { value: true });
const connectDatabase_1 = require("../configs/connectDatabase");
const authUtil_1 = require("../utils/authUtil");
const portfolio_entity_1 = require("../entitys/portfolio.entity");
const user_entity_1 = require("../entitys/user.entity");
const education_entity_1 = require("../entitys/education.entity");
const experience_entity_1 = require("../entitys/experience.entity");
const link_entity_1 = require("../entitys/link.entity");
//**GET Methods */
exports.getExportPortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const portfolio = yield connectDatabase_1.myDataSource
            .getRepository(portfolio_entity_1.Portfolio)
            .findOne({ where: { user: { id: userId } } });
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        // Fetch the user based on the provided user ID
        const user = yield connectDatabase_1.myDataSource
            .getRepository(user_entity_1.User)
            .findOne({ where: { id: userId } });
        // Get education data
        const educationData = yield connectDatabase_1.myDataSource
            .getRepository(education_entity_1.Education)
            .find({ where: { portfolio: portfolio } });
        // Get experience data
        const experienceData = yield connectDatabase_1.myDataSource
            .getRepository(experience_entity_1.Experience)
            .find({ where: { portfolio: portfolio } });
        // Get link data
        const linkData = yield connectDatabase_1.myDataSource
            .getRepository(link_entity_1.Link)
            .find({ where: { portfolio: portfolio } });
        const users = {
            id: user.id,
            email: user.email,
            line: user.line,
            phone: user.phone,
            profileImage: user.profileImage,
            firstNameTH: user.firstNameTH,
            lastNameTH: user.lastNameTH,
            firstNameEN: user.firstNameEN,
            lastNameEN: user.lastNameEN,
            address: user.address,
        };
        const education = educationData.map((education) => ({
            education_id: education.id,
            syear: education.syear,
            eyear: education.eyear,
            level_edu: education.level_edu,
            universe: education.universe,
            faculty: education.faculty,
            branch: education.branch,
        }));
        const experience = experienceData.map((experience) => ({
            exp_id: experience.id,
            exp_text: experience.exp_text,
        }));
        const link = linkData.map((link) => ({
            link_id: link.id,
            link_name: link.link_name,
            link_text: link.link_text,
        }));
        return res.status(200).json({
            success: true,
            data: { users, education, experience, link }
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
