import { softmaxLayer } from "./NetworkActivations.js";
import { MseError } from "./NetworkErrors.js";
import { AdamOptimizer, LayerOptimizer } from "./Optimizers.js";
import { HeNormal, XavierUniform } from "./NetworkRandomizers.js";
import type { LayerActivation } from "./LayerActivation.d.ts";
import type { WeightRandomizer } from "./WeightRandomizer.d.ts";
import type { LayerError } from "./LayerError.d.ts";

export default class DenseLayer {
    values_a: Float32Array;
    values_z: Float32Array;
    derr_dz: Float32Array;
    weights: Float32Array[];
    weightGrads: Float32Array[];
    biases: Float32Array;
    biasGrads: Float32Array;
    optimizer: LayerOptimizer;
    constructor(
        public inputSize: number,
        public size: number,
        public activationOrOverride: LayerActivation | "softmax_cross_entropy",
        optimizer?: LayerOptimizer,
        weightInit?: WeightRandomizer
    ) {
        this.values_a = new Float32Array(size);
        this.values_z = new Float32Array(size);
        this.derr_dz = new Float32Array(size);
        this.weights = [];
        this.weightGrads = [];
        this.biases = new Float32Array(size);
        this.biasGrads = new Float32Array(size);
        for(let i=0; i<size; i++) {
            this.weights.push(new Float32Array(inputSize));
            this.weightGrads.push(new Float32Array(inputSize));
        }
        this.randomizeWeights(weightInit ?? ((activationOrOverride != "softmax_cross_entropy" && activationOrOverride.name.toLowerCase() == "relu") ? HeNormal : XavierUniform));
        this.optimizer = optimizer ?? new AdamOptimizer(this);
    }
    randomizeWeights(method: WeightRandomizer = XavierUniform) {
        for(let i=0; i<this.size; i++) {
            for(let j=0; j<this.inputSize; j++) {
                this.weights[i]![j] = method.get(this.inputSize, this.size);
            }
        }
    }
    forward(input: DenseLayer | Float32Array | number[]) {
        if(input instanceof DenseLayer)
            input = input.values_a;
        for(let i=0; i<this.size; i++) {
            let z = this.biases[i]!;
            for(let j=0; j<this.inputSize; j++)
                z += input[j]! * this.weights[i]![j]!;
            if(this.activationOrOverride != "softmax_cross_entropy") {
                let a = this.activationOrOverride.activate(z);
                this.values_a[i] = a;
            }
            this.values_z[i] = z;
        }
        if(this.activationOrOverride == "softmax_cross_entropy") {
            softmaxLayer(this);
        }
    }
    clearGradients() {
        for(let i=0; i<this.size; i++) {
            this.biasGrads![i] = 0;
            for(let j=0; j<this.inputSize; j++) {
                this.weightGrads![i]![j] = 0;
            }
        }
    }
    backwardTarget(input: DenseLayer | Float32Array | number[], output: Float32Array | number[], error: LayerError = MseError, accumulate = true) {
        if(input instanceof DenseLayer)
            input = input.values_a;
        for(let i=0; i<this.size; i++) {
            let derr_dz;
            if(this.activationOrOverride == "softmax_cross_entropy") {
                derr_dz = this.values_a[i]! - output[i]!;
                this.derr_dz[i] = derr_dz;
            } else {
                const derr_da = error.derr_da(this, output, i);
                const da_dz = this.activationOrOverride.da_dz(this.values_z[i]!, this.values_a[i]!);
                derr_dz = derr_da * da_dz;
                this.derr_dz[i] = derr_dz;
            }
            for(let j=0; j<this.inputSize; j++) {
                const dz_dwij = input[j]!;
                const derr_dwij = derr_dz * dz_dwij;
                if(accumulate) this.weightGrads[i]![j]! += derr_dwij;
                else this.weightGrads[i]![j]! = derr_dwij;
            }
            if(accumulate) this.biasGrads[i]! += derr_dz;
            else this.biasGrads[i]! = derr_dz;
        }
    }
    backwardLayer(input: DenseLayer | Float32Array | number[], output: DenseLayer, accumulate = true) {
        if(input instanceof DenseLayer)
            input = input.values_a;
        for(let i=0; i<this.size; i++) {
            let derr_dai = 0;
            if(this.activationOrOverride == "softmax_cross_entropy")
                throw new Error("Cannot use softmax/cross-entropy on a hidden layer");
            const dai_dzi = this.activationOrOverride.da_dz(this.values_z[i]!, this.values_a[i]!);
            for(let j=0; j<output.size; j++)
                derr_dai += output.derr_dz[j]! * output.weights[j]![i]!;
            const derr_dz = derr_dai * dai_dzi
            this.derr_dz[i] = derr_dz;
            for(let j=0; j<this.inputSize; j++) {
                const dz_dwij = input[j]!;
                const derr_dwij = derr_dz * dz_dwij;
                if(accumulate) this.weightGrads[i]![j]! += derr_dwij;
                else this.weightGrads[i]![j]! = derr_dwij;
            }
            if(accumulate) this.biasGrads[i]! += derr_dz;
            else this.biasGrads[i]! = derr_dz;
        }
    }
    applyGradients(learnRate: number, batchSize: number, clearGradients = true) {
        this.optimizer.applyGradients(learnRate, batchSize, clearGradients);
    }
}