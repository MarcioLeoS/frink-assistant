export const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .map((w) => w[0]!)
        .join('')
        .slice(0, 2)
        .toUpperCase();