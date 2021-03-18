/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// const server = 'http://58.59.70.10:8100';
const server = 'http://192.168.1.184:8100';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 0, //未进行任何操作的状态值
      info: {},
    };
  }

  componentDidMount() {
    this.robot({
      msgtype: 'text',
      text: {
        content: '阀门监控报警:水压力异常', //聊天内容
      },
    });

    this.getInfo();
    this.time = setInterval(this.getInfo, 3000);
  }

  componentWillUnmount() {
    this.time && clearInterval(this.time);
  }

  robot(message) {
    var postData = JSON.stringify(message);
    console.log(message);
    var options = {
      method: 'POST',
      encoding: 'utf-8',
      headers: {
        'Content-Type': 'application/json',
      },
      body: postData,
    };
    fetch(
      'https://oapi.dingtalk.com/robot/send?access_token=8164ce51a7cddc9a67db6fb9c11a5e8ed5c7c2740b4fa022829b501f0ba70ad8',
      options,
    )
      .then(response => {
        // 获取到网络请求返回的对象
        response.json();
      })
      .then(json => {
        console.log('json', json);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  getInfo = () => {
    fetch(server + '/api/cashier/getInfo', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.success && responseJson.obj) {
          this.setState({info: responseJson.obj[0]});
        }
      })
      .catch(error => {
        ToastAndroid.show('网络异常', ToastAndroid.SHORT);
      });
  };

  sendOneStatus = () => {
    fetch(server + '/api/cashier/start', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.success) {
          ToastAndroid.show('开启成功', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(responseJson.msg, ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        console.log(error);
      });
  };

  sendTowStatus = () => {
    fetch(server + '/api/cashier/stop ', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.success) {
          ToastAndroid.show('关闭成功', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(responseJson.msg, ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        ToastAndroid.show('网络异常', ToastAndroid.SHORT);
        console.log(error);
      });
  };

  render() {
    const {
      ipressure,
      ipressureAlarm,
      p1Status,
      pressureTime,
      pumpTime,
    } = this.state.info;
    let show_ipressure = '',
      show_ipressureAlarm = '',
      show_p1Status = '',
      show_pressuretime = '',
      show_pumptime = '';
    if (ipressure) {
      show_ipressure = ipressure + ' Mpa';
    }
    if (ipressureAlarm) {
      show_ipressureAlarm = ipressureAlarm === '1' ? '报警' : '正常';
    }
    if (p1Status) {
      show_p1Status = p1Status === '1' ? '打开' : '关闭';
    }
    if (pressureTime) {
      show_pressuretime = pressureTime;
    }
    if (pumpTime) {
      show_pumptime = pumpTime;
    }

    return (
      <View>
        <View style={styles.top}>
          <Text style={styles.wordStyle}>阀门控制</Text>
        </View>

        <ImageBackground
          source={require('./image/330495-14022Q1461353.jpg')}
          style={styles.imageStyle}>
          <View style={styles.info_box}>
            <Text style={styles.label}>
              阀门状态：<Text style={styles.info}>{show_p1Status}</Text>
            </Text>
            <Text style={styles.label}>
              压力值：<Text style={styles.info}>{show_ipressure}</Text>
            </Text>

            <Text style={styles.label}>
              压力报警： <Text style={styles.info}>{show_ipressureAlarm}</Text>
            </Text>

            <Text style={styles.label}>
              阀门状态采集时间：<Text style={styles.info}>{show_pumptime}</Text>
            </Text>

            <Text style={styles.label}>
              压力采集时间：<Text style={styles.info}>{show_pressuretime}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.sendOneStatus()}>
            <Text style={styles.wordTowStyle}> 开启阀门</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonTow}
            onPress={() => this.sendTowStatus()}>
            <Text style={styles.wordThreeStyle}> 关闭阀门</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info_box: {
    marginTop: 10,
    marginLeft: 10,
  },
  label: {
    fontSize: 18,
    color: '#ccc',
  },
  info: {
    fontSize: 20,
    color: '#FFA500',
  },
  top: {
    width: width,
    backgroundColor: 'skyblue',
    height: 50,
  },
  wordStyle: {
    fontSize: 20,
    color: '#FFA500',
    textAlign: 'center',
    marginTop: 9,
  },
  imageStyle: {
    width: width,
    height: height - 50,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    marginTop: 130,
    marginLeft: 150,
  },
  wordTowStyle: {
    fontSize: 20,
    color: '#FFA500',
    textAlign: 'center',
    marginTop: 9,
  },
  buttonTow: {
    width: 200,
    height: 50,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    marginLeft: 150,
    marginTop: 80,
  },
  wordThreeStyle: {
    fontSize: 20,
    color: '#FFA500',
    textAlign: 'center',
    marginTop: 9,
  },
});
