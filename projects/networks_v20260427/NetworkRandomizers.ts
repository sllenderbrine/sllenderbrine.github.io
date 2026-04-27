import type { WeightRandomizer } from "./WeightRandomizer.js";

export const XavierNormal: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const p1 = Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-7)));
        const p2 = Math.cos(2 * Math.PI * Math.random());
        const p3 = Math.sqrt(2 / (nIn + nOut));
        return p1 * p2 * p3;
    }
};

export const XavierUniform: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const limit = Math.sqrt(6 / (nIn + nOut));
        return Math.random() * (2 * limit) - limit;
    }
};

export const HeNormal: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const p1 = Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-7)));
        const p2 = Math.cos(2 * Math.PI * Math.random());
        const p3 = Math.sqrt(2 / nIn);
        return p1 * p2 * p3;
    }
};

export const HeUniform: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        const limit = Math.sqrt(6 / nIn);
        return Math.random() * (2 * limit) - limit;
    }
};

export const RandomUniform: WeightRandomizer = {
    get: (nIn: number, nOut: number) => {
        return (Math.random() * 2 - 1) * 0.01;
    }
};