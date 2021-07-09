import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {IconButton, Colors} from 'react-native-paper';

export default class AddTranscation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: '',
    };
  }

  componentDidMount() {
    this.setState({
      id: this.props.id,
    });
  }

  deleteTranscation() {
    fetch('http://192.168.1.4:3000/api/v1/incomeExpenseRoute/delete', {
      method: 'POST',
      body: JSON.stringify({
        id: this.props.id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        // Home.getAllData();
      })
      .catch(console.error);
  }

  render() {
    return (
      <View style={styles.main}>
        <Text>{this.props.name}</Text>
        <Text>{this.props.price}</Text>
        <IconButton
          icon="delete"
          color={Colors.red500}
          size={20}
          // onPress={this.deleteTranscation()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    borderColor: 'black',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 18,
  },
});
