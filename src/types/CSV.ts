
export type CSV<T = unknown> = {
    index: number[]
    columns: string[]
    data: T[][]
}