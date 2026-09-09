// Single place to change currency formatting if the target market isn't
// Nigeria/NGN — inferred from Paystack + "aso-ebi" in the requirements doc.
export function formatPrice(value: string | number) {
  return `₦${Number(value).toLocaleString()}`;
}

// A sale price only counts as "on sale" if it's set and actually cheaper
// than the regular price — guards against stale/invalid data silently
// showing a fake discount.
export function isOnSale(price: string | number, salePrice: string | number | null | undefined) {
  return salePrice != null && Number(salePrice) > 0 && Number(salePrice) < Number(price);
}

// The price a customer actually pays — the sale price when one is active,
// otherwise the regular price. Use this (not `price`) anywhere money is
// actually charged (cart, checkout).
export function effectivePrice(price: string | number, salePrice: string | number | null | undefined) {
  return isOnSale(price, salePrice) ? String(salePrice) : String(price);
}

export function discountPercent(price: string | number, salePrice: string | number) {
  return Math.round((1 - Number(salePrice) / Number(price)) * 100);
}
