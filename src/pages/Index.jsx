import React, { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { useCreateEvent, useReadEvents, useUpdateEvent, useDeleteEvent } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const { data: events, isLoading: isLoadingEvents, refetch } = useReadEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { supabase } = useSupabase();

  useEffect(() => {
    const channel = supabase
      .channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, refetch]);

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      await createEvent.mutateAsync({ name: newEventName, date: new Date().toISOString() });
      setNewEventName('');
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (id) => {
    setLoading(true);
    try {
      await updateEvent.mutateAsync({ id, updates: { name: `${newEventName} (Updated)` } });
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading(true);
    try {
      await deleteEvent.mutateAsync(id);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-3xl mb-4">Object Detection App</h1>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="text"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder="New Event Name"
              className="mb-2"
            />
            <Button onClick={handleCreateEvent} className="w-full">
              Create Event
            </Button>
          </div>
          {loading && <Spinner size="md" className="mt-4" />}
          <div className="mt-8">
            <h2 className="text-2xl mb-4">Events</h2>
            {isLoadingEvents ? (
              <Spinner size="md" />
            ) : (
              <ul>
                {events?.map((event) => (
                  <li key={event.id} className="mb-2 flex justify-between items-center">
                    <span>{event.name} - {new Date(event.date).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleUpdateEvent(event.id)} variant="outline">
                        Update
                      </Button>
                      <Button onClick={() => handleDeleteEvent(event.id)} variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;