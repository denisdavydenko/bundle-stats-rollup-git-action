"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = void 0;
const helpers_1 = require("./helpers");
function compare(oldAssets, newAssets) {
    const added = [];
    const removed = [];
    const bigger = [];
    const smaller = [];
    const unchanged = [];
    let newRenderedTotal = 0;
    let oldRenderedTotal = 0;
    for (const [name, oldAssetSizes] of Object.entries(oldAssets)) {
        oldRenderedTotal += oldAssetSizes.rendered;
        const newAsset = newAssets[name];
        if (!newAsset) {
            removed.push((0, helpers_1.getAssetDiff)(name, oldAssetSizes, { rendered: 0 }));
        }
        else {
            const diff = (0, helpers_1.getAssetDiff)(name, oldAssetSizes, newAsset);
            if (diff.diffPercentage > 0) {
                bigger.push(diff);
            }
            else if (diff.diffPercentage < 0) {
                smaller.push(diff);
            }
            else {
                unchanged.push(diff);
            }
        }
    }
    for (const [name, newAssetSizes] of Object.entries(newAssets)) {
        newRenderedTotal += newAssetSizes.rendered;
        const oldAsset = oldAssets[name];
        if (!oldAsset) {
            added.push((0, helpers_1.getAssetDiff)(name, { rendered: 0 }, newAssetSizes));
        }
    }
    const oldFilesCount = Object.keys(oldAssets).length;
    const newFilesCount = Object.keys(newAssets).length;
    return {
        added: (0, helpers_1.sortDiffDescending)(added),
        removed: (0, helpers_1.sortDiffDescending)(removed),
        bigger: (0, helpers_1.sortDiffDescending)(bigger),
        smaller: (0, helpers_1.sortDiffDescending)(smaller),
        unchanged,
        total: (0, helpers_1.getAssetDiff)(oldFilesCount === newFilesCount
            ? `${newFilesCount}`
            : `${oldFilesCount} → ${newFilesCount}`, { rendered: oldRenderedTotal }, { rendered: newRenderedTotal })
    };
}
exports.compare = compare;
