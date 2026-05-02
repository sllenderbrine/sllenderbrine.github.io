import type DenseLayer from "./DenseLayer.js";

export abstract class LayerOptimizer {
    abstract applyGradients(learnRate: number, batchSize: number, clearGradients: boolean): void;
}

export class SgdOptimizer extends LayerOptimizer {
    constructor(public layer: DenseLayer) { super(); }
    applyGradients(learnRate: number, batchSize: number, clearGradients: boolean) {
        const layer = this.layer;
        const l = learnRate / batchSize;
        for(let i=0; i<layer.size; i++) {
            for(let j=0; j<layer.inputSize; j++) {
                layer.weights[i]![j]! -= layer.weightGrads[i]![j]! * l;
                if(clearGradients) layer.weightGrads[i]![j]! = 0;
            }
            layer.biases[i]! -= layer.biasGrads[i]! * l;
            if(clearGradients) layer.biasGrads[i] = 0;
        }
    }
}

export class AdamOptimizer extends LayerOptimizer {
    weightM: Float32Array[];
    weightV: Float32Array[];
    biasM: Float32Array;
    biasV: Float32Array;
    constructor(
        public layer: DenseLayer,
        public beta1 = 0.9,
        public beta2 = 0.999,
        public epsilon = 1e-8,
        public t = 0,
    ) {
        super();
        this.weightM = [];
        this.weightV = [];
        for(let i=0; i<layer.size; i++) {
            this.weightM.push(new Float32Array(layer.inputSize));
            this.weightV.push(new Float32Array(layer.inputSize));
        }
        this.biasM = new Float32Array(layer.size);
        this.biasV = new Float32Array(layer.size);
    }
    applyGradients(learnRate: number, batchSize: number, clearGradients: boolean) {
        const layer = this.layer;
        const lr = learnRate / batchSize;
        this.t++;
        const b1 = this.beta1;
        const b2 = this.beta2;
        const eps = this.epsilon;
        for(let i=0; i<layer.size; i++) {
            const gB = layer.biasGrads[i]!;
            this.biasM[i] = b1 * this.biasM[i]! + (1 - b1) * gB;
            this.biasV[i] = b2 * this.biasV[i]! + (1 - b2) * gB * gB;
            const mHatB = this.biasM[i]! / (1 - Math.pow(b1, this.t));
            const vHatB = this.biasV[i]! / (1 - Math.pow(b2, this.t));
            layer.biases[i]! -= lr * mHatB / (Math.sqrt(vHatB) + eps);
            for (let j=0; j<layer.inputSize; j++) {
                const gW = layer.weightGrads[i]![j]!;
                this.weightM[i]![j] = b1 * this.weightM[i]![j]! + (1 - b1) * gW;
                this.weightV[i]![j] = b2 * this.weightV[i]![j]! + (1 - b2) * gW * gW;
                const mHat = this.weightM[i]![j]! / (1 - Math.pow(b1, this.t));
                const vHat = this.weightV[i]![j]! / (1 - Math.pow(b2, this.t));
                layer.weights[i]![j]! -= lr * mHat / (Math.sqrt(vHat) + eps);
            }
        }
    }
}