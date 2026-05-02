export type LayerActivation = {
    activate: (z: number) => number,
    da_dz: (z: number, a: number) => number,
    name: string,
}