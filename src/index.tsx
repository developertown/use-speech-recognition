import { speechRecognitionReducer, initialState } from "./reducer";
import { useEffect, useCallback, useReducer, useMemo } from "react";
import {
  SpeechRecognitionOptions,
  SpeechRecognitionUtils,
  SpeechRecognitionDisconnectType,
  SpeechRecognitionStatus,
} from "./types";

import {
  setPauseAfterDisconnect,
  setInterimTranscript,
  setFinalTranscript,
  setTranscript,
  setStatus,
  setError,
} from "./actions";
import { ERROR_NO_RECOGNITION_SUPPORT } from "./constants";

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
  const [
    { error, status, pauseAfterDisconnect, interimTranscript, finalTranscript, transcript },
    dispatch,
  ] = useReducer(speechRecognitionReducer, initialState);

  const recognition = useMemo(() => {
    const BrowserSpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition);

    if (BrowserSpeechRecognition) {
      return new BrowserSpeechRecognition();
    } else {
      throw new Error(ERROR_NO_RECOGNITION_SUPPORT);
    }
  }, []);

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
    dispatch(setError(undefined));
    dispatch(setTranscript(""));
    dispatch(setInterimTranscript(""));
    dispatch(setFinalTranscript(""));
  }, [disconnect]);

  const startListening = useCallback(() => {
    if (recognition && status !== SpeechRecognitionStatus.STARTED) {
      if (!recognition.continuous) {
        resetTranscript();
      }

      try {
        recognition.start();
        dispatch(setStatus(SpeechRecognitionStatus.STARTED));
      } catch (DOMException) {
        // Tried to start recognition after it has already started - safe to swallow this error
      }
    }
  }, [status, recognition, resetTranscript]);

  const stopListening = useCallback(() => {
    disconnect(SpeechRecognitionDisconnectType.STOP);
    dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
  }, [disconnect]);

  const updateTranscript = useCallback(
    (event: SpeechRecognitionEvent) => {
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
    if (pauseAfterDisconnect) {
      dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
    } else if (recognition) {
      if (recognition.continuous) {
        startListening();
      } else {
        dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
      }
    }
    dispatch(setPauseAfterDisconnect(false));
  }, [pauseAfterDisconnect, recognition, startListening]);

  const onRecognitionError = useCallback(({ error, message }) => {
    dispatch(setStatus(SpeechRecognitionStatus.ERROR));
    dispatch(setError(`${error}: ${message}`));
  }, []);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = options.continuous !== false;
      recognition.interimResults = options.interimResults;
      recognition.onresult = updateTranscript;
      recognition.onend = onRecognitionDisconnect;
      recognition.onerror = onRecognitionError;
    }
  }, [
    onRecognitionDisconnect,
    onRecognitionError,
    updateTranscript,
    recognition,
    options.continuous,
    options.interimResults,
  ]);

  useEffect(() => {
    if (recognition && options && options.autoStart) {
      startListening();
    }

    return () => {
      if (status === SpeechRecognitionStatus.STARTED) {
        stopListening();
      }
    };
  }, [options, recognition, startListening, status, stopListening]);

  return {
    error,
    transcript,
    interimTranscript,
    finalTranscript,
    status,
    resetTranscript,
    startListening,
    stopListening,
  };
}
