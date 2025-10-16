import { AppDesign } from "~/design/AppDesign.js";

function writeTextAndToast(text: string) {
    window.electronAPI.clipboard.writeText(text);
    useToast().add({
        title: "Copied to clipboard",
        icon: AppDesign.Icons.Copy,
        color: "neutral",
    });
}

export default { writeTextAndToast };
