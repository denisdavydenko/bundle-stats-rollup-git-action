"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileToJson = exports.getCommentBody = exports.getIdentifierComment = exports.sortDiffDescending = exports.mergeArrayOfObjects = exports.getAssetDiff = void 0;
const fs_1 = require("fs");
const yaml_1 = __importDefault(require("yaml"));
function getAssetDiff(name, oldSize, newSize) {
    return {
        name,
        new: {
            rendered: newSize.rendered,
        },
        old: {
            rendered: oldSize.rendered,
        },
        diff: newSize.rendered - oldSize.rendered,
        diffPercentage: +((1 - newSize.rendered / oldSize.rendered) * -100).toFixed(5) || 0
    };
}
exports.getAssetDiff = getAssetDiff;
function mergeArrayOfObjects(array) {
    return array.reduce((result, currentObject) => {
        for (const key in currentObject) {
            if (currentObject.hasOwnProperty(key)) {
                result[key] = currentObject[key];
            }
        }
        return result;
    }, {});
}
exports.mergeArrayOfObjects = mergeArrayOfObjects;
function sortDiffDescending(items) {
    return items.sort((diff1, diff2) => Math.abs(diff2.diff) - Math.abs(diff1.diff));
}
exports.sortDiffDescending = sortDiffDescending;
function getIdentifierComment(key) {
    return `<!--- bundlestats-action-comment${key ? ` key:${key}` : ''} --->`;
}
exports.getIdentifierComment = getIdentifierComment;
function getCommentBody(statsDiff, title) {
    return `
### Bundle Stats${title ? ` — ${title}` : ''}

${getIdentifierComment(title)}
`;
}
exports.getCommentBody = getCommentBody;
function readFileToJson(path) {
    return new Promise((resolve, reject) => {
        fs_1.promises.readFile(path, "utf8").then((data) => {
            resolve(yaml_1.default.parse(data));
        }).catch((err) => {
            reject(err);
        });
    });
}
exports.readFileToJson = readFileToJson;
