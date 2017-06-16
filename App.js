import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GeekChat from "./src/components/index";
import { Container } from "native-base";

export default class App extends React.Component {
  render() {
    return (
      <Container>
        <GeekChat />
      </Container>
    );
  }
}
