import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actionCreatorFactory } from 'typescript-fsa';
import { useReducer, useMemo, useCallback, useEffect } from 'react';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var SpeechRecognitionStatus;

(function (SpeechRecognitionStatus) {
  SpeechRecognitionStatus["READY"] = "ready";
  SpeechRecognitionStatus["STOPPED"] = "stopped";
  SpeechRecognitionStatus["STARTED"] = "started";
  SpeechRecognitionStatus["ERROR"] = "error";
  SpeechRecognitionStatus["RESET"] = "reset";
})(SpeechRecognitionStatus || (SpeechRecognitionStatus = {}));

var SpeechRecognitionDisconnectType;

(function (SpeechRecognitionDisconnectType) {
  SpeechRecognitionDisconnectType["RESET"] = "RESET";
  SpeechRecognitionDisconnectType["STOP"] = "STOP";
})(SpeechRecognitionDisconnectType || (SpeechRecognitionDisconnectType = {}));

var createAction = /*#__PURE__*/actionCreatorFactory("SPEECH_RECOGNITION");
var setTranscript = /*#__PURE__*/createAction("SET_TRANSCRIPT");
var setStatus = /*#__PURE__*/createAction("SET_STATUS");
var setFinalTranscript = /*#__PURE__*/createAction("SET_FINAL_TRANSCRIPT");
var setInterimTranscript = /*#__PURE__*/createAction("SET_INTERIM_TRANSCRIPT");
var setPauseAfterDisconnect = /*#__PURE__*/createAction("SET_PAUSE_AFTER_DISCONNECT");

var initialState = {
  status: SpeechRecognitionStatus.READY,
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
  pauseAfterDisconnect: false
};
var speechRecognitionReducer = /*#__PURE__*/reducerWithInitialState(initialState)["case"](setTranscript, function (state, transcript) {
  return _extends(_extends({}, state), {}, {
    transcript: transcript
  });
})["case"](setPauseAfterDisconnect, function (state, pauseAfterDisconnect) {
  return _extends(_extends({}, state), {}, {
    pauseAfterDisconnect: pauseAfterDisconnect
  });
})["case"](setInterimTranscript, function (state, interimTranscript) {
  return _extends(_extends({}, state), {}, {
    interimTranscript: interimTranscript
  });
})["case"](setFinalTranscript, function (state, finalTranscript) {
  return _extends(_extends({}, state), {}, {
    finalTranscript: finalTranscript
  });
})["case"](setStatus, function (state, status) {
  return _extends(_extends({}, state), {}, {
    status: status
  });
});

var ERROR_NO_RECOGNITION_SUPPORT = "Speech recognition is not supported on this device";

var defaultOptions = {
  autoStart: false,
  continuous: false,
  interimResults: true,
  onResult: function onResult() {},
  onDisconnect: function onDisconnect() {},
  onStart: function onStart() {}
};

function concatTranscripts() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }

  return parts.map(function (t) {
    return t.trim();
  }).join(" ").trim();
}

function useSpeechRecognition(options) {
  if (options === void 0) {
    options = defaultOptions;
  }

  var _useReducer = useReducer(speechRecognitionReducer, initialState),
      _useReducer$ = _useReducer[0],
      status = _useReducer$.status,
      pauseAfterDisconnect = _useReducer$.pauseAfterDisconnect,
      interimTranscript = _useReducer$.interimTranscript,
      finalTranscript = _useReducer$.finalTranscript,
      transcript = _useReducer$.transcript,
      dispatch = _useReducer[1];

  var recognition = useMemo(function () {
    var BrowserSpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition);

    if (BrowserSpeechRecognition) {
      return new BrowserSpeechRecognition();
    } else {
      throw new Error(ERROR_NO_RECOGNITION_SUPPORT);
    }
  }, []);
  var disconnect = useCallback(function (disconnectType) {
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
  }, [recognition]);
  var resetTranscript = useCallback(function () {
    disconnect(SpeechRecognitionDisconnectType.RESET);
    dispatch(setTranscript(""));
    dispatch(setInterimTranscript(""));
    dispatch(setFinalTranscript(""));
  }, [disconnect]);
  var startListening = useCallback(function () {
    console.log("Running start listening");

    if (recognition && status !== SpeechRecognitionStatus.STARTED) {
      if (!recognition.continuous) {
        resetTranscript();
      }

      try {
        recognition.start();
        dispatch(setStatus(SpeechRecognitionStatus.STARTED));
      } catch (DOMException) {// Tried to start recognition after it has already started - safe to swallow this error
      }
    }
  }, [status, recognition, resetTranscript]);
  var stopListening = useCallback(function () {
    console.log("Running stop listening");
    disconnect(SpeechRecognitionDisconnectType.STOP);
    dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
  }, [disconnect]);
  var updateTranscript = useCallback(function (event) {
    console.log("updating transcript", event);
    var interim = "";
    var _final = "";

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        _final = concatTranscripts(_final, event.results[i][0].transcript);
      } else {
        interim = concatTranscripts(interim, event.results[i][0].transcript);
      }
    }

    dispatch(setTranscript(concatTranscripts(_final, interim)));
    dispatch(setInterimTranscript(interim));
    dispatch(setFinalTranscript(_final));

    if (options.onResult) {
      options.onResult(_final, interim);
    }
  }, [options]);
  var onRecognitionDisconnect = useCallback(function () {
    dispatch(setStatus(SpeechRecognitionStatus.STOPPED));

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
  var onRecognitionError = useCallback(function (_ref) {
    var error = _ref.error,
        message = _ref.message;
    console.log("Speech recognition error detected: " + error);
    console.log("Additional information: " + message);
  }, []);
  useEffect(function () {
    if (recognition) {
      recognition.continuous = options.continuous !== false;
      recognition.interimResults = options.interimResults;
      recognition.onresult = updateTranscript;
      recognition.onend = onRecognitionDisconnect;
      recognition.onerror = onRecognitionError;
    }
  }, [onRecognitionDisconnect, onRecognitionError, updateTranscript, recognition, options.continuous, options.interimResults]);
  useEffect(function () {
    if (recognition && options && options.autoStart) {
      startListening();
    }

    return function () {
      if (options && options.autoStart && status === SpeechRecognitionStatus.STARTED) {
        stopListening();
      }
    };
  }, [options, recognition, startListening, status, stopListening]);
  return {
    transcript: transcript,
    interimTranscript: interimTranscript,
    finalTranscript: finalTranscript,
    status: status,
    resetTranscript: resetTranscript,
    startListening: startListening,
    stopListening: stopListening
  };
}

export { defaultOptions, useSpeechRecognition };
//# sourceMappingURL=use-speech-recognition.esm.js.map
