// Audio recording component
import React, { useState, useRef } from 'react';

const sampleRate = 8000;

// Get microphone image
const microphoneIcon = (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 3C5 1.34315 6.34315 0 8 0C9.65685 0 11 1.34315 11 3V7C11 8.65685 9.65685 10 8 10C6.34315 10 5 8.65685 5 7V3Z" fill="#000000"></path> <path d="M9 13.9291V16H7V13.9291C3.60771 13.4439 1 10.5265 1 7V6H3V7C3 9.76142 5.23858 12 8 12C10.7614 12 13 9.76142 13 7V6H15V7C15 10.5265 12.3923 13.4439 9 13.9291Z" fill="#000000"></path> </g></svg>
  );

interface AudioRecorderProps {
  // Handle audio as base64 16-bit LE PCM mono
  onAudioRecorded: (audioBase64: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = (
  { onAudioRecorded }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);

    async function handleAudioBlob(blob: Blob)
    {
      console.log(`Got encoded audio of ${blob.size} bytes`);

      // Convert to 16-bit PCM
      const audioContext = new AudioContext();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Resample it
      console.log(`Got PCM audio of ${audioBuffer.length} bytes, ${audioBuffer.sampleRate} samples/sec`);
      const nChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length * sampleRate / audioBuffer.sampleRate;
      const offlineContext = new OfflineAudioContext(nChannels, length,
                                                     sampleRate);
      const bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(offlineContext.destination);
      bufferSource.start();
      const resampledBuffer = await offlineContext.startRendering();
      console.log(`Downsampled to ${resampledBuffer.length} bytes, ${resampledBuffer.sampleRate} samples/sec`);

      // Get raw data
      const rawData = resampledBuffer.getChannelData(0);
      const buffer = new ArrayBuffer(rawData.length * 2);
      const view = new DataView(buffer);

      // Convert float to int16, little-endian
      for (let i = 0; i < rawData.length; i++)
      {
        const s = Math.max(-1, Math.min(1, rawData[i]));
        // Convert to 16-bit integer and store in little-endian format
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      // Base64 it
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for(let i=0; i<len; i++)
        binary += String.fromCharCode(bytes[i]);

      const base64 = window.btoa(binary);
      onAudioRecorded(base64);
    }

    async function startRecording() {
      try {
        const mediaConstraints = { audio: true };
        const stream =
          await navigator.mediaDevices.getUserMedia(mediaConstraints);
        audioStreamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        // Array to store the audio chunks
        const audioChunks: BlobPart[] = [];

        // Event handler to store audio data when available
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        // When recording stops, save the audio data to state
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks);
          handleAudioBlob(audioBlob);
        };

        // Start recording
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }

    function stopRecording() {
      if (!mediaRecorderRef.current || !audioStreamRef.current) return;

      // Stop the media recorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all audio tracks to release the microphone
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    return (
      <>
      
        <button className="recordAudio" 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}>
          {microphoneIcon}
        </button></>
    );
  };

export default AudioRecorder;