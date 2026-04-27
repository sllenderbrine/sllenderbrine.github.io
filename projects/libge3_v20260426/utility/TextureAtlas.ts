export type AtlasImage = {x: number, y: number, w: number, h: number, img: HTMLImageElement, name: string};

export default class TextureAtlas {
    width: number;
    height: number;
    constructor(public image: HTMLImageElement, public bounds: {[name:string]: AtlasImage}) {
        this.width = image.naturalWidth;
        this.height = image.naturalHeight;
    }
    static async fromUrls(args: [name:string, url:string][], padding = 0) {
        let images: AtlasImage[] = [];
        let promises: Promise<void>[] = [];
        let atlasSize = 0;
        for(let [name, url] of args) {
            promises.push(new Promise<void>(async res => {
                let img = new Image();
                img.onload = () => {
                    let data: AtlasImage = {img, x:0, y:0, w:img.naturalWidth+2*padding, h:img.naturalHeight+2*padding, name};
                    let isColliding = true;
                    for(let x=0;x<=atlasSize-data.w;x++) {
                        for(let y=0;y<=atlasSize-data.h;y++) {
                            isColliding = false;
                            for(let other of images) {
                                if(x + data.w > other.x && y + data.h > other.y && x < other.x + other.w && y < other.y + other.h) {
                                    isColliding = true;
                                    break;
                                }
                            }
                            if(!isColliding) {
                                data.x = x;
                                data.y = y;
                                break;
                            }
                        }
                        if(!isColliding) break;
                    }
                    if(isColliding) {
                        data.x = atlasSize;
                        data.y = 0;
                        atlasSize = data.x + data.w;
                    }
                    images.push(data);
                    res();
                }
                img.src = url;
            }));
        }
        await Promise.all(promises);
        let canvas = document.createElement("canvas");
        canvas.width = atlasSize;
        canvas.height = atlasSize;
        let ctx = canvas.getContext("2d")!;
        let bounds: {[name:string]: AtlasImage} = {};
        for(let img of images) {
            ctx.drawImage(img.img, img.x + padding, img.y + padding);
            if(padding !== 0) {
                ctx.drawImage(img.img, 0, 0, 1, img.h-2*padding, img.x, img.y + padding, padding, img.h-2*padding); // left
                ctx.drawImage(img.img, img.w-2*padding-1, 0, 1, img.h-2*padding, img.x+img.w-padding, img.y + padding, padding, img.h-2*padding); // right
                ctx.drawImage(img.img, 0, 0, img.w-2*padding, 1, img.x + padding, img.y, img.w-2*padding, padding); // top
                ctx.drawImage(img.img, 0, img.h-2*padding-1, img.w-2*padding, 1, img.x + padding, img.y+img.h-padding, img.w-2*padding, padding); // bottom
                ctx.drawImage(img.img, 0, 0, 2, 2, img.x, img.y, padding, padding); // top-left
                ctx.drawImage(img.img, img.w-2*padding-2, 0, 2, 2, img.x+img.w-padding, img.y, padding, padding); // top-right
                ctx.drawImage(img.img, 0, img.h-2*padding-2, 2, 2, img.x, img.y+img.h-padding, padding, padding); // bottom-left
                ctx.drawImage(img.img, img.w-2*padding-2, img.h-2*padding-2, 2, 2, img.x+img.w-padding, img.y+img.h-padding, padding, padding); // bottom-right
            }
            img.x = (img.x + padding) / atlasSize;
            img.y = (img.y + padding) / atlasSize;
            img.w = (img.w - 2*padding) / atlasSize;
            img.h = (img.h - 2*padding) / atlasSize;
            bounds[img.name] = img;
        }
        let url = canvas.toDataURL();
        const atlasImage = await new Promise<HTMLImageElement>(res => {
            let img = new Image();
            img.onload = () => {
                res(img);
            }
            img.src = url;
        });
        return new TextureAtlas(atlasImage, bounds);
    }
}