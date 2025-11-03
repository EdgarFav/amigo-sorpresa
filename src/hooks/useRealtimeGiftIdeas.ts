import { useState, useEffect } from 'react';
import { supabase, GiftIdea } from '@/lib/supabase';

export function useRealtimeGiftIdeas(groupId: string, memberId?: string) {
    const [giftIdeas, setGiftIdeas] = useState<GiftIdea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!groupId) return;

        const fetchGiftIdeas = async () => {
            try {
                let query = supabase
                    .from('gift_ideas')
                    .select('*')
                    .eq('group_id', groupId)
                    .order('created_at', { ascending: false });

                // Si se especifica memberId, filtrar por ese miembro
                if (memberId) {
                    query = query.eq('member_id', memberId);
                }

                const { data, error } = await query;

                if (error) {
                    console.error('Error fetching gift ideas:', error);
                } else {
                    console.log('🎁 Realtime gift ideas loaded:', data?.length, 'ideas found', memberId ? `for member ${memberId}` : 'for all members');
                    setGiftIdeas(data || []);
                }
            } catch (error) {
                console.error('Error fetching gift ideas:', error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch inicial
        fetchGiftIdeas();

        // Configurar subscription en tiempo real
        let channelName = `realtime-gift-ideas-${groupId}`;
        let filter = `group_id=eq.${groupId}`;

        if (memberId) {
            channelName += `-member-${memberId}`;
            filter += `,member_id=eq.${memberId}`;
        }

        // Hacer el canal único para evitar conflictos
        channelName += `-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        const subscription = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'gift_ideas',
                    filter: filter,
                },
                (payload) => {
                    console.log('🎁 Realtime gift idea change:', {
                        event: payload.eventType,
                        new: payload.new,
                        old: payload.old,
                        groupId
                    });

                    if (payload.eventType === 'INSERT' && payload.new) {
                        console.log('➕ Adding new gift idea:', payload.new);
                        setGiftIdeas(current => {
                            const newIdea = payload.new as GiftIdea;
                            // Evitar duplicados
                            if (current.find(idea => idea.id === newIdea.id)) {
                                return current;
                            }
                            // Agregar al inicio (más recientes primero)
                            return [newIdea, ...current];
                        });
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        console.log('➖ Removing gift idea:', payload.old);
                        setGiftIdeas(current => current.filter(idea => idea.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE' && payload.new) {
                        console.log('🔄 Updating gift idea:', payload.new);
                        setGiftIdeas(current =>
                            current.map(idea =>
                                idea.id === payload.new.id ? payload.new as GiftIdea : idea
                            )
                        );
                    } else {
                        console.log('🔄 Fallback: refetching all gift ideas');
                        fetchGiftIdeas();
                    }
                }
            )
            .subscribe((status) => {
                console.log('📡 Gift ideas subscription status:', status, 'for group:', groupId);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Successfully subscribed to gift ideas changes');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Channel error for gift ideas subscription');
                } else if (status === 'TIMED_OUT') {
                    console.error('⏰ Gift ideas subscription timed out');
                }
            });

        return () => {
            console.log('🧹 Unsubscribing from realtime gift ideas for group:', groupId);
            supabase.removeChannel(subscription);
        };
    }, [groupId, memberId]);

    return { giftIdeas, loading };
}