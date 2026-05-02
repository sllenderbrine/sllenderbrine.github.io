import DenseLayer from "./DenseLayer.js";
import { MseError } from "./NetworkErrors.js";
import type { LayerActivation, WeightRandomizer } from "./AITypes.js";
import type { LayerOptimizer } from "./Optimizers.js";
import type { LayerError } from "./AITypes.js";

export default class DenseNetwork {
    public layers: DenseLayer[] = [];
    input: Float32Array;
    batches = 0;
    constructor(public inputSize: number, layers: [size: number, activation: LayerActivation, optimizer?: LayerOptimizer, weightInit?: WeightRandomizer][]) {
        this.input = new Float32Array(inputSize);
        for(let i=0; i<layers.length; i++) {
            let layer = new DenseLayer(i==0 ? inputSize : layers[i-1]![0], layers[i]![0], layers[i]![1], layers[i]![2], layers[i]![3]);
            this.layers.push(layer);
        }
    }
    forward(values?: Float32Array | number[]) {
        let input: DenseLayer | Float32Array = this.input;
        if(values) this.input.set(values);
        for(const layer of this.layers) {
            layer.forward(input);
            input = layer;
        }
    }
    backward(output: Float32Array | number[], error: LayerError = MseError) {
        for(let i=this.layers.length-1; i>=0; i--) {
            const layer = this.layers[i]!;
            const prevLayer = i == 0 ? this.input : this.layers[i-1]!;
            if(i == this.layers.length-1) {
                layer.backwardTarget(prevLayer, output, error, true);
            } else {
                layer.backwardLayer(prevLayer, this.layers[i+1]!, true);
            }
        }
        this.batches++;
    }
    applyGradient(learnRate: number) {
        for(const layer of this.layers) {
            layer.applyGradients(learnRate, this.batches, true);
        }
        this.batches = 0;
    }
}