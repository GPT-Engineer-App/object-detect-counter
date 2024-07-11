import React, { useState } from 'react';
import Spinner from '@/components/ui/Spinner';

const Index = () => {
  const [loading, setLoading] = useState(false);

  const handleDetection = () => {
    setLoading(true);
    // Simulate object detection process
    setTimeout(() => {
      setLoading(false);
      // Handle detection result here
    }, 3000);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-4">Object Detection App</h1>
      <button
        onClick={handleDetection}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start Detection
      </button>
      {loading && <Spinner size="md" className="mt-4" />}
    </div>
  );
};

export default Index;