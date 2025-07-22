import { supabase } from '../lib/supabase'
import type { User, Service, Message } from '../lib/supabase'

// User operations
export const userService = {
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Service operations
export const serviceService = {
  async createService(serviceData: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAllServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getServicesByCategory(category: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async searchServices(searchTerm: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location_address.ilike.%${searchTerm}%`)
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  async updateService(id: string, updates: Partial<Service>) {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Message operations
export const messageService = {
  async sendMessage(messageData: Omit<Message, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getMessagesForUser(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(name, profile_image),
        receiver:users!messages_receiver_id_fkey(name, profile_image)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async markMessageAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Authentication with Supabase Auth
export const authService = {
  async signUp(email: string, password: string, userData: any) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (authError) throw authError
    
    if (authData.user) {
      // Create user profile
      const userProfile = await userService.createUser({
        ...userData,
        id: authData.user.id,
        joined_date: new Date().toISOString(),
        profile_image: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`
      })
      
      return { user: authData.user, profile: userProfile }
    }
    
    throw new Error('User creation failed')
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    if (data.user) {
      const profile = await userService.getUserById(data.user.id)
      return { user: data.user, profile }
    }
    
    throw new Error('Sign in failed')
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const profile = await userService.getUserById(user.id)
      return { user, profile }
    }
    
    return null
  }
}