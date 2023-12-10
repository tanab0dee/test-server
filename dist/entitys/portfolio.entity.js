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
exports.Portfolio = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const experience_entity_1 = require("./experience.entity");
const link_entity_1 = require("./link.entity");
const education_entity_1 = require("./education.entity");
let Portfolio = exports.Portfolio = class Portfolio {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Boolean)
], Portfolio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.portfolio),
    __metadata("design:type", user_entity_1.User)
], Portfolio.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => experience_entity_1.Experience, (experience) => experience.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => link_entity_1.Link, (link) => link.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => education_entity_1.Education, (education) => education.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "education", void 0);
exports.Portfolio = Portfolio = __decorate([
    (0, typeorm_1.Entity)()
], Portfolio);
