// Audio recording component
import React, {useState, useRef, useEffect} from 'react';
import {IconButton} from "@mui/material";

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

const sampleRate = 8000;

// Get microphone image
const microphoneIcon = (
  <svg fill="#ffffff" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M425.818 709.983V943.41c0 293.551 238.946 532.497 532.497 532.497 293.55 0 532.496-238.946 532.496-532.497V709.983h96.818V943.41c0 330.707-256.438 602.668-580.9 627.471l-.006 252.301h242.044V1920H667.862v-96.818h242.043l-.004-252.3C585.438 1546.077 329 1274.116 329 943.41V709.983h96.818ZM958.315 0c240.204 0 435.679 195.475 435.679 435.68v484.087c0 240.205-195.475 435.68-435.68 435.68-240.204 0-435.679-195.475-435.679-435.68V435.68C522.635 195.475 718.11 0 958.315 0Z" fill-rule="evenodd"></path> </g></svg>
  );

interface AudioRecorderProps {
  // Handle audio as base64 16-bit LE PCM mono
  onAudioRecorded: (audioBase64: string) => void;
}

import Snackbar from '@mui/material/Snackbar';

const AudioRecorder: React.FC<AudioRecorderProps> = (
  { onAudioRecorded }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (isRecording){
            startRecording().then(r => console.log("Started audio recording"));
            setSnackbarMessage(
                <>
                    You can now speak to the model, please click the <MicOffIcon fontSize="small" /> button to stop.
                </>
            );

            setSnackbarOpen(true);
        }else{
            stopRecording();
            setSnackbarMessage('Your message is being processed');

            setSnackbarOpen(true);
            console.log("Stopped audio recording")
        }
    }, [isRecording]);

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
      
        <IconButton className="recordAudio"
                    sx={{
                        backgroundColor: "white",
                        opacity: '1',
                        '&:hover': {
                            backgroundColor: "whitesmoke"
                        }
                    }}
            onClick={() => {
                setIsRecording(!isRecording);
            }}>
            {isRecording ? (<MicOffIcon />) : (<MicIcon />)}
        </IconButton>
          <Snackbar
            open={snackbarOpen}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={3500}
            message={snackbarMessage}
            onClose={() => {setSnackbarOpen(false); setSnackbarMessage('')}}
          />
        </>
    );
  };

export default AudioRecorder;