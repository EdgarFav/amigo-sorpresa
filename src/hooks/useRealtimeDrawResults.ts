import { useState, useEffect } from 'react';
import { supabase, DrawResult } from '@/lib/supabase';

export function useRealtimeDrawResults(groupId: string) {
    const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!groupId) return;

        const fetchDrawResults = async () => {
            try {
                const { data, error } = await supabase
                    .from('draw_results')
                    .select('*')
                    .eq('group_id', groupId)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Error fetching draw results:', error);
                } else {
                    setDrawResults(data || []);
                }
            } catch (error) {
                console.error('Error fetching draw results:', error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch inicial
        fetchDrawResults();

        // Configurar subscription en tiempo real
        const channelName = `realtime-draw-results-${groupId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const subscription = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'draw_results',
                    filter: `group_id=eq.${groupId}`,
                },
                (payload) => {
                    console.log('🎯 Realtime draw result change:', {
                        event: payload.eventType,
                        new: payload.new,
                        old: payload.old,
                        groupId
                    });

                    if (payload.eventType === 'INSERT' && payload.new) {
                        console.log('➕ Adding new draw result:', payload.new);
                        const newResult = payload.new as DrawResult;
                        setDrawResults(current => {
                            // Evitar duplicados
                            if (current.find(r => r.id === newResult.id)) {
                                return current;
                            }
                            return [...current, newResult];
                        });
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        console.log('➖ Removing draw result:', payload.old);
                        setDrawResults(current => current.filter(result => result.id !== payload.old.id));
                    } else {
                        console.log('🔄 Fallback: refetching all draw results');
                        fetchDrawResults();
                    }
                }
            )
            .subscribe((status) => {
                console.log('📡 Draw results subscription status:', status, 'for group:', groupId);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Successfully subscribed to draw results changes');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Channel error for draw results subscription');
                } else if (status === 'TIMED_OUT') {
                    console.error('⏰ Draw results subscription timed out');
                }
            });

        return () => {
            console.log('🧹 Unsubscribing from realtime draw results for group:', groupId);
            supabase.removeChannel(subscription);
        };
    }, [groupId]);

    return { drawResults, loading };
}