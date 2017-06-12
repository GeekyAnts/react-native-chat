import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Meteor, { createContainer } from "react-native-meteor";
import { GiftedChat } from "react-native-gifted-chat";
import _ from "lodash";
// import { DDP } from 'meteor/ddp-client'

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
import UserList from "./src/components/UserList";
import ChatWindow from "./src/components/ChatWindow";

Meteor.connect("ws://api.react-native-chat.com/websocket");
// BHavish: Id: 3uGoJmtDB3H9rGfMw
const data = {
  email: "test@test.com",
  userType: "admin"
};

class App extends Component {
  static propTypes() {
    return {
      appUsers: PropTypes.arrayOf(PropsTypes.object),
    }
  }
  static defaultProps() {
    return {
      appUsers: [],
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      isChatWindow: false,
      displayName: "",
      selectedUserId: "",
      currentUserId: this.props.uniqueKey
    };
  }

  componentDidMount() {
    // if (this.props.uniqueKey === '') {
    //   alert('Error please check handleData func');
    // }
  }

  renderRow = ({ item }) => {
    return (
      <View>
        <Text>{item.displayName}</Text>
      </View>
    );
  };

  navigate = (bool, name, selectedUserId) => {
    this.setState({
      isChatWindow: bool,
      displayName: name,
      selectedUserId: selectedUserId
    });
  };

  renderWindow = () => {
    if (this.state.isChatWindow) {
      const uniqueRoomName = `${this.state.currentUserId}_${this.state.selectedUserId}`;
      const reverseUniqueName = `${this.state.selectedUserId}_${this.state.currentUserId}`;
      return <ChatWindow
        appId={this.props.appId}
        currentUserId={this.state.currentUserId}
        reverseName={reverseUniqueName}
        roomName={uniqueRoomName}
      />;
    }
    return (
      <View style={{ flex: 1 }}>
        {this.props.appUsers.length
          ? <UserList
            appId={this.props.appId}
            currentUserId={this.state.currentUserId}
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
      <Container style={{ alignSelf: 'stretch' }}>
        <Header>
          <Left>
            {this.state.isChatWindow
              ? <Button
                onPress={() => this.setState({ isChatWindow: false })}
                transparent
              >
                <Icon name="arrow-back" />
              </Button>
              : <View />}
          </Left>
          <Body>
            <Title>
              {this.state.isChatWindow ? this.state.displayName : "Users"}
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

export default createContainer(params => {
  let userKey = '';
  if (params.isNewUser) {
    if (params.displayName) {
      let authParams = {
        appId: params.appId,
        uniqueKey: params.uniqueKey,
        displayName: params.displayName,
        status: true,
      };
      Meteor.call('appUser.save', [authParams], (err, resp) => {
        if (resp) {
          if (resp.appExists) {
            params.handleData({ status: 'success' });
            userKey = params.uniqueKey;
          } else {
            params.handleData({ reason: 'appexists is false', status: 'error', error: 'AppId Dosen\'t exist' });
            userKey = '';
          }
        }
      });
    } else {
      params.handleData({ reason: 'appexists is false', status: 'error', error: 'Please Provide displayName' });
      userKey = '';
    }
  } else {
    const isUser = Meteor.collection("appUsers").find({ uniqueKey: params.uniqueKey });
    params.handleData({ status: 'success', data: isUser });
    userKey = params.uniqueKey;
  }

  Meteor.subscribe("appUsers", {}, function (resp) {
  });
  let users = Meteor.collection("appUsers").find({ appId: params.appId });
  if (params.uniqueKey) {
    _.remove(users, {
      uniqueKey: params.uniqueKey
    });
  }
  const appUsers = users;
  return {
    appUsers: appUsers,
    uniqueKey: userKey,
    appId: params.appId,
  };
}, App);
