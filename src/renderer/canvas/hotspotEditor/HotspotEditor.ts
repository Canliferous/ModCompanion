import { base64ImageUrl } from "~/helper/ImageHelper.js";

export function createHotspotEditor(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    let requestShutdown = false;
    let mouseX = 0;
    let mouseY = 0;
    let texture: HTMLImageElement | undefined = undefined;

    function _drawLoop() {
        if (requestShutdown) return;
        requestAnimationFrame(_drawLoop);

        _draw();
    }

    function _draw() {
        if (texture) {
            ctx.drawImage(texture, 0, 0, canvasWidth, canvasHeight);
        } else {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        ctx.fillStyle = "rgb(255 0 0)";
        ctx.ellipse(mouseX, mouseY, 30, 30, 0, 0, 0);
    }

    function updateTexture(base64: string, width: number, height: number) {
        const img = new Image(width, height);
        img.src = base64ImageUrl(base64);
        texture = img;
    }

    function updateMouseX(x: number) {
        mouseX = x;
    }
    function updateMouseY(y: number) {
        mouseY = y;
    }

    onScopeDispose(() => {
        requestShutdown = true;
    });
    _drawLoop();

    return {
        updateTexture,
        updateMouseX,
        updateMouseY,
    };
}
