import  { Component } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import AppRouter from "./router";
import Nav from "./components/navbar/Nav";
import './App.css';


class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Nav/>
        <AppRouter />
      </ApolloProvider>
    );
  }
}


export default App;
