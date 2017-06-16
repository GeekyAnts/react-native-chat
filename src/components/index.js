import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, AsyncStorage } from "react-native";
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
  Spinner,
  Header,
  Left,
  Right,
  Body,
  Icon,
  Title,
  List,
  ListItem
} from "native-base";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import io from "socket.io-client";
import feathers from "feathers/client";
import hooks from "feathers-hooks";
import socketio from "feathers-socketio/client";
import authentication from "feathers-authentication-client";
import { compose } from "react-komposer";

const API_URL = "http://localhost:3030";

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

const token = "";

class GeekChat extends Component {
  static token = "";
  static propTypes() {
    return {
      appUsers: PropTypes.arrayOf(PropsTypes.object)
    };
  }
  static defaultProps() {
    return {
      appUsers: []
    };
  }

  renderRow = ({ item }) => {
    return (
      <View>
        <Text>{item.displayName}</Text>
      </View>
    );
  };

  navigate = (bool, name, selectedUserId) => {
    this.props.setState({
      isChatWindow: bool,
      displayName: name,
      selectedUserId: selectedUserId
    });
  };

  renderWindow = () => {
    if (this.props.state.isChatWindow) {
      const uniqueRoomName = `${this.props.state.currentUserId}_${this.props.state.selectedUserId}`;
      const reverseUniqueName = `${this.props.state.selectedUserId}_${this.props.state.currentUserId}`;
      return (
        <ChatWindow
          feathersApp={feathersApp}
          appId={this.props.appId}
          reverseName={reverseUniqueName}
          roomName={uniqueRoomName}
          currentUserId={this.props.state.currentUserId}
        />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {this.props.appUsers.length
          ? <UserList
              appId={this.props.appId}
              appUsers={this.props.appUsers}
              appUsersOffline={[
                { id: "1", status: false, displayName: "Offline User" }
              ]}
              currentUserId={this.props.state.currentUserId}
              onPress={(bool, name, selectedUserId) =>
                this.navigate(bool, name, selectedUserId)}
            />
          : <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No users Online
              </Text>
            </View>}
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            {this.props.state.isChatWindow
              ? <Button
                  onPress={() => this.props.setState({ isChatWindow: false })}
                  transparent
                >
                  <Icon name="arrow-back" />
                </Button>
              : <View />}
          </Left>
          <Body>
            <Title>
              {this.props.state.isChatWindow
                ? this.props.state.displayName
                : "Users"}
            </Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.renderWindow()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, marginTop: 10 },
  emptyText: { textAlign: "center" }
});

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

fetchList = (props, onData) => {
  let state = {
    isChatWindow: false,
    displayName: "",
    selectedUserId: "",
    currentUserId: "bhavish1"
  };

  let setState = data => {
    state = _.extend(state, data);
    onData(null, chatProps);
  };

  const chatProps = {
    appUsers: [],
    uniqueKey: "bhavish1",
    appId: "594261f8b91d61efdf26d1db",
    state: state,
    setState: setState
  };

  feathersApp
    .authenticate(authData)
    .then(result => {
      feathersApp
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
  // setInterval(function() {
  //   chatProps.appUsers = [
  //     { _id: "1", status: true, displayName: "online User" },
  //     { _id: "2", status: true, displayName: "default User" },
  //     { _id: "3", status: false, displayName: "Offline User" }
  //   ];
  //   onData(null, chatProps);
  // }, 5000);
};

export default compose(fetchList, composerOptions)(GeekChat);
