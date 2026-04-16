import { supabase } from '../supabase'
import { normalizeBatch } from './normalize'

export const batchesApi = {
  async getByCollector(collectorId) {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('collector_id', collectorId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(normalizeBatch)
  },

  async getByCollectionPoint(collectionPointId) {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('collection_point_id', collectionPointId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(normalizeBatch)
  },

  async create(batchData) {
    const { data, error } = await supabase
      .from('batches')
      .insert({
        collector_id: batchData.collectorId,
        collection_point_id: batchData.collectionPointId ?? null,
        expected_weight_kg: batchData.expectedWeight ?? null,
        route_info: batchData.route ?? null,
        notes: batchData.notes ?? null,
      })
      .select()
      .single()
    if (error) throw error
    return normalizeBatch(data)
  },

  async update(id, updates) {
    const dbUpdates = {}
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.actualWeight !== undefined) dbUpdates.actual_weight_kg = updates.actualWeight
    if (updates.earningsAmount !== undefined) dbUpdates.earnings_amount = updates.earningsAmount
    if (updates.collectionPointId !== undefined) dbUpdates.collection_point_id = updates.collectionPointId
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes
    if (updates.verifiedBy !== undefined) dbUpdates.verified_by = updates.verifiedBy
    if (updates.verifiedAt !== undefined) dbUpdates.verified_at = updates.verifiedAt

    const { data, error } = await supabase
      .from('batches')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return normalizeBatch(data)
  },
}
