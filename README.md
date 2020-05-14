# use-speech-recognition
A react hook to easily use the WebSpeech Recognition API

## Usage

```tsx
// options
const defaultOptions = {
  autoStart: false,
  continuous: false,
  interimResults: true,
  onResult: (e: Event) => {},
  onDisconnect: (e: Event) => {},
  onStart: (e: Event) => {},
};

const {
  transcript,
  interimTranscript,
  finalTranscript,
  status,
  listening,
  resetTranscript,
  startListening,
  stopListening,
  abortListening,
} = useSpeechRecognition(options);
```
