import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://peachpuff-owl-187547.hostingersite.com/public/index.php/graphql", 
  cache: new InMemoryCache(),
});

export default client;
