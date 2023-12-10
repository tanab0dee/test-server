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
exports.Information = void 0;
const typeorm_1 = require("typeorm");
const description_entity_1 = require("./description.entity");
const datacollection_entity_1 = require("./datacollection.entity");
let Information = exports.Information = class Information {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Information.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Information.prototype, "info_text", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => description_entity_1.Description),
    __metadata("design:type", description_entity_1.Description)
], Information.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => datacollection_entity_1.Datacollection, (datacollection) => datacollection.information),
    __metadata("design:type", datacollection_entity_1.Datacollection)
], Information.prototype, "datacollection", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp"
    }),
    __metadata("design:type", Date)
], Information.prototype, "date", void 0);
exports.Information = Information = __decorate([
    (0, typeorm_1.Entity)()
], Information);
