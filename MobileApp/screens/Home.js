import React, {Component} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  Provider,
  FAB,
  TextInput,
  IconButton,
  Colors,
  RadioButton,
} from 'react-native-paper';
import AddTranscation from '../components/AddTranscation';
import ViewCard from '../components/ViewCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      discription: '',
      amount: '',
      type: 'income',
      backData: [],
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      email: '',
    };
  }

  componentDidMount() {
    this.getAllData();
    this.getData();
  }

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('logins');
      console.log('Async store jsonValue: ' + JSON.parse(jsonValue).data.email);
      this.setState({
        email: JSON.parse(jsonValue).data.email,
      });
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  removeData = async () => {
    try {
      await AsyncStorage.removeItem('logins');
    } catch (e) {
      // remove error
    }

    console.log('Done.');
  };

  setVisible() {
    this.setState({
      visible: !this.state.visible,
    });
    console.log(this.state.visible);
  }

  addData(data) {
    console.log('clicked add data');
    fetch('http://192.168.1.4:3000/api/v1/incomeExpenseRoute/getAll', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => console.log(json));
  }

  getAllData() {
    fetch('http://192.168.1.4:3000/api/v1/incomeExpenseRoute/getAll', {
      method: 'POST',
      body: JSON.stringify({
        email: 'pasanabey1@gmail.com',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        this.setState({backData: json.data});
        this.setTotalIncome();
        this.setTotalExpense();
        this.setState({
          balance: this.state.totalIncome - this.state.totalExpense,
        });
      })
      .catch(console.error);
  }

  setTotalIncome() {
    this.state.backData.map((el, i) => {
      if (el.method == 'income') {
        this.setState({
          totalIncome: el.price + this.state.totalIncome,
        });
        // console.log('Total Income : ' + this.state.totalIncome);
      }
    });
  }

  setTotalExpense() {
    this.state.backData.map((el, i) => {
      if (el.method == 'expense') {
        this.setState({
          totalExpense: el.price + this.state.totalExpense,
        });
        // console.log('Total Income : ' + this.state.totalExpense);
      }
    });
  }

  addTranscation() {
    fetch('http://192.168.1.4:3000/api/v1/incomeExpenseRoute/add', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        description: this.state.discription,
        price: this.state.amount,
        method: this.state.type,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        this.getAllData();
        this.setState({
          discription: '',
          amount: '',
          type: 'income',
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      <Provider>
        <View style={styles.Head}>
          <Text style={{color: 'white'}}>Income Expense Tracker</Text>
          <IconButton
            icon="logout"
            color={Colors.red500}
            size={20}
            onPress={() => {
              this.removeData();
              this.props.navigation.navigate('Login');
            }}
          />
        </View>
        <ViewCard
          totIncome={this.state.totalIncome}
          totExpense={this.state.totalExpense}
          balance={this.state.balance}
        />

        <ScrollView>
          {this.state.backData.map((el, i) => (
            <AddTranscation
              key={el._id}
              name={el.description}
              price={el.price}
              id={el._id}
              reload={this.getAllData}
            />
          ))}
        </ScrollView>

        <Portal>
          <Modal
            visible={this.state.visible}
            onDismiss={this.setVisible.bind(this)}
            contentContainerStyle={styles.containerStyle}>
            <TextInput
              label="Description"
              value={this.state.discription}
              onChangeText={value => {
                this.setState({
                  discription: value,
                });
              }}
            />
            <TextInput
              label="Amount"
              value={this.state.amount}
              onChangeText={value => {
                this.setState({
                  amount: value,
                });
              }}
            />
            <View>
              <View>
                <Text>Income</Text>
                <RadioButton
                  style={{color: 'black'}}
                  value="Income"
                  status={
                    this.state.type === 'income' ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    this.setState({
                      type: 'income',
                    });
                  }}
                />
              </View>
              <View>
                <Text>Expense</Text>
                <RadioButton
                  style={{color: 'black'}}
                  value="Expense"
                  status={
                    this.state.type === 'expense' ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    this.setState({
                      type: 'expense',
                    });
                  }}
                />
              </View>
            </View>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => {
                console.log('Add clicked');
                this.addTranscation();
                this.setVisible();
              }}>
              Add
            </Button>
          </Modal>
        </Portal>
        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={this.setVisible.bind(this)}
        />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
  Head: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#34495e',
    paddingHorizontal: 5,
  },
});
