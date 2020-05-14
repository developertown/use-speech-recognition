import * as React from "react";
import { PropsWithChildren } from "react";
import cn from "classnames";
import { useSpeechRecognition } from "../src";
import { SpeechRecognitionStatus } from "../src/types";

const Grid: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "100%", gridGap: "1rem" }}>{children}</div>
);

export const SpeechDisplay: React.FC<{}> = () => {
  const { listening, finalTranscript, status, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const color = cn({
    blue: status === SpeechRecognitionStatus.READY,
    green: status === SpeechRecognitionStatus.STARTED,
    orange: status === SpeechRecognitionStatus.STOPPED,
    red: status === SpeechRecognitionStatus.ERROR,
    black: status === SpeechRecognitionStatus.RESET,
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Speech Recognition</h1>

      <Grid>
        <div>
          <div className="status">
            Status: <span style={{ color }}>{status}</span>
          </div>
          <div className="is-listening">Listening?: {JSON.stringify(listening)}</div>
          <div className="result">
            Result:
            <div
              style={{
                border: "1px solid #bbb",
                borderRadius: "3px",
                width: "30rem",
                minHeight: "56px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#eee",
                padding: "1rem",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {finalTranscript}
            </div>
          </div>
        </div>

        <div>
          <button onClick={startListening}>Start Listening</button>
          <button onClick={stopListening}>Stop Listening</button>
          <button onClick={resetTranscript}>Reset Transcript</button>
        </div>
      </Grid>
    </div>
  );
};
