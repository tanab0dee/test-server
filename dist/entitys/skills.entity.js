"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skills = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const levels_entity_1 = require("./levels.entity");
let Skills = exports.Skills = class Skills {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Skills.prototype, "codeskill", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Skills.prototype, "skill_name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Skills.prototype, "overall", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Skills.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.skill),
    __metadata("design:type", category_entity_1.Category)
], Skills.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => levels_entity_1.Levels, (level) => level.skill),
    __metadata("design:type", Array)
], Skills.prototype, "levels", void 0);
exports.Skills = Skills = __decorate([
    (0, typeorm_1.Entity)()
], Skills);
