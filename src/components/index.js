import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, AsyncStorage } from "react-native";
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

export default class GeekChat extends Component {
  static appId = "";
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

  static setAppId = data => {
    GeekChat.appId = data;
  };

  static getAppId() {
    return GeekChat.appId;
  }

  renderRow = ({ item }) => {
    return (
      <View>
        <Text>{item.displayName}</Text>
      </View>
    );
  };

  navigate = (bool, name, selectedUserId) => {
    const uniqueRoomName = `${this.props.state.currentUserId}_${selectedUserId}`;
    const reverseUniqueName = `${selectedUserId}_${this.props.state.currentUserId}`;

    this.props.setState({
      isChatWindow: bool,
      displayName: name,
      selectedUserId: selectedUserId,
      uniqueRoomName: uniqueRoomName,
      reverseUniqueName: reverseUniqueName
    });
    this.props.fetchMessages();
  };

  renderWindow = () => {
    if (this.props.state.isChatWindow) {
      return (
        <ChatWindow
          feathersApp={this.props.feathersApp}
          appChatRoomMessages={this.props.appChatRoomMessages}
          chatRoomId={this.props.chatRoomId}
          appId={GeekChat.appId}
          reverseName={this.props.state.reverseUniqueName}
          roomName={this.props.state.uniqueRoomName}
          currentUserId={this.props.state.currentUserId}
        />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {this.props.appUsers.length
          ? <UserList
              appId={GeekChat.appId}
              appUsersOnline={this.props.appUsersOnline}
              appUsersOffline={this.props.appUsersOffline}
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
    if (this.props.error) {
      return (
        <Container>
          <Header />
          <Content>
            <Text>
              Error: {this.props.error}
            </Text>
          </Content>
        </Container>
      );
    }
    return (
      <Container>
        <Header>
          <Left>
            <Button
              onPress={() => {
                this.props.state.isChatWindow
                  ? this.props.setState({ isChatWindow: false })
                  : this.props.onBackPress();
              }}
              transparent
            >
              <Icon name="arrow-back" />
            </Button>
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
        <Content
          keyboardShouldPersistTaps="always"
          scrollEnabled={false}
          contentContainerStyle={{ flex: 1 }}
        >
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
