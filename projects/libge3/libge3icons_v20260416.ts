import { delay, generateIcon2D, IconGenerationContext2D, IconPolygon2D } from "./libge3_v20260416.js";

export abstract class IconLibrary {
    static icons: {[key:string]:string} = {};
    static iconAlreadyLoadingOrLoaded: {[key:string]:boolean} = {};
    static iconGenerators: {[key:string]:[number,number,(ctx:IconGenerationContext2D)=>void]} = {};
    static async getIconAsync(name: string): Promise<string>;
    static async getIconAsync(name: string, timeout: number): Promise<string | undefined>;
    static async getIconAsync(name: string, timeout?: number): Promise<string | undefined> {
        let startTime = performance.now();
        let url = this.icons[name];
        while(url === undefined) {
            await delay(100);
            url = this.icons[name];
            if(timeout && (performance.now() - startTime)/1000 > timeout)
                return url;
        }
        return url!;
    }
    static getIcon(name: string) {
        let url = this.icons[name];
        if(url === undefined) throw new Error("No loaded icon found with name " + name + " (maybe it hasn't been loaded yet?)");
        return url;
    }
    static async addIcon(name: string, w: number, h: number, callback: (ctx: IconGenerationContext2D) => void) {
        this.iconGenerators[name] = [w,h,callback];
    }
    static async loadIcon(name: string) {
        if(!this.iconGenerators[name]) throw new Error("No icon found with name " + name);
        if(this.iconAlreadyLoadingOrLoaded[name]) return;
        this.iconAlreadyLoadingOrLoaded[name] = true;
        let [w, h, callback] = this.iconGenerators[name]!;
        let url = await generateIcon2D(w, h, callback);
        this.icons[name] = url;
        return url;
    }
    static async loadAllIcons() {
        let promises = [];
        for(const name in this.iconGenerators) {
            promises.push(this.loadIcon(name));
        }
        await Promise.all(promises);
    }
}

IconLibrary.addIcon("roundedSquare", 64, 64, ctx => {
    IconPolygon2D.rect(0.5, 0.5, 0.7, 0.7).bevelAllSelf(0.1).bevelAllSelf(0.05).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.rect(0.5, 0.5, 0.5, 0.5).bevelAllSelf(0.07).bevelAllSelf(0.04).drawFill(ctx.selectedLayer, "white");
    ctx.brightnessToOpacity(true);
});
IconLibrary.addIcon("person", 64, 64, ctx => {
    IconPolygon2D.circleFan(0, 0, 0.4, Math.PI).rotateSelf(Math.PI).translateSelfC(0.5, 0.95).bevelAllSelf(0.1).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.circleFan(0, 0, 0.4, Math.PI).rotateSelf(Math.PI).scaleSelfC(0.65, 0.45).translateSelfC(0.5, 0.85).bevelAllSelf(0.05).drawFill(ctx.selectedLayer, "white");
    IconPolygon2D.circleFan(0.5, 0.3, 0.25).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.circleFan(0.5, 0.3, 0.15).drawFill(ctx.selectedLayer, "white");
    ctx.brightnessToOpacity(true);
});
IconLibrary.addIcon("circle", 64, 64, ctx => {
    IconPolygon2D.circleFan(0.5, 0.5, 0.4).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.circleFan(0.5, 0.5, 0.3).drawFill(ctx.selectedLayer, "white");
    ctx.brightnessToOpacity(true);
});
IconLibrary.addIcon("folder", 64, 64, ctx => {
    IconPolygon2D.createPositions([0.1,0.2,0.45,0.2,0.55,0.3,0.9,0.3,0.9,0.8,0.1,0.8]).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.createPositions([0.1,0.2,0.38,0.2,0.5,0.33,0.9,0.33,0.9,0.8,0.1,0.8]).scaleSelfC(0.78, 0.75).translateSelfC(0.11, 0.125).drawFill(ctx.selectedLayer, "white");
    ctx.brightnessToOpacity(true);
});