'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var typescriptFsaReducers = require('typescript-fsa-reducers');
var typescriptFsa = require('typescript-fsa');
var react = require('react');

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
  SpeechRecognitionStatus["ABORTED"] = "aborted";
})(SpeechRecognitionStatus || (SpeechRecognitionStatus = {}));

var SpeechRecognitionDisconnectType;

(function (SpeechRecognitionDisconnectType) {
  SpeechRecognitionDisconnectType["ABORT"] = "ABORT";
  SpeechRecognitionDisconnectType["RESET"] = "RESET";
  SpeechRecognitionDisconnectType["STOP"] = "STOP";
})(SpeechRecognitionDisconnectType || (SpeechRecognitionDisconnectType = {}));

var createAction = /*#__PURE__*/typescriptFsa.actionCreatorFactory("SPEECH_RECOGNITION");
var setTranscript = /*#__PURE__*/createAction("SET_TRANSCRIPT");
var setStatus = /*#__PURE__*/createAction("SET_STATUS");
var setFinalTranscript = /*#__PURE__*/createAction("SET_FINAL_TRANSCRIPT");
var setInterimTranscript = /*#__PURE__*/createAction("SET_INTERIM_TRANSCRIPT");
var setListening = /*#__PURE__*/createAction("SET_LISTENING");
var setPauseAfterDisconnect = /*#__PURE__*/createAction("SET_PAUSE_AFTER_DISCONNECT");

var initialState = {
  status: SpeechRecognitionStatus.READY,
  transcript: "",
  interimTranscript: "",
  finalTranscript: "",
  listening: false,
  pauseAfterDisconnect: false
};
var speechRecognitionReducer = /*#__PURE__*/typescriptFsaReducers.reducerWithInitialState(initialState)["case"](setTranscript, function (state, transcript) {
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
})["case"](setListening, function (state, listening) {
  return _extends(_extends({}, state), {}, {
    listening: listening
  });
});

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

  var BrowserSpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition);

  var _useReducer = react.useReducer(speechRecognitionReducer, initialState),
      _useReducer$ = _useReducer[0],
      listening = _useReducer$.listening,
      status = _useReducer$.status,
      pauseAfterDisconnect = _useReducer$.pauseAfterDisconnect,
      interimTranscript = _useReducer$.interimTranscript,
      finalTranscript = _useReducer$.finalTranscript,
      transcript = _useReducer$.transcript,
      dispatch = _useReducer[1];

  var recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : undefined;
  var disconnect = react.useCallback(function (disconnectType) {
    if (recognition) {
      switch (disconnectType) {
        case SpeechRecognitionDisconnectType.ABORT:
          dispatch(setStatus(SpeechRecognitionStatus.ABORTED));
          dispatch(setPauseAfterDisconnect(true));
          recognition.abort();
          break;

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
  var resetTranscript = react.useCallback(function () {
    disconnect(SpeechRecognitionDisconnectType.RESET);
    dispatch(setTranscript(""));
    dispatch(setInterimTranscript(""));
    dispatch(setFinalTranscript(""));
  }, [disconnect]);
  var startListening = react.useCallback(function () {
    if (recognition && !listening) {
      if (!recognition.continuous) {
        resetTranscript();
      }

      try {
        recognition.start();
      } catch (DOMException) {// Tried to start recognition after it has already started - safe to swallow this error
      }

      dispatch(setStatus(SpeechRecognitionStatus.STARTED));
      dispatch(setListening(true));
    }
  }, [listening, recognition, resetTranscript]);
  var stopListening = react.useCallback(function () {
    disconnect(SpeechRecognitionDisconnectType.STOP);
    dispatch(setStatus(SpeechRecognitionStatus.STOPPED));
    dispatch(setListening(false));
  }, [disconnect]);
  var abortListening = react.useCallback(function () {
    dispatch(setListening(false));
    disconnect(SpeechRecognitionDisconnectType.ABORT);
  }, [disconnect]);
  var updateTranscript = react.useCallback(function (event) {
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
  var onRecognitionDisconnect = react.useCallback(function () {
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
  var onRecognitionError = react.useCallback(function (_ref) {
    var error = _ref.error,
        message = _ref.message;
    console.log("Speech recognition error detected: " + error);
    console.log("Additional information: " + message);
  }, []);
  react.useEffect(function () {
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
    transcript: transcript,
    interimTranscript: interimTranscript,
    finalTranscript: finalTranscript,
    status: status,
    listening: listening,
    recognition: recognition,
    resetTranscript: resetTranscript,
    startListening: startListening,
    stopListening: stopListening,
    abortListening: abortListening
  };
}

exports.defaultOptions = defaultOptions;
exports.useSpeechRecognition = useSpeechRecognition;
//# sourceMappingURL=use-speech-recognition.cjs.development.js.map
