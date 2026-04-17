import { delay, generateIcon2D, IconGenerationContext2D, IconPolygon2D } from "./libge3_v20260416";

export abstract class IconLibrary {
    static icons: {[key:string]:string} = {};
    static iconAlreadyLoadingOrLoaded: {[key:string]:boolean} = {};
    static iconGenerators: {[key:string]:[number,number,(ctx:IconGenerationContext2D)=>void]};
    static async getIcon(name: string): Promise<string>;
    static async getIcon(name: string, timeout: number): Promise<string | undefined>;
    static async getIcon(name: string, timeout?: number): Promise<string | undefined> {
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
    IconPolygon2D.rect(0.5, 0.5, 0.5, 0.5).bevelAllSelf(0.1).bevelAllSelf(0.05).drawFill(ctx.selectedLayer, "black");
    IconPolygon2D.rect(0.5, 0.5, 0.35, 0.35).bevelAllSelf(0.07).bevelAllSelf(0.04).drawFill(ctx.selectedLayer, "white");
    ctx.brightnessToOpacity(true);
});