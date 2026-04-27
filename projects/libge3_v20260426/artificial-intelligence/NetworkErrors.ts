import type { LayerError } from "./AITypes.js";
import type DenseLayer from "./DenseLayer.js";

export const MseError: LayerError = {
    derr_da: (layer: DenseLayer, output: Float32Array | number[], i: number) => {
        return -2/layer.size * (output[i]! - layer.values_a[i]!);
    },
}