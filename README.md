A full fledged Chat package that comes with prebuilt backend integration and server hosting. So that you don't have to worry about anything.
Just install the package and start using it. 

### How to Install:

#### 1. Headover to the nativebase.io website and create an account

#### 2. Generate an App from the website and you will be given an `appId`

#### 3. Pass that appId as a prop to GeekChat as shown below in the example

## Example

#### 1. import the component: `import { GeekChat } from 'geek-chat';`

#### 2.
```
export default class App extends React.Component {

  handleData = (props) => {
    console.log(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <GeekChat handleData={this.handleData} isNewUser={false} appId="Your appId here" uniqueKey="uniqueKey for each user" displayName="name of that user" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Props

- **`isNewUser`** _(bool)_ - Set to true if it's a new user [creates a new user in backend]
       Requires: `uniqueKey` and `displayName` props.
- **`uniqueKey`** _(String)_ - Give the unique Key for that user [to identify each user at backend]
- **`displayName`** _(String)_ - Give a unique name for that user to be displayed in App.
- **`handleData`** _(func)_ - function to handle/Check backend response and errors.
