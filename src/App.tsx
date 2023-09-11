import React, { useEffect, useState } from "react";
import "./App.css";
import DashboardDataTable from "./components/newTable";
import ResponsiveAppBar from "./components/header";
import Paper from "@mui/material/Paper";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://shy-cyan-cygnet-tam.cyclic.app/",
  cache: new InMemoryCache(),
});
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <ResponsiveAppBar />
        <header className="App-header">
          <Paper style={{ width: "80%" }}>
            <DashboardDataTable />
          </Paper>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
