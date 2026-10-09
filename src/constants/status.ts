// Order is the board's column order, left to right.
export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const

export type Status = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
}
