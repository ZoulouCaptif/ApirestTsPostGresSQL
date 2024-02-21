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
exports.Task = void 0;
const better_sqlite_1 = require("@mikro-orm/better-sqlite");
let Task = class Task {
    id;
    name;
    date;
    status;
    hide;
    constructor(name, date, status, hide) {
        this.name = name;
        this.date = date;
        this.status = status;
        this.hide = hide;
    }
};
exports.Task = Task;
__decorate([
    (0, better_sqlite_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, better_sqlite_1.Property)(),
    __metadata("design:type", String)
], Task.prototype, "name", void 0);
__decorate([
    (0, better_sqlite_1.Property)(),
    __metadata("design:type", String)
], Task.prototype, "date", void 0);
__decorate([
    (0, better_sqlite_1.Property)(),
    __metadata("design:type", Boolean)
], Task.prototype, "status", void 0);
__decorate([
    (0, better_sqlite_1.Property)(),
    __metadata("design:type", Boolean)
], Task.prototype, "hide", void 0);
exports.Task = Task = __decorate([
    (0, better_sqlite_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Boolean, Boolean])
], Task);
