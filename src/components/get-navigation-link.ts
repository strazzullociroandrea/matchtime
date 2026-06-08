export const getNavigationLink = (indirizzo: string) => {
    const query = encodeURIComponent(indirizzo);
    if (typeof window !== "undefined") {
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod|Macintosh/i.test(ua))
            return `maps://maps.apple.com/?q=${query}`;
        if (/Android/i.test(ua)) return `geo:0,0?q=${query}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}