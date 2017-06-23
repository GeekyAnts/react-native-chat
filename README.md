A full fledged Chat package that comes with prebuilt backend integration and server hosting. So that you don't have to worry about anything.
Just install the package and start using it. 

### How to Install:

#### 1. Headover to the [react-native-chat](https://react-native-chat.com) website and follow the steps.

#### 2. Generate an App Token from the website.

#### 3. Pass that app Token to GeekChat as shown below in the example (using setToken function)

## Example
You can see the example app for full reference [here](https://github.com/GeekyAnts/react-native-chat-example)


#### 1. `import { GeekChat, getToken, setToken, createUser } from 'geek-chat';`

#### 2.
```
export default class App extends React.Component {

  callMe = () => {
    // Your custom logic here
  };

  render() {
    return (
      <View style={styles.container}>
        <GeekChat userData={props.userData} onBackPress={callMe} />
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


## Create a User:
- **`createUser`** _(func)_ - function that creates a new user [ Can be used to create a custom login Component] 
  - Requires an object to be passed as a parameter.
  - Return the details of the created user. To be passed onto the chatApp.

#### Example: 

```
const userData = {
  token: "your app token",
  uniqueKey: 'users uniquekey',
  displayName: 'name to be displayed in the app'
};
const userDetails = await createUser(userData);
```


## Set Tokens:
- **`setToken`** _(func)_ - function to set the app Token. [just pass the token as a string in parameters.]
- **`getToken`** _(func)_ - function that returns the app token.

#### Example:
You can call these functions anywhere in your app. Ideally when your app starts/boots up.

```
setToken('Your App Token');
const appToken = getToken();
console.log(appToken);
```


## Props

- **`userData`** _(bool)_ - The user data as an object which you get from the createUser function.
       Requires: `uniqueKey`, `displayName` and `_id`.
- **`onBackPress`** _(func)_ - call your custom function when your need to exit from the chatApp.
