import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const Index = () => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]);

  const handleFileChange = (event) => {
    setMedia(URL.createObjectURL(event.target.files[0]));
    setDetections([]);
  };

  const handleDetectObjects = async () => {
    setLoading(true);
    const img = document.getElementById("uploaded-media");
    const model = await cocoSsd.load();
    const predictions = await model.detect(img);
    setDetections(predictions);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Object Detection and Counting App</h1>
        <p className="text-lg">Upload an image or video to detect and count objects</p>
      </header>
      <section className="mb-8">
        <Input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        <Button onClick={handleDetectObjects} className="ml-4">Detect Objects</Button>
      </section>
      <section className="mb-8">
        {media && (
          <div className="relative">
            <img id="uploaded-media" src={media} alt="Uploaded media" className="mx-auto object-cover w-full h-[400px]" />
            {loading && <Spinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
            {detections.map((detection, index) => (
              <div
                key={index}
                className="absolute border border-red-500"
                style={{
                  left: `${detection.bbox[0]}px`,
                  top: `${detection.bbox[1]}px`,
                  width: `${detection.bbox[2]}px`,
                  height: `${detection.bbox[3]}px`,
                }}
              >
                <span className="bg-red-500 text-white text-xs">{detection.class}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Detected Objects</h2>
        <ul>
          {detections.map((detection, index) => (
            <li key={index} className="mb-2">
              {detection.class}: {detection.score.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Index;