// Single place to change currency formatting if the target market isn't
// Nigeria/NGN — inferred from Paystack + "aso-ebi" in the requirements doc.
export function formatPrice(value: string | number) {
  return `₦${Number(value).toLocaleString()}`;
}
