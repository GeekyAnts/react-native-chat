import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import _ from "lodash";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Spinner,
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
import { compose } from "react-komposer";

const Screenheight = Dimensions.get("window").height - 64;

export default (ChatWindow = props => {
  onSend = (messages = []) => {
    const messageObj = {
      appId: props.appId,
      chatRoomId: props.chatRoomId,
      createdByAppUserId: props.currentUserId,
      type: "Text",
      content: messages[0].text
    };
    props.feathersApp.service("app-chat-room-messages").create(messageObj);
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        keyboardShouldPersistTaps="handled"
        messages={props.appChatRoomMessages}
        onSend={onSend}
        user={{
          _id: props.currentUserId
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Screenheight
  },
  statusView: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "green"
  },
  buttons: {
    flexDirection: "row"
  }
});
