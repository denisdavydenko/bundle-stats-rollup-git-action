import { getAssetDiff, sortDiffDescending } from "./helpers";
import { IFile, ISize } from "./types";

export function compare(
  oldAssets: {[key: string]: ISize},
  newAssets: { [key: string]: ISize }
) {
  const added = []
  const removed = []
  const bigger = []
  const smaller = []
  const unchanged = []

  let newRenderedTotal = 0
  let oldRenderedTotal = 0

  for (const [name, oldAssetSizes] of Object.entries(oldAssets)) {
    oldRenderedTotal += oldAssetSizes.rendered
    const newAsset = newAssets[name]
    if (!newAsset) {
      removed.push(getAssetDiff(name, oldAssetSizes, { rendered: 0 }))
    } else {
      const diff = getAssetDiff(name, oldAssetSizes, newAsset)

      if (diff.diffPercentage > 0) {
        bigger.push(diff)
      } else if (diff.diffPercentage < 0) {
        smaller.push(diff)
      } else {
        unchanged.push(diff)
      }
    }
  }

  for (const [name, newAssetSizes] of Object.entries(newAssets)) {
    newRenderedTotal += newAssetSizes.rendered
    const oldAsset = oldAssets[name]
    if (!oldAsset) {
      added.push(getAssetDiff(name, { rendered: 0 }, newAssetSizes))
    }
  }

  const oldFilesCount = Object.keys(oldAssets).length
  const newFilesCount = Object.keys(newAssets).length
  return {
    added: sortDiffDescending(added),
    removed: sortDiffDescending(removed),
    bigger: sortDiffDescending(bigger),
    smaller: sortDiffDescending(smaller),
    unchanged,
    total: getAssetDiff(
      oldFilesCount === newFilesCount
        ? `${newFilesCount}`
        : `${oldFilesCount} → ${newFilesCount}`,
      { rendered: oldRenderedTotal},
      { rendered: newRenderedTotal }
    )
  }
}