A full fledged Chat package that comes with prebuilt backend integration and server hosting. So that you don't have to worry about anything.
Just install the package and start using it. 
# Just follow the below steps.

## How to Install:

### 1. Headover to the nativebase.io website and create an account

### 2. Generate an App from the website and you will be given an `appId`

### 3. Pass that appId as a prop to GeekChat as shown below in the example

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