import * as React from "react";
import * as ReactDOM from "react-dom";
import SubComponent from "./components/sub";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>h1: Hello React!</h1>
        <SubComponent name="My Counter for TypeScript"/>
      </div>
    );
  }
}

const myTheme = {
};

ReactDOM.render(
  <>
    <ZeitProvider theme={myTheme}>
      <CssBaseline/>
      <App/>
    </ZeitProvider>
  </>, document.getElementById("app"));