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
const link_entity_1 = require("../entitys/link.entity");
const portfolio_entity_1 = require("../entitys/portfolio.entity");
const connectDatabase_1 = require("../configs/connectDatabase");
const authUtil_1 = require("../utils/authUtil");
//**POST Methods */
exports.createLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { link_name, link_text } = req.body;
        const linkRepository = connectDatabase_1.myDataSource.getRepository(link_entity_1.Link);
        const newLink = linkRepository.create({
            link_name,
            link_text,
            portfolio: portfolio,
        });
        yield linkRepository.save(newLink);
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
exports.getLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const linkData = yield connectDatabase_1.myDataSource
            .getRepository(link_entity_1.Link)
            .find({ where: { portfolio: portfolio } });
        const linkList = linkData.map((link) => ({
            link_id: link.id,
            link_name: link.link_name,
            link_text: link.link_text,
        }));
        return res.status(200).json({
            success: true,
            data: linkList,
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
//**PUT Methods*/
exports.updateLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const { link_id, link_name, link_text } = req.body;
        const linkRepository = connectDatabase_1.myDataSource.getRepository(link_entity_1.Link);
        // ตรวจสอบว่าลิงก์ที่ต้องการอัปเดตมีอยู่หรือไม่
        const link = yield linkRepository.findOne({
            where: { id: link_id, portfolio: { user: { id: userId } } },
        });
        if (!link) {
            return res.status(404).send({
                success: false,
                message: "Link not found",
            });
        }
        link.link_name = link_name;
        link.link_text = link_text;
        yield linkRepository.save(link);
        return res.status(200).send({
            success: true,
            message: "Record update success",
            link,
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
//**DELETE Methods */
exports.deleteLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const linkId = req.query.link_id;
        if (!linkId) {
            return res.status(400).send({
                success: false,
                message: "Missing link_id parameter",
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
        const linkRepository = connectDatabase_1.myDataSource.getRepository(link_entity_1.Link);
        const deleteResult = yield linkRepository.delete({ id: linkId, portfolio });
        if (deleteResult.affected === 0) {
            return res.status(404).send({
                success: false,
                message: "No link record found to delete",
            });
        }
        return res.status(200).send({
            success: true,
            message: "Link record deleted successfully",
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
