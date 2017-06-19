import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Composer from "./src/composer";
import { Container } from "native-base";

export default class App extends React.Component {
  render() {
    return (
      <Container>
        <Composer />
      </Container>
    );
  }
}
