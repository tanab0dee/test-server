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
exports.Description = void 0;
const typeorm_1 = require("typeorm");
const levels_entity_1 = require("./levels.entity");
let Description = exports.Description = class Description {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Description.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Description.prototype, "description_text", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => levels_entity_1.Levels, (level) => level.descriptions),
    __metadata("design:type", levels_entity_1.Levels)
], Description.prototype, "level", void 0);
exports.Description = Description = __decorate([
    (0, typeorm_1.Entity)()
], Description);
