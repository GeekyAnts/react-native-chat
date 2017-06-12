import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import Meteor, { createContainer } from "react-native-meteor";
import { GiftedChat } from "react-native-gifted-chat";
import _ from "lodash";
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

const Screenheight = Dimensions.get("window").height - 64;

Meteor.connect("ws://10.0.1.38:3000/websocket");

ChatWindow = props => {
  const transformedMessages = [];
  messageTransformer = () => {
    _.map(props.appChatRoomMessages, obj => {
      const messageObj = {};
      messageObj._id = obj._id; // currentID
      messageObj.text = obj.content;
      messageObj.createdAt = obj.createdAt;
      messageObj.user = {
        _id: obj.createdByAppUserId
      };
      transformedMessages.unshift(messageObj);
    });
  };

  messageTransformer();

  onSend = (messages = []) => {
    const messageObj = {
      appId: props.appId,
      chatRoomId: props.chatRoomId,
      createdByAppUserId: props.currentUserId,
      type: "Text",
      content: messages[0].text
    };
    Meteor.call("chatRoomMessage.save", messageObj);
  };
  return (
    <View style={styles.container}>
      <GiftedChat
        messages={transformedMessages}
        keyboardShouldPersistTaps="always"
        onSend={this.onSend}
        user={{
          _id: props.currentUserId
        }}
      />
    </View>
  );
};

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

export default createContainer(params => {
  Meteor.subscribe("appChatRoomMessages");
  let chatRoomId = params.roomName;
  let findRoomId = Meteor.collection("appChatRooms").find({ roomName: params.roomName });
  if (findRoomId.length === 0) {
    let chatRoomId = params.reverseName;
    findRoomId = Meteor.collection("appChatRooms").find({ roomName: params.reverseName });
    if (findRoomId.length === 0) {
      // create new room
      const chatRoom = {
        appId: props.appId,
        roomName: params.roomName,
        createByAppUserId: props.currentUserId,
      };
      Meteor.call('chatroom.save', chatRoom);
      chatRoomId = params.roomName;
    }
  }
  return {
    appChatRoomMessages: Meteor.collection("appChatRoomMessages").find({ chatRoomId: chatRoomId }),
    chatRoomId: chatRoomId,
  };
}, ChatWindow);
