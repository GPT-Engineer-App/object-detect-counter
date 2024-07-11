import React, { useState } from 'react';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useEvents';
import Spinner from '@/components/ui/Spinner';

const Index = () => {
  const { data: events, error, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEventName, setNewEventName] = useState('');
  const [updateEventId, setUpdateEventId] = useState(null);
  const [updateEventName, setUpdateEventName] = useState('');

  const handleCreateEvent = () => {
    createEvent.mutate({ name: newEventName, date: new Date().toISOString().split('T')[0] });
    setNewEventName('');
  };

  const handleUpdateEvent = () => {
    updateEvent.mutate({ id: updateEventId, name: updateEventName });
    setUpdateEventId(null);
    setUpdateEventName('');
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
        <input
          type="text"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
          placeholder="New Event Name"
          className="px-4 py-2 border rounded mr-2"
        />
        <button
          onClick={handleCreateEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Event
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={updateEventName}
          onChange={(e) => setUpdateEventName(e.target.value)}
          placeholder="Update Event Name"
          className="px-4 py-2 border rounded mr-2"
        />
        <button
          onClick={handleUpdateEvent}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Update Event
        </button>
      </div>
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
            <button
              onClick={() => {
                setUpdateEventId(event.id);
                setUpdateEventName(event.name);
              }}
              className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;