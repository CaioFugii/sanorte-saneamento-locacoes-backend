"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../middlewares"));
const login_usecase_1 = require("../usecase/login.usecase");
const list_services_usecase_1 = require("../usecase/list-services.usecase");
const register_completed_services_usecase_1 = require("../usecase/register-completed-services.usecase");
const services_repository_1 = require("../repository/services.repository");
const database_connection_1 = require("../repository/database-connection");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (_, __, cb) {
        const folderPath = "/tmp/";
        cb(null, folderPath);
    },
    filename: function (_, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    },
});
const fileFilter = (_, file, cb) => {
    const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Tipo de arquivo não suportado. Por favor, envie um arquivo Excel."), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
const router = (0, express_1.Router)();
router.post("/login", (req, res, next) => {
    try {
        const usecase = new login_usecase_1.LoginUseCase();
        const response = usecase.execute({
            user: req.body.user,
            password: req.body.password,
        });
        return res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
router.get("/services", middlewares_1.default.authToken, async (req, res, next) => {
    try {
        const { location, role } = JSON.parse(req.headers.authorization);
        const rangeFrom = req.query?.from || "";
        const rangeTo = req.query?.to || "";
        const queryLocation = req.query?.location || "Santos - Cubatão";
        let filterLocation = null;
        if (role === "admin" && location === "*") {
            filterLocation = [queryLocation];
        }
        else {
            filterLocation = [location];
        }
        const repository = new services_repository_1.ServicesRepository(database_connection_1.connectionPool);
        const usecase = new list_services_usecase_1.ListCompletedServicesUseCase(repository);
        const response = await usecase.execute({
            location: filterLocation,
            range: { from: rangeFrom, to: rangeTo },
        });
        return res.status(200).json(response ?? []);
    }
    catch (error) {
        next(error);
    }
});
router.post("/services", middlewares_1.default.authToken, upload.single("file"), async (req, res, next) => {
    try {
        const { path } = req.file;
        const { location } = JSON.parse(req.headers.authorization);
        const repository = new services_repository_1.ServicesRepository(database_connection_1.connectionPool);
        const usecase = new register_completed_services_usecase_1.RegisterCompletedServicesUseCase(repository);
        await usecase.execute(path, location);
        return res.status(200).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map