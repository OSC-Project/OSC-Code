"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pathlib = require("path");
var ts = require("./typescript");
var VirtualSourceRoot = (function () {
    function VirtualSourceRoot(sourceRoot, virtualSourceRoot) {
        this.sourceRoot = sourceRoot;
        this.virtualSourceRoot = virtualSourceRoot;
    }
    VirtualSourceRoot.prototype.toVirtualPath = function (path) {
        if (!this.virtualSourceRoot)
            return null;
        var relative = pathlib.relative(this.sourceRoot, path);
        if (relative.startsWith('..') || pathlib.isAbsolute(relative))
            return null;
        return pathlib.join(this.virtualSourceRoot, relative);
    };
    VirtualSourceRoot.prototype.toVirtualPathIfFileExists = function (path) {
        var virtualPath = this.toVirtualPath(path);
        if (virtualPath != null && ts.sys.fileExists(virtualPath)) {
            return virtualPath;
        }
        return null;
    };
    return VirtualSourceRoot;
}());
exports.VirtualSourceRoot = VirtualSourceRoot;
