
export function validUsername(str: string) {
    return /^[\w_]{3,18}$/.test(str)
}
export function validPassword(str: string) {
    return /^[\w`~!@#$%^&*()_+-=\\\[\]{}:";'<>,./?]{6,18}$/.test(str)
}
export function validEmail(str: string) {
    return /^[\w_-]+@[\w.]+$/.test(str)
}