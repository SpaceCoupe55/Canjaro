import { supabase } from '../supabase'
import { normalizeDeposit } from './normalize'

export const depositsApi = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(normalizeDeposit)
  },

  async getByCollector(collectorId) {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('collector_id', collectorId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(normalizeDeposit)
  },

  async getByCollectionPoint(collectionPointId) {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('collection_point_id', collectionPointId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(normalizeDeposit)
  },

  async create(depositData) {
    const { data, error } = await supabase
      .from('deposits')
      .insert({
        user_id: depositData.userId,
        collector_id: depositData.collectorId ?? null,
        collection_point_id: depositData.collectionPointId ?? null,
        plastic_type: depositData.plasticType,
        weight_kg: depositData.weight,
        qr_code: depositData.qrCode ?? null,
        latitude: depositData.location?.lat ?? null,
        longitude: depositData.location?.lng ?? null,
        location_name: depositData.location?.address ?? null,
        notes: depositData.notes ?? null,
      })
      .select()
      .single()
    if (error) throw error
    return normalizeDeposit(data)
  },

  async update(id, updates) {
    const dbUpdates = {}
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.batchId !== undefined) dbUpdates.batch_id = updates.batchId
    if (updates.collectorId !== undefined) dbUpdates.collector_id = updates.collectorId
    if (updates.collectionPointId !== undefined) dbUpdates.collection_point_id = updates.collectionPointId

    const { data, error } = await supabase
      .from('deposits')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return normalizeDeposit(data)
  },
}
