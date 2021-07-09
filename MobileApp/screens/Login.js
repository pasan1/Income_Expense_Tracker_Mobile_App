import React, {Component} from 'react';
import {View, StyleSheet, Pressable, KeyboardAvoidingView} from 'react-native';
import {Button, Title, TextInput, Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: true,
      pass: 'Show',
    };
  }

  componentDidMount() {
    if (this.getData() != undefined || this.getData() != null) {
      this.props.navigation.navigate('Home');
    }
  }

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('logins');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('logins', jsonValue);
      console.log('Saved Logins');
      this.setState({
        email: '',
        password: '',
      });
      this.props.navigation.navigate('Home');
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  checkData(data) {
    console.log('start login-click');
    fetch('http://192.168.1.4:3000/api/v1/userRoute/login', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        if (json.message == 'success') {
          this.storeData(json);
        }
      })
      .catch(console.error);
    console.log('end login-click');
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <Title style={styles.textT}>Login</Title>
        </View>
        <View style={styles.textF}>
          <TextInput
            label="Email"
            value={this.state.email}
            onChangeText={value => {
              this.setState({
                email: value,
              });
            }}
          />
          <TextInput
            label="Password"
            secureTextEntry={this.state.showPassword}
            value={this.state.password}
            onChangeText={value => {
              this.setState({
                password: value,
              });
            }}
          />
          <Pressable
            onPress={() => {
              this.setState({
                showPassword: !this.state.showPassword,
                pass: this.state.showPassword == true ? 'Hide' : 'Show',
              });
            }}>
            <Text style={{textAlign: 'right'}}>{this.state.pass} Password</Text>
          </Pressable>
        </View>
        <Button
          style={styles.ButtonS}
          mode="contained"
          // onPress={() => }
          onPress={this.checkData.bind(this)}>
          Login
        </Button>
        <Button
          style={styles.ButtonS}
          mode="contained"
          onPress={() => this.props.navigation.navigate('signup')}>
          Sign Up
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginTop: 50,
  },
  textF: {
    marginBottom: 20,
  },
  ButtonS: {
    padding: 5,
    margin: 5,
  },
});
