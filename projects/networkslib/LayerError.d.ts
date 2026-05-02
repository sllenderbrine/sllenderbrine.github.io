export type LayerError = {
    derr_da: (layer: DenseLayer, output: Float32Array | number[], i: number) => number,
}