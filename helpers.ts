import { ISize } from "./types";
import { promises } from "fs";
import YAML from "yaml";



export function getAssetDiff(
    name: string,
    oldSize: ISize,
    newSize: ISize
) {
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
    }
}

export function mergeArrayOfObjects(array: any) {
    return array.reduce((result: any, currentObject: any) => {
        for (const key in currentObject) {
            if (currentObject.hasOwnProperty(key)) {
                result[key] = currentObject[key];
            }
        }
        return result;
    }, {});
}

import { AssetDiff } from './types'

export function sortDiffDescending(items: AssetDiff[]): AssetDiff[] {
    return items.sort(
        (diff1, diff2) => Math.abs(diff2.diff) - Math.abs(diff1.diff)
    )
}

export function getIdentifierComment(key: string): string {
    return `<!--- bundlestats-action-comment${key ? ` key:${key}` : ''} --->`
}

export function getCommentBody(
    statsDiff: any,
    title: string
): string {
    return `
### Bundle Stats${title ? ` — ${title}` : ''}

${getIdentifierComment(title)}
`
}

export function readFileToJson(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        promises.readFile(path, "utf8").then((data) => {
            resolve(YAML.parse(data))
        }).catch((err) => {
            reject(err)
        })
    })
}