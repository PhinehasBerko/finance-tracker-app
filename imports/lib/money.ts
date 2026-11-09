export const money = new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' });

export const amount = (quantity: number, unitPrice: number) =>
  Math.round(quantity * unitPrice * 100)