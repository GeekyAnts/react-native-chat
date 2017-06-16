import React from "react";
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
      createdByAppUserId: props.currentUserId, // Bhavish
      type: "Text",
      content: messages[0].text
    };
    // Meteor.call("chatRoomMessage.save", messageObj);
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

fetchMessages = (props, onData) => {
  console.log(props);
  const chatProps = {
    appUsers: [],
    uniqueKey: "bhavish",
    appId: "594261f8b91d61efdf26d1db"
  };
  props.feathersApp
    .authenticate(authData)
    .then(result => {
      props.feathersApp
        .service("app-users")
        .find()
        .then(data => {
          chatProps.appUsers = data.data;
          onData(null, chatProps);
        })
        .catch(err => console.log("Create", err));
    })
    .catch(function(error) {
      console.error("Error authenticating!", error);
    });
};

export default compose(fetchMessages)(ChatWindow);
