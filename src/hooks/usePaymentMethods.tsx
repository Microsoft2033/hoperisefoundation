// src/hooks/usePaymentMethods.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PaymentMethodRecord } from '@/types/payment';

interface UsePaymentMethodsReturn {
  paymentMethods: PaymentMethodRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePaymentMethods = (adminMode = false): UsePaymentMethodsReturn => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('payment_methods')
          .select('*')
          .order('created_at', { ascending: true });

        // In admin mode fetch all, otherwise only enabled
        if (!adminMode) {
          query = query.eq('is_enabled', true);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setPaymentMethods(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [adminMode, refreshKey]);

  const refetch = () => setRefreshKey(k => k + 1);

  return { paymentMethods, loading, error, refetch };
};