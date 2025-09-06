"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switcher = exports.RateLimiter = exports.textDecoder = void 0;
exports.serverLog = serverLog;
exports.serverWarn = serverWarn;
exports.serverError = serverError;
exports.writeCorsHeaders = writeCorsHeaders;
exports.forbidden = forbidden;
exports.getIP = getIP;
exports.getPunishment = getPunishment;
exports.parseRole = parseRole;
const logging_1 = require("../../../common/src/utils/logging");
const croner_1 = require("croner");
const node_fs_1 = require("node:fs");
const math_1 = require("../../../common/src/utils/math");
const config_1 = require("./config");
function serverLog(...message) {
    logging_1.Logger.log((0, logging_1.styleText)("[Server]", logging_1.ColorStyles.foreground.magenta.normal), ...message);
}
function serverWarn(...message) {
    logging_1.Logger.warn((0, logging_1.styleText)("[Server] [WARNING]", logging_1.ColorStyles.foreground.yellow.normal), ...message);
}
function serverError(...message) {
    logging_1.Logger.warn((0, logging_1.styleText)("[Server] [ERROR]", logging_1.ColorStyles.foreground.red.normal), ...message);
}
function writeCorsHeaders(resp) {
    resp.writeHeader("Access-Control-Allow-Origin", "*")
        .writeHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        .writeHeader("Access-Control-Allow-Headers", "origin, content-type, accept, x-requested-with")
        .writeHeader("Access-Control-Max-Age", "3600");
}
function forbidden(resp) {
    resp.cork(() => {
        resp.writeStatus("403 Forbidden")
            .writeHeader("Content-Type", "text/plain")
            .end("403 Forbidden");
    });
}
exports.textDecoder = new TextDecoder();
function getIP(res, req) {
    return config_1.Config.ipHeader ? req.getHeader(config_1.Config.ipHeader) : exports.textDecoder.decode(res.getRemoteAddressAsText());
}
async function getPunishment(ip) {
    if (!config_1.Config.apiServer)
        return;
    const url = config_1.Config.apiServer.url;
    const opts = { headers: { "api-key": config_1.Config.apiServer.apiKey } };
    // Check for VPN/proxy
    const ipCheck = await (await fetch(`${url}/ipcheck/${ip}`, opts)).json();
    if (ipCheck.flagged) {
        return { message: "vpn" };
    }
    // Check punishments
    const punishments = await (await fetch(`${url}/punishments/${ip}`, opts)).json();
    if (Array.isArray(punishments) && punishments.length) {
        const punishment = punishments[0];
        if (punishment.punishmentType === "warn") {
            await fetch(`${url}/punishments/${ip}`, { method: "DELETE", ...opts });
        }
        return {
            message: punishment.punishmentType,
            reason: punishment.reason,
            reportID: punishment.reportId
        };
    }
}
function parseRole(searchParams) {
    const password = searchParams.get("password");
    const givenRole = searchParams.get("role");
    let role;
    let isDev = false;
    let nameColor;
    if (password !== null
        && givenRole !== null
        && config_1.Config.roles
        && givenRole in config_1.Config.roles
        && config_1.Config.roles[givenRole].password === password) {
        role = givenRole;
        isDev = config_1.Config.roles[givenRole].isDev ?? false;
        if (isDev) {
            try {
                const colorString = searchParams.get("nameColor");
                if (colorString)
                    nameColor = math_1.Numeric.clamp(parseInt(colorString), 0, 0xffffff);
            }
            catch { /* guess your color sucks lol */ }
        }
    }
    return { role, isDev, nameColor };
}
class RateLimiter {
    max;
    resetInterval;
    _ipMap = {};
    constructor(max, resetInterval) {
        this.max = max;
        this.resetInterval = resetInterval;
        if (resetInterval) {
            setInterval(() => this._ipMap = {}, resetInterval);
        }
    }
    increment(ip) {
        if (!ip)
            return;
        this._ipMap[ip] = (this._ipMap[ip] ?? 0) + 1;
    }
    decrement(ip) {
        if (!ip)
            return;
        const val = this._ipMap[ip] = (this._ipMap[ip] ?? 1) - 1;
        if (val < 0) {
            console.warn("Warning: Value in rate limiter dropped below 0, desync likely");
        }
    }
    isLimited(ip) {
        return !!ip && this._ipMap[ip] > this.max;
    }
    reset() {
        this._ipMap = {};
    }
}
exports.RateLimiter = RateLimiter;
class Switcher {
    _cron;
    _index = 0;
    get index() { return this._index; }
    _current;
    get current() { return this._current; }
    _next;
    get next() { return this._next; }
    get nextSwitch() { return this._cron?.nextRun()?.getTime(); }
    constructor(name, schedule, callback) {
        if (typeof schedule === "object") {
            const rotation = schedule.rotation;
            const length = rotation.length;
            const filename = `${name}.txt`;
            this._index = (0, node_fs_1.existsSync)(filename)
                ? parseInt((0, node_fs_1.readFileSync)(filename, "utf8"))
                : 0;
            this._current = rotation[this._index % length];
            this._next = rotation[(this._index + 1) % length];
            this._cron = new croner_1.Cron(schedule.cron, () => {
                this._current = rotation[++this._index % length];
                this._next = rotation[(this._index + 1) % length];
                (0, node_fs_1.writeFileSync)(filename, this._index.toString());
                callback(this._current, this._next);
            });
        }
        else {
            this._current = schedule;
            this._next = undefined;
        }
    }
}
exports.Switcher = Switcher;
//# sourceMappingURL=serverHelpers.js.map