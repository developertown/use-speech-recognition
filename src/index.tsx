import { speechRecognitionReducer, initialState } from "./reducer";
import { useEffect, useCallback, useReducer } from "react";
import {
  SpeechRecognitionOptions,
  SpeechRecognitionUtils,
  SpeechRecognitionDisconnectType,
  SpeechRecognitionStatus,
} from "./types";

import {
  setListening,
  setPauseAfterDisconnect,
  setInterimTranscript,
  setFinalTranscript,
  setTranscript,
  setStatus,
} from "./actions";

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    mozSpeechRecognition: unknown;
    msSpeechRecognition: unknown;
    oSpeechRecognition: unknown;
  }
}

export const defaultOptions: SpeechRecognitionOptions = {
  autoStart: false,
  continuous: false,
  interimResults: true,
  onResult: () => {},
  onDisconnect: () => {},
  onStart: () => {},
};

function concatTranscripts(...parts: string[]) {
  return parts
    .map((t) => t.trim())
    .join(" ")
    .trim();
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = defaultOptions): SpeechRecognitionUtils {
  const BrowserSpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition);

  const [
    { listening, status, pauseAfterDisconnect, interimTranscript, finalTranscript, transcript },
    dispatch,
  ] = useReducer(speechRecognitionReducer, initialState);

  const recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : undefined;

  const disconnect = useCallback(
    (disconnectType: SpeechRecognitionDisconnectType) => {
      if (recognition) {
        switch (disconnectType) {
          case SpeechRecognitionDisconnectType.RESET:
            dispatch(setStatus(SpeechRecognitionStatus.RESET));
            dispatch(setPauseAfterDisconnect(false));
            recognition.abort();
            break;
          case SpeechRecognitionDisconnectType.STOP:
          default:
            dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
            dispatch(setPauseAfterDisconnect(true));
            recognition.stop();
        }
      }
    },
    [recognition],
  );

  const resetTranscript = useCallback(() => {
    disconnect(SpeechRecognitionDisconnectType.RESET);
    dispatch(setTranscript(""));
    dispatch(setInterimTranscript(""));
    dispatch(setFinalTranscript(""));
  }, [disconnect]);

  const startListening = useCallback(() => {
    if (recognition && !listening) {
      if (!recognition.continuous) {
        resetTranscript();
      }
      try {
        recognition.start();
      } catch (DOMException) {
        // Tried to start recognition after it has already started - safe to swallow this error
      }
      dispatch(setStatus(SpeechRecognitionStatus.STARTED));
      dispatch(setListening(true));
    }
  }, [listening, recognition, resetTranscript]);

  const stopListening = useCallback(() => {
    disconnect(SpeechRecognitionDisconnectType.STOP);
    dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
    dispatch(setListening(false));
  }, [disconnect]);

  const updateTranscript = useCallback(
    (event: SpeechRecognitionEvent) => {
      console.log("updating transcript", event);
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final = concatTranscripts(final, event.results[i][0].transcript);
        } else {
          interim = concatTranscripts(interim, event.results[i][0].transcript);
        }
      }
      dispatch(setTranscript(concatTranscripts(final, interim)));
      dispatch(setInterimTranscript(interim));
      dispatch(setFinalTranscript(final));

      if (options.onResult) {
        options.onResult(final, interim);
      }
    },
    [options],
  );

  const onRecognitionDisconnect = useCallback(() => {
    dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
    if (pauseAfterDisconnect) {
      dispatch(setListening(false));
    } else if (recognition) {
      if (recognition.continuous) {
        startListening();
      } else {
        dispatch(setListening(false));
      }
    }
    dispatch(setPauseAfterDisconnect(false));
  }, [pauseAfterDisconnect, recognition, startListening]);

  const onRecognitionError = useCallback(({ error, message }) => {
    console.log("Speech recognition error detected: " + error);
    console.log("Additional information: " + message);
  }, []);

  useEffect(() => {
    if (recognition && !listening) {
      recognition.continuous = options.continuous !== false;
      recognition.interimResults = options.interimResults;
      recognition.onresult = updateTranscript;
      recognition.onend = onRecognitionDisconnect;
      recognition.onerror = onRecognitionError;
    }

    if (recognition && options && options.autoStart) {
      recognition.start();
      dispatch(setListening(true));
    }
  }, [listening, onRecognitionDisconnect, onRecognitionError, options, recognition, updateTranscript]);

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    status,
    listening,
    resetTranscript,
    startListening,
    stopListening,
  };
}
