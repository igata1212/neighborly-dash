import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Request = Database['public']['Tables']['requests']['Row'];

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial requests
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRequests([payload.new as Request, ...requests]);
          } else if (payload.eventType === 'UPDATE') {
            setRequests(
              requests.map((r) =>
                r.id === (payload.new as Request).id ? (payload.new as Request) : r
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRequests(requests.filter((r) => r.id !== (payload.old as Request).id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const addRequest = async (request: Database['public']['Tables']['requests']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([request])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error adding request:', error);
      throw error;
    }
  };

  const updateRequest = async (id: string, updates: Database['public']['Tables']['requests']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  };

  const cancelRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error canceling request:', error);
      throw error;
    }
  };

  return {
    requests,
    loading,
    addRequest,
    updateRequest,
    cancelRequest,
  };
}
