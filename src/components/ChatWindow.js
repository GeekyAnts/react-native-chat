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

const transformedMessages = [];

export default class ChatWindow extends Component {
  constructor(props) {
    super(props);
    messageTransformer = () => {
      _.map(this.props.appChatRoomMessages, obj => {
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
  }

  onSend = (messages = []) => {
    const messageObj = {
      appId: this.props.appId,
      chatRoomId: this.props.chatRoomId,
      createdByAppUserId: this.props.currentUserId, // Bhavish
      type: "Text",
      content: messages[0].text
    };
    this.props.feathersApp.service("app-chat-room-messages").create(messageObj);
  };

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={transformedMessages}
          keyboardShouldPersistTaps="always"
          onSend={this.onSend}
          user={{
            _id: this.props.currentUserId
          }}
        />
      </View>
    );
  }
}

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

const composerOptions = {
  pure: true,
  loadingHandler: () => (
    <Container>
      <Content
        contentContainerStyle={{
          alignSelf: "stretch",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spinner />
      </Content>
    </Container>
  )
};

fetchMessages = async (props, onData) => {
  let chatRoomId = props.roomName;
  const query = {
    query: {
      roomName: props.roomName
    }
  };

  let findRoomId = await props.feathersApp
    .service("app-chat-rooms")
    .find(query);

  if (findRoomId.total === 0) {
    const reverseQuery = {
      query: {
        roomName: props.reverseName
      }
    };

    chatRoomId = props.reverseName;
    findRoomId = await props.feathersApp
      .service("app-chat-rooms")
      .find(reverseQuery);
    if (findRoomId.total === 0) {
      // create new room
      const chatRoom = {
        appId: props.appId,
        roomName: props.roomName,
        createByAppUserId: props.currentUserId
      };
      const createdRoom = await props.feathersApp
        .service("app-chat-rooms")
        .create(chatRoom);
      chatRoomId = props.roomName;
    }
  }

  const chatWindowProps = {
    appChatRoomMessages: [],
    chatRoomId: chatRoomId
  };
  onData(null, chatWindowProps);
};

compose(fetchMessages, composerOptions)(ChatWindow);
