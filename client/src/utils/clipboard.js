export async function copyToClipboard(text, successMsg = 'Copiado! ✅') {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            alert(successMsg);
        } else {
            // Fallback for non-secure contexts or older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                alert(successMsg);
            } catch (err) {
                window.prompt("Copie manualmente:", text);
            }
            document.body.removeChild(textArea);
        }
    } catch {
        window.prompt("Copie manualmente:", text);
    }
}
