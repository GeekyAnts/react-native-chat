import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import _ from "lodash";
import { Container, Content, Spinner } from "native-base";
import GeekChat from "./components/index";
import io from "socket.io-client";
import feathers from "feathers/client";
import hooks from "feathers-hooks";
import socketio from "feathers-socketio/client";
import authentication from "feathers-authentication-client";
import { compose } from "react-komposer";

const API_URL = "http://10.0.1.38:3030?token=testing";

const data = {
  appId: "594261f8b91d61efdf26d1db",
  uniqueKey: "sparrow",
  status: false,
  displayName: "Sparrow"
};

const authData = {
  strategy: "local",
  appId: "594261f8b91d61efdf26d1db",
  uniqueKey: "panda"
};

const options = {
  transports: ["websocket"],
  pingTimeout: 3000,
  params: "bhavish",
  pingInterval: 5000
};

const socket = io(API_URL, options);
console.log(socket);
const feathersApp = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(
    authentication({
      storage: AsyncStorage // To store our accessToken
    })
  );

const composerOptions = {
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

fetchList = async (props, onData) => {
  const authenticate = await feathersApp.authenticate(authData);
  if (authenticate) {
    feathersApp.on("login", data => {
      console.log(data);
    });
    let state = {
      isChatWindow: false,
      displayName: "",
      appId: "594261f8b91d61efdf26d1db",
      selectedUserId: "",
      currentUserId: "bhavish1",
      uniqueRoomName: "",
      reverseUniqueName: ""
    };

    setState = data => {
      state = _.extend(state, data);
      onData(null, chatProps);
    };

    filterMessages = async roomID => {
      const query = {
        query: {
          chatRoomId: roomID
        }
      };

      let messageList = await feathersApp
        .service("app-chat-room-messages")
        .find(query);

      const transformedMessages = [];

      _.map(messageList.data, obj => {
        const messageObj = {};
        messageObj._id = obj._id; // currentID
        messageObj.text = obj.content;
        messageObj.createdAt = obj.createdAt;
        messageObj.user = {
          _id: obj.createdByAppUserId
        };
        transformedMessages.unshift(messageObj);
      });

      chatProps.appChatRoomMessages = transformedMessages;
      chatProps.chatRoomId = roomID;
      onData(null, chatProps);
    };

    fetchMessages = async () => {
      let chatRoomId = state.uniqueRoomName;
      const query = {
        query: {
          roomName: state.uniqueRoomName
        }
      };

      let findRoomId = await feathersApp.service("app-chat-rooms").find(query);

      if (findRoomId.total === 0) {
        const reverseQuery = {
          query: {
            roomName: state.reverseUniqueName
          }
        };

        chatRoomId = state.reverseUniqueName;
        let findReverseRoomId = await feathersApp
          .service("app-chat-rooms")
          .find(reverseQuery);
        if (findReverseRoomId.total === 0) {
          // create new room
          const chatRoom = {
            appId: state.appId,
            roomName: state.uniqueRoomName,
            createByAppUserId: state.currentUserId
          };
          const createdRoom = await feathersApp
            .service("app-chat-rooms")
            .create(chatRoom);
          chatRoomId = state.uniqueRoomName;
          chatProps.chatWindowProps = {
            appChatRoomMessages: [],
            chatRoomId: chatRoomId
          };
          onData(null, chatProps);
        } else {
          chatProps.appChatRoomMessages = [];
          chatProps.chatRoomId = chatRoomId;
          onData(null, chatProps);
        }
      } else {
        filterMessages(chatRoomId);
      }
    };

    var chatProps = {
      appUsers: [],
      appUsersOffline: [],
      feathersApp: feathersApp,
      uniqueKey: "bhavish1",
      appId: "594261f8b91d61efdf26d1db",
      appChatRoomMessages: [],
      chatRoomId: "",
      state: state,
      setState: setState,
      fetchMessages: fetchMessages
    };

    feathersApp
      .service("app-users")
      .find()
      .then(data => {
        chatProps.appUsers = data.data;
        onData(null, chatProps);
      })
      .catch(err => console.log("Create", err));

    feathersApp.service("app-chat-room-messages").on("created", msg => {
      if (msg.chatRoomId === chatProps.chatRoomId) {
        const messageObj = {};
        messageObj._id = msg._id; // currentID
        messageObj.text = msg.content;
        messageObj.createdAt = msg.createdAt;
        messageObj.user = {
          _id: msg.createdByAppUserId
        };
        chatProps.appChatRoomMessages = _.concat(
          messageObj,
          chatProps.appChatRoomMessages
        );
        onData(null, chatProps);
      }
    });
  }
};

export default compose(fetchList, composerOptions)(GeekChat);
