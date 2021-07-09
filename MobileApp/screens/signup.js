import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Title, TextInput, Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userState: true,
      showPassword: true,
      pass: 'Show',
    };
  }

  storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('logins', jsonValue);
      console.log('Saved Logins');
      this.props.navigation.navigate('Home');
      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  addData(data) {
    console.log('start signup-click');
    fetch('http://192.168.1.4:3000/api/v1/userRoute/registerUser', {
      method: 'POST',
      body: JSON.stringify({
        fName: this.state.firstName,
        lName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        userState: this.state.userState,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        // if (json.message == 'success') {
        //   console.log('New Data Saved');
        //   this.storeData(json);
        // }
        this.storeData(json); //Test
      })
      .catch(console.error);
    console.log('end signup-click');
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Title style={styles.textT}>Sign Up</Title>
        </View>
        <KeyboardAvoidingView style={styles.textF}>
          <TextInput
            label="First Name"
            value={this.state.firstName}
            onChangeText={value => {
              this.setState({
                firstName: value,
              });
            }}
          />
          <TextInput
            label="Last Name"
            value={this.state.lastName}
            onChangeText={value => {
              this.setState({
                lastName: value,
              });
            }}
          />
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
        </KeyboardAvoidingView>
        <Button
          style={styles.ButtonS}
          mode="contained"
          onPress={this.addData.bind(this)}>
          Sign Up
        </Button>
        <Button
          style={styles.ButtonS}
          mode="contained"
          onPress={() => this.props.navigation.navigate('Login')}>
          Back
        </Button>
      </ScrollView>
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
