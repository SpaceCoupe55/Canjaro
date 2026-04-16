import { supabase } from '../supabase'
import { normalizeRedemption } from './normalize'

export const redemptionsApi = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('redemptions')
      .select('*, partners(name, category, logo_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(normalizeRedemption)
  },

  async create(redemptionData) {
    const { data, error } = await supabase
      .from('redemptions')
      .insert({
        user_id: redemptionData.userId,
        partner_id: redemptionData.partnerId ?? null,
        type: redemptionData.type,
        tokens_spent: redemptionData.tokensSpent,
        cash_value: redemptionData.cashValue ?? null,
        currency: redemptionData.currency ?? 'GHS',
        notes: redemptionData.notes ?? null,
      })
      .select('*, partners(name, category, logo_url)')
      .single()
    if (error) throw error
    return normalizeRedemption(data)
  },

  async update(id, updates) {
    const dbUpdates = {}
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.usedAt !== undefined) dbUpdates.used_at = updates.usedAt

    const { data, error } = await supabase
      .from('redemptions')
      .update(dbUpdates)
      .eq('id', id)
      .select('*, partners(name, category, logo_url)')
      .single()
    if (error) throw error
    return normalizeRedemption(data)
  },
}
