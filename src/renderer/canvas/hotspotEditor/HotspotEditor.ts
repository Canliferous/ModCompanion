import { Logger } from "~/logger.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

function createRect(pos1: Vector2, pos2: Vector2): Rect {
    const x = Math.min(pos1.x, pos2.x);
    const y = Math.min(pos1.y, pos2.y);
    const w = Math.max(pos1.x, pos2.x) - x;
    const h = Math.max(pos1.y, pos2.y) - y;

    return { x, y, w, h };
}

enum Edge {
    Top,
    Bottom,
    Left,
    Right,
}

export enum HotspotEditMode {
    Select,
    Draw,
    Delete,
}

const EDGE_WEIGHT = 4;
const EDGE_SELECT_WEIGHT = 20;
const HALF_EDGE_WIDTH = EDGE_WEIGHT / 2;
const EDGE_COUNT = 4;

const SNAP_SIZE = 16;

function snapNumber(n: number): number {
    return Math.round(n / SNAP_SIZE) * SNAP_SIZE;
}

class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    snapToGrid(): Vector2 {
        this.x = snapNumber(this.x);
        this.y = snapNumber(this.y);
        return this;
    }
}

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
    let mouseXTexture = 0;
    let mouseYTexture = 0;

    let drawStartPos: Vector2 | undefined = undefined;
    let drawEndPos: Vector2 | undefined = undefined;

    const rects: Rect[] = [{ x: 256, y: 256, w: 128, h: 128 }];

    // Edge id is rect index * 4 (because 4 edges) + edge index.
    // Edge index is top bottom left right.
    // Makes it easier to group vertical and horizontal
    let hoveredEdge: number | undefined = undefined;
    let grabbedEdge: number | undefined = undefined;
    const selectedRectIdx = 0;

    let editMode = HotspotEditMode.Select;
    let showIds = false;

    function _drawLoop(): void {
        if (requestShutdown) return;
        requestAnimationFrame(_drawLoop);

        _update();
        _draw();
    }

    function _update(): void {
        mouseXTexture = _canvasToTextureSpaceX(mouseX);
        mouseYTexture = _canvasToTextureSpaceY(mouseY);

        if (editMode === HotspotEditMode.Select) {
            _updateSelect();
        } else if (editMode === HotspotEditMode.Draw) {
            _updateDraw();
        } else if (editMode === HotspotEditMode.Delete) {
            _updateDelete();
        }
    }

    function _updateSelect(): void {
        _updateGrabbedEdge();
        if (grabbedEdge !== undefined) {
            _updateGrab(grabbedEdge);
        }
    }
    function _updateDraw(): void {
        if (mouse1Pressed) {
            if (!drawStartPos) {
                drawStartPos = new Vector2(mouseXTexture, mouseYTexture).snapToGrid();
            } else {
                drawEndPos = new Vector2(mouseXTexture, mouseYTexture).snapToGrid();
            }
        } else if (drawStartPos && drawEndPos) {
            const newRect = createRect(drawStartPos, drawEndPos);
            if (newRect.w < 0 || newRect.h < 0) return;

            rects.push(newRect);
            drawStartPos = undefined;
            drawEndPos = undefined;
        }
    }
    function _updateDelete(): void {
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            const hovered = _isPointInAabb(mouseXTexture, mouseYTexture, rect.x, rect.y, rect.w, rect.h);
            if (hovered && mouse1Pressed) {
                rects.splice(i, 1);
                break;
            }
        }
    }

    function _updateGrab(edge: number): void {
        const edgeIdx = edge % EDGE_COUNT;

        const rectIdx = Math.floor(edge / EDGE_COUNT);
        const mx = snapNumber(Math.max(0, Math.min(mouseXTexture, texture?.width ?? canvasWidth)));
        const my = snapNumber(Math.max(0, Math.min(mouseYTexture, texture?.height ?? canvasHeight)));

        if (edgeIdx === 0) {
            const bottomEdgeY = rects[rectIdx].h + rects[rectIdx].y;
            rects[rectIdx].y = my;
            rects[rectIdx].h = bottomEdgeY - my;
        }
        if (edgeIdx === 1) {
            rects[rectIdx].h = my - rects[rectIdx].y;
        }
        if (edgeIdx === 2) {
            const rightEdgeX = rects[rectIdx].w + rects[rectIdx].x;
            rects[rectIdx].x = mx;
            rects[rectIdx].w = rightEdgeX - mx;
        }
        if (edgeIdx === 3) {
            rects[rectIdx].w = mx - rects[rectIdx].x;
        }
    }

    function _updateGrabbedEdge(): void {
        if (!mouse1Pressed) {
            hoveredEdge = undefined;
            grabbedEdge = undefined;
        }

        for (let rectIdx = 0; rectIdx < rects.length; rectIdx++) {
            const rect = rects[rectIdx];
            const edgeBase = rectIdx * EDGE_COUNT;
            const hoveredTop = _isPointInAabb(
                mouseXTexture,
                mouseYTexture,
                rect.x + _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT),
                rect.y - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT / 2),
                rect.w - _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT * 2),
                _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
            );
            if (hoveredTop) {
                hoveredEdge = edgeBase;
                if (mouse1Pressed) grabbedEdge = hoveredEdge;
                return;
            }

            const hoveredBottom = _isPointInAabb(
                mouseXTexture,
                mouseYTexture,
                rect.x + _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
                rect.y + rect.h - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT / 2),
                rect.w - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT * 2),
                _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
            );
            if (hoveredBottom) {
                hoveredEdge = edgeBase + 1;
                if (mouse1Pressed) grabbedEdge = hoveredEdge;
                return;
            }

            const hoveredLeft = _isPointInAabb(
                mouseXTexture,
                mouseYTexture,
                rect.x - _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT / 2),
                rect.y + _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
                _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT),
                rect.h - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT * 2),
            );
            if (hoveredLeft) {
                hoveredEdge = edgeBase + 2;
                if (mouse1Pressed) grabbedEdge = hoveredEdge;
                return;
            }

            const hoveredRight = _isPointInAabb(
                mouseXTexture,
                mouseYTexture,
                rect.x + rect.w - _canvasToTextureSpaceX(EDGE_SELECT_WEIGHT / 2),
                rect.y + _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
                _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT),
                rect.h - _canvasToTextureSpaceY(EDGE_SELECT_WEIGHT * 2),
            );
            if (hoveredRight) {
                hoveredEdge = edgeBase + 3;
                if (mouse1Pressed) grabbedEdge = hoveredEdge;
                return;
            }
        }
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

        for (let rectIdx = 0; rectIdx < rects.length; rectIdx++) {
            _drawRect(rects[rectIdx], rectIdx);
        }
    }

    function _drawRect(rect: Rect, rectIdx: number): void {
        const hoveredMiddle = _isPointInAabb(mouseXTexture, mouseYTexture, rect.x, rect.y, rect.w, rect.h);

        if (hoveredMiddle || hoveredEdge !== undefined) {
            if (editMode === HotspotEditMode.Select) {
                if (mouse1Pressed) {
                    ctx.fillStyle = "rgb(255 205 255 / 0.1)";
                } else {
                    ctx.fillStyle = "rgb(255 255 255 / 0.05)";
                }
            } else if (editMode === HotspotEditMode.Delete) {
                ctx.fillStyle = "rgb(255 100 100 / 0.5)";
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

        _drawRectEdges(
            rect,
            hoveredEdge == rectIdx * EDGE_COUNT,
            hoveredEdge == rectIdx * EDGE_COUNT + 1,
            hoveredEdge == rectIdx * EDGE_COUNT + 2,
            hoveredEdge == rectIdx * EDGE_COUNT + 3,
        );

        if (showIds) {
            _drawRectId(rect, rectIdx);
        }
    }

    function _drawRectId(rect: Rect, rectIdx: number): void {
        // Logger.debug(SharedLogChannel.Hotspot, "Drawing rect id", rectIdx);

        const rectMinSize = Math.min(
            70,
            rect.w > rect.h ? _textureToCanvasSpaceX(rect.w) : _textureToCanvasSpaceY(rect.h),
        );
        ctx.textAlign = "center";
        ctx.font = `${rectMinSize}px Inter`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgb(255 100 255 / 0.7)";
        const rectCenterX = _textureToCanvasSpaceX(rect.x + rect.w * 0.5);
        const rectCenterY = _textureToCanvasSpaceY(rect.y + rect.h * 0.5);
        ctx.fillText(`${rectIdx}`, rectCenterX, rectCenterY);
    }

    function _drawRectEdges(
        rect: Rect,
        hoveredTop: boolean,
        hoveredBottom: boolean,
        hoveredLeft: boolean,
        hoveredRight: boolean,
    ) {
        function applyEdgeDrawStyles(edgeHovered: boolean) {
            if (edgeHovered && editMode === HotspotEditMode.Select) {
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

    function updateTexture(src: string, width: number, height: number) {
        const img = new Image(width, height);
        img.src = src;
        texture = img;
    }

    function updateMouseX(x: number): void {
        mouseX = x;
    }
    function updateMouseY(y: number): void {
        mouseY = y;
    }
    function updateMouse1Pressed(pressed: boolean): void {
        mouse1Pressed = pressed;
    }
    function updateMouse2Pressed(pressed: boolean): void {
        mouse2Pressed = pressed;
    }
    function updateRealWidth(w: number): void {
        canvasWidth = w;
    }
    function updateRealHeight(h: number): void {
        canvasHeight = h;
    }
    function updateEditMode(mode: HotspotEditMode): void {
        editMode = mode;
    }
    function updateShowIds(shouldShowIds: boolean): void {
        showIds = shouldShowIds;
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
        updateEditMode,
        updateShowIds,
    };
}

export type HotspotEditor = ReturnType<typeof createHotspotEditor>;
