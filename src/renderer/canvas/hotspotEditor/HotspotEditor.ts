import { base64ImageUrl } from "~/helper/ImageHelper.js";

export function createHotspotEditor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    return {
        setTexture(base64: string, width: number, height: number) {
            console.log("drawing");
            const img = new Image(width, height);
            img.src = base64ImageUrl(base64);

            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        },
    };
}
