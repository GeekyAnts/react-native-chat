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

const API_URL = "http://api.react-native-chat.com:3030?token=testing";

const options = {
  transports: ["websocket"],
  pingTimeout: 3000,
  params: "bhavish",
  pingInterval: 5000
};

const socket = io(API_URL, options);

const feathersApp = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(
    authentication({
      storage: AsyncStorage // To store our accessToken
    })
  );

export const createUser = async user => {
  const feathersUser = {
    appId: user.token,
    uniqueKey: user.uniqueKey,
    displayName: user.displayName,
    status: false,
    password: user.token
  };
  try {
    const udata = await feathersApp.service("app-users").create(feathersUser);
    return udata;
  } catch (error) {
    return error;
  }
};

export const setToken = data => {
  GeekChat.setAppId(data);
};

export const getToken = () => {
  return GeekChat.appId;
};

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
  ),
  errorHandler: err => (
    <Text style={{ color: "red" }}>
      {err.message}
    </Text>
  )
};

fetchList = async (props, onData) => {
  onBackPress = () => {
    props.onBackPress();
  };

  if (props.userData) {
    const authData = {
      strategy: "local",
      password: GeekChat.appId,
      uniqueKey: props.userData.uniqueKey
    };

    const authenticate = await feathersApp.authenticate(authData);
    if (authentication) {
      let state = {
        isChatWindow: false,
        displayName: props.userData.displayName,
        appId: GeekChat.appId,
        selectedUserId: "",
        currentUserId: props.userData._id,
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
        uniqueKey: props.userData.uniqueKey,
        appId: GeekChat.appId,
        appChatRoomMessages: [],
        chatRoomId: "",
        state: state,
        onBackPress: onBackPress,
        setState: setState,
        fetchMessages: fetchMessages
      };

      const appUsersQuery = {
        query: {
          appId: GeekChat.appId
        }
      };

      feathersApp
        .service("app-users")
        .find(appUsersQuery)
        .then(data => {
          const index = _.findIndex(data.data, {
            uniqueKey: authData.uniqueKey
          });
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

      // Event Listeners:

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

      feathersApp.service("app-users").on("created", newUser => {
        if (chatProps.appUsers.length > 0) {
          let updatedUsers = [];
          updatedUsers = chatProps.appUsers;
          updatedUsers.push(newUser);
          chatProps.appUsers = _.concat([], updatedUsers);
          chatProps.appUsersOnline = _.filter(chatProps.appUsers, {
            status: true
          });
          chatProps.appUsersOffline = _.filter(chatProps.appUsers, {
            status: false
          });

          onData(null, chatProps);
        } else {
          let singleUser = [];
          singleUser.push(newUser);
          chatProps.appUsers = _.concat([], singleUser);
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
  } else {
    onData(null, { error: "userData not Provided" });
  }

  return () => {
    clearInterval();
  };
};

export default compose(fetchList, composerOptions)(GeekChat);
