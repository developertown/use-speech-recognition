import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BluetoothDisplay from 'bluetooth-display';

const App = () => {
  return (
    <div>
      <BluetoothDisplay />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
