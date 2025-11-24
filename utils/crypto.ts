
export async function generateSHA256(message: string) {
    try {
        if (!crypto.subtle) throw new Error("Crypto API not available");
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (e) {
        console.warn("Secure context required for crypto.subtle. Using fallback hash.");
        return "sha256_sim_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

export async function generateFileHash(file: File): Promise<string> {
    try {
        if (!crypto.subtle) throw new Error("Crypto API not available");
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (e) {
        console.warn("Secure context required for crypto.subtle. Using fallback hash.");
        // Fallback for non-secure demo environments
        return "sha256_file_fallback_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
