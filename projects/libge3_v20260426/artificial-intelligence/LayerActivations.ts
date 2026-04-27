import type { LayerActivation } from "./AITypes.js";
import type DenseLayer from "./DenseLayer.js";

export const SigmoidActivation: LayerActivation = {
    activate: (z: number) => 1/(1+Math.exp(-z)),
    da_dz: (z: number, a: number) => a * (1 - a),
    name: "Sigmoid",
}

export const ReluActivation: LayerActivation = {
    activate: (z: number) => Math.max(z, 0),
    da_dz: (z: number, a: number) => z > 0 ? 1 : 0,
    name: "ReLU",
}

export const LinearActivation: LayerActivation = {
    activate: (z: number) => z,
    da_dz: (z: number, a: number) => 1,
    name: "Linear",
};

export function softmaxLayer(layer: DenseLayer) {
    let max = -Infinity;
    for(let i=0; i<layer.size; i++) {
        max = Math.max(max, layer.values_z[i]!);
    }
    let sum = 0;
    for(let i=0; i<layer.size; i++) {
        const v = Math.exp(layer.values_z[i]! - max);
        layer.values_a[i] = v;
        sum += v;
    }
    for(let i=0; i<layer.size; i++) {
        layer.values_a[i]! /= sum;
    }
}