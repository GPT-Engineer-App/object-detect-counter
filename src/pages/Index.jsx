import React, { useState } from 'react';
import { useFetchEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/integrations/supabase/index.js';
import Spinner from '@/components/ui/Spinner';

const Index = () => {
  const { data: events, error, isLoading } = useFetchEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '' });
  const [updateEventId, setUpdateEventId] = useState(null);
  const [updateEventData, setUpdateEventData] = useState({ name: '', date: '' });

  const handleCreateEvent = () => {
    createEvent.mutate(newEvent);
  };

  const handleUpdateEvent = () => {
    updateEvent.mutate({ id: updateEventId, ...updateEventData });
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id);
  };

  if (isLoading) return <Spinner size="md" className="mt-4" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-4">Event Management</h1>

      <div className="mb-4">
        <h2 className="text-2xl mb-2">Create Event</h2>
        <input
          type="text"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          className="px-2 py-1 border rounded mr-2"
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="px-2 py-1 border rounded mr-2"
        />
        <button
          onClick={handleCreateEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl mb-2">Update Event</h2>
        <input
          type="number"
          placeholder="Event ID"
          value={updateEventId}
          onChange={(e) => setUpdateEventId(e.target.value)}
          className="px-2 py-1 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Event Name"
          value={updateEventData.name}
          onChange={(e) => setUpdateEventData({ ...updateEventData, name: e.target.value })}
          className="px-2 py-1 border rounded mr-2"
        />
        <input
          type="date"
          value={updateEventData.date}
          onChange={(e) => setUpdateEventData({ ...updateEventData, date: e.target.value })}
          className="px-2 py-1 border rounded mr-2"
        />
        <button
          onClick={handleUpdateEvent}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Update
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl mb-2">Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.id} className="mb-2">
              {event.name} - {event.date}
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;