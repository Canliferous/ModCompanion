function writeTextAndToast(text: string) {
    window.electronAPI.clipboard.writeText(text);
    useToast().add({
        title: "Copied to clipboard",
        icon: "tdesign:copy-filled",
        color: "neutral",
    });
}

export default { writeTextAndToast };
