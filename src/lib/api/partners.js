import { supabase } from '../supabase'
import { normalizePartner, normalizeCollectionPoint } from './normalize'

export const partnersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data.map(normalizePartner)
  },
}

export const collectionPointsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('collection_points')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data.map(normalizeCollectionPoint)
  },

  async getByProfileId(profileId) {
    const { data, error } = await supabase
      .from('collection_points')
      .select('*')
      .eq('profile_id', profileId)
      .single()
    if (error) return null
    return normalizeCollectionPoint(data)
  },
}
