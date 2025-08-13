export const fmtCurrency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
export const pctOff = (orig, disc) => Math.round(((orig - disc) / orig) * 100)