import { Provider} from "react-redux";
import store from "./store";
import React, { useEffect } from "react";
import "./App.css"

import AppRouter from "./routers/AppRouter";
import Alert from "./components/alert";
import KTComponents from "./helpers/AppComponents";



//import { LoadPluginsJs } from "./assets/plugins/global/plugins.bundle";

function App() {

  useEffect(() => { KTComponents.init(); }, []);
  return (
    <Provider store={store}>
      <Alert />
      <AppRouter />
    </Provider>
    
  );
}

export default App;
