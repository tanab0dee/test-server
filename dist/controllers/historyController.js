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
const authUtil_1 = require("../utils/authUtil");
const connectDatabase_1 = require("../configs/connectDatabase");
const description_entity_1 = require("../entitys/description.entity");
const typeorm_1 = require("typeorm");
const levels_entity_1 = require("../entitys/levels.entity");
const skills_entity_1 = require("../entitys/skills.entity");
exports.getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
