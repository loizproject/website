export const useAmtToString = (amount: number) => {
  const res = amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // 2,046,430.00
  return res
}