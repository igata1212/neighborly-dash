import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Request = Database['public']['Tables']['requests']['Row'];

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const channel = supabase
      .channel('requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          const newRequest = payload.new as Request;
          const oldRequest = payload.old as Request;

          if (payload.eventType === 'INSERT') {
            setRequests((prev) => {
              if (prev.some((request) => request.id === newRequest.id)) {
                return prev;
              }
              return [newRequest, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setRequests((prev) => {
              const exists = prev.some((request) => request.id === newRequest.id);
              if (!exists) {
                return [newRequest, ...prev];
              }
              return prev.map((request) =>
                request.id === newRequest.id ? newRequest : request
              );
            });
          } else if (payload.eventType === 'DELETE') {
            setRequests((prev) => prev.filter((request) => request.id !== oldRequest.id));
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

      // Keep UI in sync even if realtime DELETE payload is delayed/missing.
      setRequests((prev) => prev.filter((request) => request.id !== id));
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
