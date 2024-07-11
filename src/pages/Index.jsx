import React, { useState, useEffect } from 'react';
import Spinner from '@/components/ui/Spinner';
import { useCreateEvent, useReadEvents, useUpdateEvent, useDeleteEvent } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase';

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
    <div className="text-center">
      <h1 className="text-3xl mb-4">Object Detection App</h1>
      <input
        type="text"
        value={newEventName}
        onChange={(e) => setNewEventName(e.target.value)}
        placeholder="New Event Name"
        className="px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleCreateEvent}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Event
      </button>
      {loading && <Spinner size="md" className="mt-4" />}
      <div className="mt-8">
        <h2 className="text-2xl mb-4">Events</h2>
        {isLoadingEvents ? (
          <Spinner size="md" />
        ) : (
          <ul>
            {events?.map((event) => (
              <li key={event.id} className="mb-2">
                {event.name} - {new Date(event.date).toLocaleDateString()}
                <button
                  onClick={() => handleUpdateEvent(event.id)}
                  className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Index;