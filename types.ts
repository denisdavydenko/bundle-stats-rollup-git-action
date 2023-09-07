export interface ISize {
    rendered: number;
}
export interface IChunk {
    [key: string]: ISize
}
export interface IFile {
    [key: string]: IChunk
}

export type AssetDiff = {
    name: string
    new: {
        rendered: number
    }
    old: {
        rendered: number
    }
    diff: number
    diffPercentage: number
}