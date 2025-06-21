export function base64ImageUrl(data: string, format: string = "png"): string {
    return `data:image/${format};base64,${data}`;
}
