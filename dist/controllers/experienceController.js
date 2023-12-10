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
const experience_entity_1 = require("../entitys/experience.entity");
const portfolio_entity_1 = require("../entitys/portfolio.entity");
const connectDatabase_1 = require("../configs/connectDatabase");
const authUtil_1 = require("../utils/authUtil");
//**POST Methods */
exports.createExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { exp_text } = req.body;
        const experienceRepository = connectDatabase_1.myDataSource.getRepository(experience_entity_1.Experience);
        const newExperience = experienceRepository.create({
            exp_text,
            portfolio: portfolio, //เพิ่ม portfolioId ในบันทึก Experience
        });
        yield experienceRepository.save(newExperience);
        return res.status(200).send({
            success: true,
            message: "Record create success",
            portfolio: portfolio,
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
//**GET Methods */
exports.getExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const experienceData = yield connectDatabase_1.myDataSource
            .getRepository(experience_entity_1.Experience)
            .find({ where: { portfolio: portfolio } });
        const experienceList = experienceData.map((experience) => ({
            exp_id: experience.id,
            exp_text: experience.exp_text,
        }));
        return res.status(200).json({
            success: true,
            data: experienceList,
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
//**PUT Methods*/
exports.updateExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const { exp_id, exp_text } = req.body;
        const experienceRepository = connectDatabase_1.myDataSource.getRepository(experience_entity_1.Experience);
        const experience = yield experienceRepository.findOne({
            where: { id: exp_id, portfolio: { user: { id: userId } } },
        });
        if (!experience) {
            return res.status(404).send({
                success: false,
                message: "Experience record not found",
            });
        }
        experience.exp_text = exp_text;
        yield experienceRepository.save(experience);
        return res.status(200).json({
            success: true,
            message: "Experience record updated successfully",
            experience: experience,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
//**DELETE Methods */
exports.deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const expId = req.query.exp_id;
        if (!expId) {
            return res.status(400).send({
                success: false,
                message: "Missing exp_id parameter",
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
        const experienceRepository = connectDatabase_1.myDataSource.getRepository(experience_entity_1.Experience);
        const deleteResult = yield experienceRepository.delete({ id: expId, portfolio });
        if (deleteResult.affected === 0) {
            return res.status(404).send({
                success: false,
                message: "No experience record found to delete",
            });
        }
        return res.status(200).send({
            success: true,
            message: "experience record deleted successfully",
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
