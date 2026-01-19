import { base64ImageUrl } from "~/helper/ImageHelper.js";

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

enum Edge {
    Top,
    Bottom,
    Left,
    Right,
}

const EDGE_WEIGHT = 4;
const EDGE_SELECT_WEIGHT = 20;
const HALF_EDGE_WIDTH = EDGE_WEIGHT / 2;

export function createHotspotEditor(
    ctx: CanvasRenderingContext2D,
    initialCanvasWidth: number,
    initialCanvasHeight: number,
) {
    let requestShutdown = false;
    let mouseX = 0;
    let mouseY = 0;
    let texture: HTMLImageElement | undefined = undefined;
    let canvasWidth = initialCanvasWidth;
    let canvasHeight = initialCanvasHeight;
    let mouse1Pressed = false;
    let mouse2Pressed = false;
    let mouseXCanvas = 0;
    let mouseYCanvas = 0;

    const rects: Rect[] = [{ x: 256, y: 256, w: 128, h: 128 }];
    const selectedRectIdx = 0;

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

        if (!texture) {
            return;
        }

        mouseXCanvas = _canvasToTextureSpaceX(mouseX);
        mouseYCanvas = _canvasToTextureSpaceY(mouseY);

        for (const rect of rects) {
            _drawRect(rect);
        }
    }

    function _drawRect(rect: Rect) {
        const hoveredTop = _isPointInAabb(
            mouseXCanvas,
            mouseYCanvas,
            rect.x + _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT),
            rect.y - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT / 2),
            rect.w - _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT * 2),
            _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
        );
        const hoveredBottom = _isPointInAabb(
            mouseXCanvas,
            mouseYCanvas,
            rect.x + _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
            rect.y + rect.h - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT / 2),
            rect.w - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT * 2),
            _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
        );
        const hoveredLeft = _isPointInAabb(
            mouseXCanvas,
            mouseYCanvas,
            rect.x - _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT / 2),
            rect.y + _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
            _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT),
            rect.h - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT * 2),
        );
        const hoveredRight = _isPointInAabb(
            mouseXCanvas,
            mouseYCanvas,
            rect.x + rect.w - _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT / 2),
            rect.y + _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
            _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
            rect.h - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT * 2),
        );
        const hoveredMiddle = _isPointInAabb(mouseXCanvas, mouseYCanvas, rect.x, rect.y, rect.w, rect.h);

        if (hoveredMiddle || hoveredTop || hoveredBottom || hoveredLeft || hoveredRight) {
            if (mouse1Pressed) {
                ctx.fillStyle = "rgb(255 205 255 / 0.1)";
            } else {
                ctx.fillStyle = "rgb(255 255 255 / 0.05)";
            }
        } else {
            ctx.strokeStyle = "rgb(255 255 255 / 0.2)";
            ctx.fillStyle = "transparent";
        }
        ctx.rect(
            _textureToCanvasSpaceX(rect.x),
            _textureToCanvasSpaceY(rect.y),
            _textureToCanvasSpaceX(rect.w),
            _textureToCanvasSpaceY(rect.h),
        );
        ctx.fill();

        _drawRectEdges(rect, hoveredTop, hoveredBottom, hoveredLeft, hoveredRight);
    }

    function _drawRectEdges(
        rect: Rect,
        hoveredTop: boolean,
        hoveredBottom: boolean,
        hoveredLeft: boolean,
        hoveredRight: boolean,
    ) {
        function applyEdgeDrawStyles(edgeHovered: boolean) {
            if (edgeHovered) {
                ctx.strokeStyle = "rgb(255 255 255 / 0.7)";
                if (mouse1Pressed) {
                    ctx.strokeStyle = "rgb(255 100 255 / 0.7)";
                }
                ctx.lineCap = "round";
                ctx.lineWidth = EDGE_SELECT_WEIGHT;
            } else {
                ctx.strokeStyle = "rgb(255 255 255 / 0.3)";
                ctx.lineWidth = EDGE_WEIGHT;
            }
        }

        {
            // Top
            ctx.beginPath();
            ctx.moveTo(_textureToCanvasSpaceX(rect.x), _textureToCanvasSpaceY(rect.y));
            ctx.lineTo(_textureToCanvasSpaceX(rect.x + rect.w), _textureToCanvasSpaceY(rect.y));

            applyEdgeDrawStyles(hoveredTop);
            ctx.stroke();
        }

        {
            // Bottom
            ctx.beginPath();
            ctx.moveTo(_textureToCanvasSpaceX(rect.x), _textureToCanvasSpaceY(rect.y + rect.h));
            ctx.lineTo(_textureToCanvasSpaceX(rect.x + rect.w), _textureToCanvasSpaceY(rect.y + rect.h));

            applyEdgeDrawStyles(hoveredBottom);
            ctx.stroke();
        }

        {
            // Left
            ctx.beginPath();
            ctx.moveTo(_textureToCanvasSpaceX(rect.x), _textureToCanvasSpaceY(rect.y));
            ctx.lineTo(_textureToCanvasSpaceX(rect.x), _textureToCanvasSpaceY(rect.y + rect.h));

            applyEdgeDrawStyles(hoveredLeft);
            ctx.stroke();
        }

        {
            // Left
            ctx.beginPath();
            ctx.moveTo(_textureToCanvasSpaceX(rect.x + rect.w), _textureToCanvasSpaceY(rect.y));
            ctx.lineTo(_textureToCanvasSpaceX(rect.x + rect.w), _textureToCanvasSpaceY(rect.y + rect.h));

            applyEdgeDrawStyles(hoveredRight);
            ctx.stroke();
        }
    }

    function _isPointInAabb(pointX: number, pointY: number, x: number, y: number, w: number, h: number) {
        return pointX >= x && pointX <= x + w && pointY >= y && pointY <= y + h;
    }

    function _canvasToTextureSpaceX(cX: number) {
        if (!texture) return cX;
        return (cX / canvasWidth) * texture.width;
    }
    function _canvasToTextureSpaceY(cY: number) {
        if (!texture) return cY;
        return (cY / canvasHeight) * texture.height;
    }
    function _textureToCanvasSpaceX(tX: number) {
        if (!texture) return tX;
        return (tX / texture.width) * canvasWidth;
    }
    function _textureToCanvasSpaceY(tY: number) {
        if (!texture) return tY;
        return (tY / texture.height) * canvasHeight;
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
    function updateMouse1Pressed(pressed: boolean) {
        mouse1Pressed = pressed;
    }
    function updateMouse2Pressed(pressed: boolean) {
        mouse2Pressed = pressed;
    }
    function updateRealWidth(w: number) {
        canvasWidth = w;
    }
    function updateRealHeight(h: number) {
        canvasHeight = h;
    }

    onScopeDispose(() => {
        requestShutdown = true;
    });
    _drawLoop();

    return {
        updateTexture,
        updateMouseX,
        updateMouseY,
        updateMouse1Pressed,
        updateMouse2Pressed,
        updateRealWidth,
        updateRealHeight,
    };
}
