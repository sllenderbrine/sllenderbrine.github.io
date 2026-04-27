export type LayerActivation = {
    activate: (z: number) => number,
    da_dz: (z: number, a: number) => number,
    name: string,
}

export type LayerError = {
    derr_da: (layer: DenseLayer, output: Float32Array | number[], i: number) => number,
}

export type WeightRandomizer = {
    get: (nIn: number, nOut: number) => number,
};