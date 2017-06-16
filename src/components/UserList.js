import React from "react";
import { StyleSheet, Text, View, SectionList } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Header,
  Left,
  Right,
  Body,
  Icon,
  Title,
  List,
  ListItem
} from "native-base";

export default (UserList = props => {
  keyExtractor = (item, index) => item._id;

  fetchChatWindow = item => {
    props.onPress(true, item.displayName, item._id);
  };

  renderRow = ({ item }) => {
    return (
      <ListItem
        id={item.id}
        onPress={() => {
          this.fetchChatWindow(item);
        }}
      >
        <Left>
          {item.status
            ? <View style={styles.statusView} />
            : <View style={styles.statusOffline} />}
        </Left>
        <Body>
          <Text>{item.displayName}</Text>
        </Body>
        <Right />
      </ListItem>
    );
  };

  sectionComponent = item => (
    <View style={{ backgroundColor: "#eee", padding: 3 }}>
      <Text>{item.key}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        renderSectionHeader={({ section }) => this.sectionComponent(section)}
        sections={[
          { data: props.appUsers, key: "Online" },
          { data: props.appUsersOffline, key: "Offline" }
        ]}
        style={{ flex: 1 }}
        keyExtractor={this.keyExtractor}
        renderItem={renderRow}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusView: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "green"
  },
  statusOffline: {
    height: 10,
    width: 10,
    borderRadius: 5,
    borderWidth: 0.5
  },
  buttons: {
    flexDirection: "row"
  }
});
