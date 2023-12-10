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
exports.Datacollection = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const information_entity_1 = require("./information.entity");
let Datacollection = exports.Datacollection = class Datacollection {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Datacollection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.portfolio),
    __metadata("design:type", user_entity_1.User)
], Datacollection.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => information_entity_1.Information, (information) => information.datacollection),
    __metadata("design:type", Array)
], Datacollection.prototype, "information", void 0);
exports.Datacollection = Datacollection = __decorate([
    (0, typeorm_1.Entity)()
], Datacollection);
