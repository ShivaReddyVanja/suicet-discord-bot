"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionLevel = void 0;
// Permission levels for role-based access control
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel[PermissionLevel["USER"] = 0] = "USER";
    PermissionLevel[PermissionLevel["MODERATOR"] = 1] = "MODERATOR";
    PermissionLevel[PermissionLevel["ADMIN"] = 2] = "ADMIN"; // Full access, config changes
})(PermissionLevel || (exports.PermissionLevel = PermissionLevel = {}));
//# sourceMappingURL=index.js.map