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
const education_entity_1 = require("../entitys/education.entity");
const portfolio_entity_1 = require("../entitys/portfolio.entity");
const connectDatabase_1 = require("../configs/connectDatabase");
const authUtil_1 = require("../utils/authUtil");
//**POST Methods */
exports.createEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { syear, eyear, level_edu, universe, faculty, branch, } = req.body;
        const educationRepository = connectDatabase_1.myDataSource.getRepository(education_entity_1.Education);
        const newEducation = educationRepository.create({
            syear,
            eyear,
            level_edu,
            universe,
            faculty,
            branch,
            portfolio: portfolio, // เพิ่ม portfolioId ในบันทึก Education
        });
        yield educationRepository.save(newEducation);
        return res.status(200).send({
            success: true,
            message: "Record update success",
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
//**GET Methods*/
exports.getEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // ดึงข้อมูลการศึกษาของผู้ใช้จากตาราง "education"
        const educationData = yield connectDatabase_1.myDataSource
            .getRepository(education_entity_1.Education)
            .find({ where: { portfolio: portfolio } });
        // สร้าง array เพื่อเก็บข้อมูลการศึกษาที่จะส่งกลับ
        const educationList = educationData.map((education) => ({
            education_id: education.id,
            syear: education.syear,
            eyear: education.eyear,
            level_edu: education.level_edu,
            universe: education.universe,
            faculty: education.faculty,
            branch: education.branch,
        }));
        return res.status(200).json({
            success: true,
            data: educationList,
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
exports.deleteEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const educationId = req.query.education_id; // รับ education_id จาก query
        if (!educationId) {
            return res.status(400).send({
                success: false,
                message: "Missing education_id parameter",
            });
        }
        // Find the user's portfolio
        const portfolio = yield connectDatabase_1.myDataSource
            .getRepository(portfolio_entity_1.Portfolio)
            .findOne({ where: { user: { id: userId } } });
        if (!portfolio) {
            return res.status(404).send({
                success: false,
                message: "Portfolio not found",
            });
        }
        const educationRepository = connectDatabase_1.myDataSource.getRepository(education_entity_1.Education);
        const deleteResult = yield educationRepository.delete({ id: educationId, portfolio });
        if (deleteResult.affected === 0) {
            return res.status(404).send({
                success: false,
                message: "No education record found to delete",
            });
        }
        return res.status(200).send({
            success: true,
            message: "Education record deleted successfully",
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
//**PUT Methods */
exports.updateEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const { education_id, syear, eyear, level_edu, universe, faculty, branch, } = req.body;
        const educationRepository = connectDatabase_1.myDataSource.getRepository(education_entity_1.Education);
        const education = yield educationRepository.findOne({
            where: { id: education_id, portfolio: { user: { id: userId } } },
        });
        if (!education) {
            return res.status(404).send({
                success: false,
                message: "Education record not found",
            });
        }
        // Update the education record with the new data
        education.syear = syear;
        education.eyear = eyear;
        education.level_edu = level_edu;
        education.universe = universe;
        education.faculty = faculty;
        education.branch = branch;
        // Save the updated education record
        yield educationRepository.save(education);
        return res.status(200).json({
            success: true,
            message: "Education record updated successfully",
            education: education,
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
