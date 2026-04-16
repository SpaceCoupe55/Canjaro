// Normalize Supabase DB row shapes to match the field names components expect

export const normalizeDeposit = (d) => ({
  id: d.id,
  userId: d.user_id,
  collectorId: d.collector_id,
  collectionPointId: d.collection_point_id,
  batchId: d.batch_id,
  weight: d.weight_kg,
  plasticType: d.plastic_type,
  tokensEarned: d.tokens_earned,
  tokenRate: 10,
  status: d.status,
  qrCode: d.qr_code,
  timestamp: d.created_at,
  location: d.latitude != null
    ? { lat: d.latitude, lng: d.longitude, address: d.location_name }
    : null,
  photos: d.photo_urls || [],
  notes: d.notes,
  // joined relation fields (present when fetched with select)
  userName: d.user?.full_name ?? null,
  collectorName: d.collector?.full_name ?? null,
})

export const normalizeBatch = (b) => ({
  id: b.id,
  collectorId: b.collector_id,
  collectionPointId: b.collection_point_id,
  totalDeposits: b.total_deposits,
  expectedWeight: b.expected_weight_kg,
  actualWeight: b.actual_weight_kg,
  weightDiscrepancy: b.weight_discrepancy_kg,
  status: b.status,
  createdAt: b.created_at,
  verifiedAt: b.verified_at,
  settledAt: b.settled_at,
  notes: b.notes,
  earnings: {
    expected: b.expected_weight_kg ? Math.round(b.expected_weight_kg * 10) : 0,
    actual: b.earnings_amount ?? 0,
    paid: b.status === 'settled',
  },
  route: b.route_info ?? {},
  // joined relation fields
  collectorName: b.collector?.full_name ?? null,
  collectionPointName: b.collection_point?.name ?? null,
})

export const normalizeRedemption = (r) => ({
  id: r.id,
  userId: r.user_id,
  partnerId: r.partner_id,
  type: r.type,
  tokensSpent: r.tokens_spent,
  cashValue: r.cash_value,
  partner: r.partners
    ? { id: r.partner_id, name: r.partners.name, category: r.partners.category, logo: r.partners.logo_url }
    : null,
  voucherCode: r.voucher_code,
  status: r.status,
  expiresAt: r.expires_at,
  usedAt: r.used_at,
  redeemedAt: r.created_at,
})

export const normalizeNotification = (n) => ({
  id: n.id,
  userId: n.user_id,
  type: n.type,
  title: n.title,
  message: n.message,
  timestamp: n.created_at,
  read: n.is_read,
  metadata: n.metadata,
})

export const normalizeProfile = (p) => ({
  id: p.id,
  email: p.email,
  name: p.full_name,
  phone: p.phone,
  role: p.role,
  tokenBalance: p.token_balance,
  verified: p.is_verified,
  joinDate: p.created_at,
  address: {
    street: p.address,
    city: p.city,
    country: p.country,
  },
  statistics: {
    totalWeight: parseFloat(p.total_plastic_kg) || 0,
    totalTokensEarned: p.total_tokens_earned || 0,
    environmentalImpact: {
      co2Saved: parseFloat(p.co2_saved_kg) || 0,
      waterSaved: (parseFloat(p.total_plastic_kg) || 0) * 20,
    },
  },
})

export const normalizePartner = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  description: p.description,
  logo: p.logo_url,
  tokenCost: p.token_cost,
  discountValue: p.discount_value,
  voucherValidityDays: p.voucher_validity_days,
})

export const normalizeCollectionPoint = (cp) => ({
  id: cp.id,
  profileId: cp.profile_id,
  name: cp.name,
  address: cp.address,
  city: cp.city,
  coordinates: cp.latitude != null ? { lat: cp.latitude, lng: cp.longitude } : null,
  operatingHours: cp.operating_hours,
  contact: cp.contact_phone,
  isActive: cp.is_active,
})
