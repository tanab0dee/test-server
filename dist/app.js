"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectDatabase_1 = require("./configs/connectDatabase");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
connectDatabase_1.myDataSource
    .initialize()
    .then(() => {
    console.log("- Data Source has been intitialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const app = (0, express_1.default)();
const port = process.env.PORT || 8081;
//middleware
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['https://test-client-sfiav8.vercel.app/','*'],
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
//routes
(0, fs_1.readdirSync)('./dist/routes').map((r) => app.use('/api', require('./routes/' + r)));
//listening server overhere
app.listen(port, () => {
    console.log(`- TypeScript with Express http://localhost:${port}/`);
});
