import { useState, useEffect } from 'react';
import { supabase, Member } from '@/lib/supabase';
import { AuthService } from '@/lib/auth';

export function useRealtimeMembers(groupId: string) {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!groupId) return;

        // Identificador único para esta instancia del hook
        const hookId = `${AuthService.isHost() ? 'HOST' : 'PARTICIPANT'}-${Math.random().toString(36).substr(2, 9)}`;

        const fetchMembers = async () => {
            try {
                console.log(`🔍 [${hookId}] Fetching members for group:`, groupId);

                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .eq('group_id', groupId)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error(`❌ [${hookId}] Error fetching members:`, error);
                } else {
                    console.log(`✅ [${hookId}] Members loaded:`, data?.length, 'members');
                    setMembers(data || []);
                }
            } catch (error) {
                console.error(`❌ [${hookId}] Error fetching members:`, error);
            } finally {
                setLoading(false);
            }
        };

        // Fetch inicial
        fetchMembers();

        // Configurar subscription en tiempo real
        // Usar un canal único para cada instancia para evitar conflictos
        const channelName = `realtime-members-${groupId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        console.log(`📡 [${hookId}] Setting up subscription to channel:`, channelName);

        const subscription = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'members',
                    filter: `group_id=eq.${groupId}`,
                },
                (payload) => {
                    console.log(`🔄 [${hookId}] Realtime member change:`, {
                        event: payload.eventType,
                        new: payload.new,
                        old: payload.old,
                        groupId,
                        timestamp: new Date().toISOString()
                    });

                    if (payload.eventType === 'INSERT' && payload.new) {
                        console.log(`➕ [${hookId}] Adding new member:`, payload.new);
                        setMembers(current => {
                            const newMember = payload.new as Member;
                            // Evitar duplicados
                            if (current.find(m => m.id === newMember.id)) {
                                console.log(`⚠️ [${hookId}] Member already exists, skipping:`, newMember.id);
                                return current;
                            }
                            const updated = [...current, newMember];
                            console.log(`📝 [${hookId}] Updated members list:`, updated.length, 'total members');
                            return updated;
                        });
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        console.log(`➖ [${hookId}] Removing member:`, payload.old);
                        setMembers(current => current.filter(member => member.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE' && payload.new) {
                        console.log(`🔄 [${hookId}] Updating member:`, payload.new);
                        setMembers(current =>
                            current.map(member =>
                                member.id === payload.new.id ? payload.new as Member : member
                            )
                        );
                    } else {
                        console.log(`🔄 [${hookId}] Fallback: refetching all members`);
                        fetchMembers();
                    }
                }
            )
            .subscribe((status) => {
                console.log(`📡 [${hookId}] Members subscription status:`, status, 'for group:', groupId);
                if (status === 'SUBSCRIBED') {
                    console.log(`✅ [${hookId}] Successfully subscribed to members changes on channel:`, channelName);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error(`❌ [${hookId}] Channel error for members subscription`);
                } else if (status === 'TIMED_OUT') {
                    console.error(`⏰ [${hookId}] Members subscription timed out`);
                }
            });

        return () => {
            console.log(`🧹 [${hookId}] Unsubscribing from realtime members for group:`, groupId);
            supabase.removeChannel(subscription);
        };
    }, [groupId]);

    return { members, loading };
}