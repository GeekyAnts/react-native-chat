import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import _ from "lodash";
import { Container, Content, Spinner } from "native-base";
import GeekChat from "./src/components/index";
import io from "socket.io-client";
import feathers from "feathers/client";
import hooks from "feathers-hooks";
import socketio from "feathers-socketio/client";
import authentication from "feathers-authentication-client";
import { compose } from "react-komposer";

const API_URL = "http://10.0.1.38:3030?token=testing";

const data = {
  appId: "59491db9407a3a2dbe7d8168",
  uniqueKey: "panda",
  status: false,
  displayName: "Panda"
};

const authData = {
  strategy: "local",
  password: "59491db9407a3a2dbe7d8168",
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
  if (authentication) {
    let state = {
      isChatWindow: false,
      displayName: "",
      appId: "594911997ba11e23a0271644",
      selectedUserId: "",
      currentUserId: "59491de3407a3a2dbe7d8169",
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
        chatRoomId = state.reverseUniqueName;
        const reverseQuery = {
          query: {
            roomName: state.reverseUniqueName
          }
        };

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
          filterMessages(chatRoomId);
        } else {
          filterMessages(chatRoomId);
        }
      } else {
        filterMessages(chatRoomId);
      }
    };

    var chatProps = {
      appUsers: [],
      appUsersOnline: [],
      appUsersOffline: [],
      feathersApp: feathersApp,
      uniqueKey: "panda",
      appId: "59491db9407a3a2dbe7d8168",
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
        const index = _.findIndex(data.data, { uniqueKey: authData.uniqueKey });
        const userList = data.data;
        userList.splice(index, 1);
        chatProps.appUsers = userList;
        chatProps.appUsersOnline = _.filter(chatProps.appUsers, {
          status: true
        });
        chatProps.appUsersOffline = _.filter(chatProps.appUsers, {
          status: false
        });
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

    feathersApp.service("app-users").on("patched", user => {
      if (chatProps.appUsers.length > 0) {
        const index = _.findIndex(chatProps.appUsers, { _id: user._id });
        let updatedUsers = [];
        updatedUsers = chatProps.appUsers;
        updatedUsers[index] = user;
        chatProps.appUsers = _.concat([], updatedUsers);
        chatProps.appUsersOnline = _.filter(chatProps.appUsers, {
          status: true
        });
        chatProps.appUsersOffline = _.filter(chatProps.appUsers, {
          status: false
        });

        onData(null, chatProps);
      }
    });
  }
};

export default compose(fetchList, composerOptions)(GeekChat);
