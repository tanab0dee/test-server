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
const skills_entity_1 = require("../entitys/skills.entity");
const levels_entity_1 = require("../entitys/levels.entity");
const information_entity_1 = require("../entitys/information.entity");
const description_entity_1 = require("../entitys/description.entity");
const typeorm_1 = require("typeorm");
const authUtil_1 = require("../utils/authUtil");
//ข้อมูลskillทั้งหมด
exports.searchSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const codeskill = req.query.codeskill;
        const levelName = req.query.level_name;
        const descid = req.query.descid; // เพิ่มการรับค่า descid
        const skillsRepository = connectDatabase_1.myDataSource.getRepository(skills_entity_1.Skills);
        let skillsQuery = skillsRepository
            .createQueryBuilder("skill")
            .leftJoinAndSelect("skill.category", "category")
            .leftJoinAndSelect("category.subcategory", "subcategory")
            .leftJoinAndSelect("skill.levels", "level")
            .leftJoinAndSelect("level.descriptions", "descriptions");
        if (codeskill) {
            skillsQuery = skillsQuery.where({ codeskill });
        }
        if (levelName) {
            skillsQuery = skillsQuery.andWhere("level.level_name = :levelName", {
                levelName,
            });
        }
        if (descid) {
            skillsQuery = skillsQuery.andWhere("descriptions.descid = :descid", {
                descid,
            });
        }
        const skills = yield skillsQuery.getMany();
        if (skills.length === 0) {
            return res.status(404).send("No skills found");
        }
        return res.send(skills);
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});
//การค้นหาข้อมูลแบบ dropdown
exports.dropdownSkillsAPI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryText = req.query.categoryText; // Get category_text from query parameter
        const subcategoryText = req.query.subcategoryText; // Get category_text from query parameter
        const skillsRepository = connectDatabase_1.myDataSource.getRepository(skills_entity_1.Skills); // Use getRepository function
        let query = skillsRepository
            .createQueryBuilder("skill")
            .leftJoinAndSelect("skill.category", "category")
            .leftJoinAndSelect("category.subcategory", "subcategory")
            .leftJoinAndSelect("skill.levels", "level")
            .leftJoinAndSelect("level.descriptions", "descriptions");
        if (categoryText && subcategoryText) {
            query = query
                .where("category.category_text = :categoryText", { categoryText })
                .andWhere("subcategory.subcategory_text = :subcategoryText", {
                subcategoryText,
            });
        }
        else if (categoryText) {
            query = query.where("category.category_text = :categoryText", {
                categoryText,
            });
        }
        const skills = yield query.getMany();
        // Extract subcategory_text from the result
        const subcategoryTexts = skills.map((skill) => { var _a, _b; return (_b = (_a = skill.category) === null || _a === void 0 ? void 0 : _a.subcategory) === null || _b === void 0 ? void 0 : _b.subcategory_text; });
        return res.send({ skills, subcategoryTexts });
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error"); // Send appropriate response in case of an error
    }
});
// API Datacollection
// Post Method
exports.createDatacollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const descriptionId = req.query.descriptionId;
        const { info_text } = req.body; // รับ description id และ info_text จากข้อมูลที่ส่งมา
        if (!info_text) {
            return res.status(401).send({
                success: false,
                message: "info_text cannot be empty.",
            });
        }
        const datacollection = yield (0, authUtil_1.findDatacollectionByUserId)(userId);
        if (!datacollection) {
            return res.status(404).send({
                success: false,
                message: "Datacollection not found",
            });
        }
        const description = yield connectDatabase_1.myDataSource
            .getRepository(description_entity_1.Description)
            .findOne({ where: { id: descriptionId } }); // ค้นหา description ด้วย descriptionId ที่รับมา
        if (!description) {
            return res.status(404).send({
                success: false,
                message: "Description not found",
            });
        }
        const { description_text: descriptionText } = description;
        const duplicateDescription = yield connectDatabase_1.myDataSource
            .getRepository(description_entity_1.Description)
            .find({ where: { description_text: descriptionText } });
        //!! 903 is want tabSpace to find data//////////////
        if (duplicateDescription.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No duplicate descriptions found",
            });
        }
        const infoRepository = connectDatabase_1.myDataSource.getRepository(information_entity_1.Information);
        const duplicateDescriptionPromise = duplicateDescription.map((desc) => __awaiter(void 0, void 0, void 0, function* () {
            const newInformation = yield infoRepository.create({
                info_text,
                datacollection,
                description: desc,
            });
            return infoRepository.save(newInformation);
        }));
        const saveInformation = yield Promise.all(duplicateDescriptionPromise);
        return res.status(200).send({
            success: true,
            message: "Record create success",
            datacollection,
            description,
            duplicateDescription: {
                totalOfDuplicateDescriptionText: duplicateDescription.length,
                dataOfDuplicateDescriptionText: duplicateDescription,
            },
            info_id: saveInformation.map((info) => info.id),
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
// GET Method
exports.getDatacollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const datacollection = yield (0, authUtil_1.findDatacollectionByUserId)(userId);
        if (!datacollection) {
            return res.status(404).send({
                success: false,
                message: "Datacollection not found",
            });
        }
        const datacollectionId = datacollection.id.toString();
        const information = yield (0, authUtil_1.findInformationByDatacollectionId)(datacollectionId);
        if (!information) {
            return res.status(401).send({
                success: false,
                message: "Information not found for the given datacollection",
            });
        }
        const descriptionIds = information.map((info) => info.description.id);
        const descriptionRepository = connectDatabase_1.myDataSource.getRepository(description_entity_1.Description);
        const descriptionsWithLevel = yield descriptionRepository.find({
            where: {
                id: (0, typeorm_1.In)(descriptionIds),
            },
            relations: ["level"],
        });
        const levelsRepository = connectDatabase_1.myDataSource.getRepository(levels_entity_1.Levels);
        const levelsData = yield Promise.all(descriptionsWithLevel.map((description) => __awaiter(void 0, void 0, void 0, function* () {
            const levelIdToSearch = description.level.id;
            const level = yield levelsRepository.findOne({
                where: { id: levelIdToSearch },
            });
            const skillsRepository = connectDatabase_1.myDataSource.getRepository(skills_entity_1.Skills);
            const uniqueSkills = yield skillsRepository.find({
                relations: ["levels"],
                where: {
                    levels: { id: levelIdToSearch },
                },
            });
            return {
                descriptionId: description.id,
                descriptionText: description.description_text,
                levelId: description.level.id,
                level,
                uniqueSkills,
            };
        })));
        return res.status(200).send({
            success: true,
            message: "Information found",
            datacollection,
            information,
            descriptionsWithLevel: levelsData,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        });
    }
});
// PUT Method
exports.updateDatacollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const informationId = req.query.informationId;
        const { info_text } = req.body; // รับ ID ของข้อมูล Information และค่า info_text ที่ต้องการอัปเดตจากข้อมูลที่ส่งมา
        const informationRepository = connectDatabase_1.myDataSource.getRepository(information_entity_1.Information);
        // ตรวจสอบว่าข้อมูล Information ที่ต้องการอัปเดตมีอยู่หรือไม่
        const information = yield informationRepository.findOne({
            where: { id: informationId, datacollection: { user: { id: userId } } },
            relations: ["description"],
        });
        if (!information || !information.description) {
            return res.status(404).send({
                success: false,
                message: "Information not found",
            });
        }
        const { description_text: descriptionText } = information.description;
        const duplicateDescription = yield connectDatabase_1.myDataSource
            .getRepository(description_entity_1.Description)
            .find({ where: { description_text: descriptionText } });
        //!! 903 is want tabSpace to find data//////////////
        if (duplicateDescription.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No duplicate descriptions found",
            });
        }
        // Update info_text in the current information
        information.info_text = info_text;
        yield informationRepository.save(information);
        // Update info_text in other information with the same description_text
        const infoRepository = connectDatabase_1.myDataSource.getRepository(information_entity_1.Information);
        const updatePromises = duplicateDescription.map((desc) => __awaiter(void 0, void 0, void 0, function* () {
            const otherInformation = yield infoRepository.findOne({
                where: { description: desc },
            });
            if (otherInformation) {
                otherInformation.info_text = info_text;
                return infoRepository.save(otherInformation);
            }
        }));
        yield Promise.all(updatePromises);
        return res.status(200).send({
            success: true,
            message: "Record update success",
            information,
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
// delete method
exports.deleteDatacollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield (0, authUtil_1.getUserIdFromRefreshToken)(req);
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: "Unauthenticated",
            });
        }
        const informationId = req.query.informationId; // รับ ID ของข้อมูล Information ที่ต้องการลบจากข้อมูลที่ส่งมา
        const informationRepository = connectDatabase_1.myDataSource.getRepository(information_entity_1.Information);
        // ตรวจสอบว่าข้อมูล Information ที่ต้องการลบมีอยู่หรือไม่
        const information = yield informationRepository.findOne({
            where: { id: informationId, datacollection: { user: { id: userId } } },
            relations: ["description"],
        });
        if (!information || !information.description) {
            return res.status(404).send({
                success: false,
                message: "Information not found",
            });
        }
        const { description_text: descriptionText } = information.description;
        // Find other information with the same description_text
        const duplicateDescriptions = yield connectDatabase_1.myDataSource
            .getRepository(description_entity_1.Description)
            .find({ where: { description_text: descriptionText } });
        if (duplicateDescriptions.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No duplicate descriptions found",
            });
        }
        // Delete the current information
        yield informationRepository.remove(information);
        // Delete other information with the same description_text
        const infoRepository = connectDatabase_1.myDataSource.getRepository(information_entity_1.Information);
        const deletePromises = duplicateDescriptions.map((desc) => __awaiter(void 0, void 0, void 0, function* () {
            const otherInformation = yield infoRepository.findOne({
                where: { description: desc },
            });
            if (otherInformation) {
                return infoRepository.remove(otherInformation);
            }
        }));
        yield Promise.all(deletePromises);
        return res.status(200).send({
            success: true,
            message: "Record deleted successfully",
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
