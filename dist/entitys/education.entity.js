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
exports.Education = void 0;
const typeorm_1 = require("typeorm");
const portfolio_entity_1 = require("./portfolio.entity");
let Education = exports.Education = class Education {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Education.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Education.prototype, "syear", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Education.prototype, "eyear", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Education.prototype, "level_edu", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Education.prototype, "universe", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Education.prototype, "faculty", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Education.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp"
    }),
    __metadata("design:type", Date)
], Education.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => portfolio_entity_1.Portfolio, portfolio => portfolio.education, { onDelete: 'SET NULL' }),
    __metadata("design:type", portfolio_entity_1.Portfolio)
], Education.prototype, "portfolio", void 0);
exports.Education = Education = __decorate([
    (0, typeorm_1.Entity)()
], Education);
