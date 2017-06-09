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

Meteor.connect("ws://10.0.1.38:3000/websocket");
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
      currentUserId: this.props.currentUserId
    };
  }

  componentDidMount() {
    if (!this.props.currentUserId) {
      let authParams = {
        appId: this.props.appId,
        displayName: _.get(this.props, 'displayName', 'Default USer'),
        status: true,
      };
      Meteor.call('appUser.save', [authParams], (err, resp) => {
        if (resp.appExists) {
          this.setState({ currentUserId: resp.userId });
        }
      });
    }
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
    const { appUsers, appChatRooms, currentUserId, appId } = this.props;
    return (
      <Container>
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
  Meteor.subscribe("appUsers", {}, function (resp) {
  });
  let users = Meteor.collection("appUsers").find({ appId: '9jzsnnDgTj5mX8xtH' });
  _.remove(users, {
    _id: "iJxbv4aZidTJEjLQS"
  });
  const appUsers = users;
  return {
    appUsers: appUsers,
    currentUserId: '',
    appId: '9jzsnnDgTj5mX8xtH',
  };
}, App);
