<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="第一个wpa应用"/> -->
    <p style="font-size: 20px; font-weight: bold">大声朗读</p>
    <p style="margin-bottom: 30px; color: #999">
      基于微软 Edge 浏览器大声朗读功能开发的 PWA 应用
    </p>
    <!-- <textarea name="" id="" v-model="value" cols="30" rows="10"></textarea> -->
    <!-- <input id="rate" class="flex-fill" type="range" min="0.5" max="1.5" value="1" step="0.01"> -->
    <!-- <select id="voiceSelect" class="col-9"></select> -->
    <!-- <button id="play" @click="onClick">播放</button> -->
    <p class="text-lf pb5 fweight-bold letter2 pl5 mt30">B站直播间 ID</p>
    <a-row type="flex" justify="space-between" align="middle">
      <a-col :span="17">
        <a-input
            placeholder="直播间ID"
            :value="roomId"
            @input="onInputRoomId"
        >
        </a-input>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" @click="onConnect">连接</a-button>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" @click="onDisconnect">断开</a-button>
      </a-col>
    </a-row>

    <p class="text-lf pb5 fweight-bold letter2 pl5 mt30">读出内容</p>
    <a-row type="flex" justify="space-between" align="middle" class="pb10">
      <a-col class="flex-wrap">
        <p class="text-lf fweight-bold letter2 pl5 pb10" style="margin-right:10px;">弹幕</p>
        <a-switch :checked="readDanmu" @change="onChangeDanmu"/>
      </a-col>
      <a-col class="flex-wrap">
        <p class="text-lf fweight-bold letter2 pl5 pb10" style="margin-right:10px;">礼物</p>
        <a-switch :checked="readGift" @change="onChangeGift"/>
      </a-col>
      <a-col class="flex-wrap">
        <p class="text-lf fweight-bold letter2 pl5 pb10" style="margin-right:10px;">欢迎</p>
        <a-switch :checked="readWelcome" @change="onChangeWelcome"/>
      </a-col>
    </a-row>

    <a-row type="flex" justify="space-between" align="middle" class="pb5 pt20">
      <a-col :span="24">
        <div class="text-lf">
          <span class="text-lf fweight-bold letter2 pl5">弹幕朗读概率</span>
          <span class="letter2 pl10" style="color:#999;font-size:12px">当前 {{ readRate }} %</span>
        </div>

        <div style="padding-left: 10px" touch-action="none">
          <a-slider
              :step="1"
              :min="0"
              :max="100"
              @change="onReadRateSlider"
              :included="false"
              :default-value="readRate"
          />
        </div>
      </a-col>
    </a-row>

    <a-textarea
        style="margin-top: 10px"
        placeholder="已经朗读的弹幕"
        :value="readTextLog"
        @input="onInputReadTextLog"
        class="a-textarea"
        :rows="8"
    >
    </a-textarea>

    <a-textarea
        style="margin-top: 10px"
        placeholder="输入需要测试朗读的文字"
        :value="inputText"
        @input="onInput"
        class="a-textarea"
        :rows="1"
    >
    </a-textarea>

    <p class="text-lf pb5 fweight-bold letter2 pl5 mt30">选择语音</p>
    <a-row type="flex" justify="space-between" align="middle">
      <a-col :span="18">
        <a-select
            @select="onSelect"
            :default-value="defaultSelect"
            :value="selectIdx"
            style="width: 100%"
        >
          <a-select-option v-for="(item, index) in voices" :key="index">
            {{ item.displayName }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-button type="primary" id="play" @click="onClick">播放</a-button>
        <!-- <a-button type="primary" @click="test">恢复</a-button> -->
        <!-- <a-button type="primary" @click="voiceResume">暂停</a-button> -->
      </a-col>
      <!-- <a-col :span="3">
        <a-switch default-checked checked-children="录" un-checked-children="" @change="onChange" />
      </a-col> -->
    </a-row>

    <a-row type="flex" justify="space-between" align="middle" class="pb5 pt10 mt20">
      <a-col :span="24">
        <div class="text-lf">
          <span class="fweight-bold letter2 pl5">播放速度 (rate)</span>
          <span class="letter2 pl10" style="color:#999;font-size:12px">{{ rateValue }} 倍速</span>
        </div>
        <div style="padding-left: 10px" touch-action="none">
          <a-slider
              :marks="rateMarks"
              :step="0.25"
              :min="minRate"
              :max="maxRate"
              @change="onRateSlider"
              :included="false"
              :default-value="rateValue"
          />
          <!-- <RedoOutlined /> -->
        </div>
      </a-col>
    </a-row>

    <a-row type="flex" justify="space-between" align="middle" class="pb5 pt20">
      <a-col :span="24">
        <div class="text-lf">
          <span class="text-lf fweight-bold letter2 pl5">音调调整 (pitch)</span>
          <span class="letter2 pl10" style="color:#999;font-size:12px">当前{{ pitchValue }}</span>
        </div>

        <!-- <a-slider id="test" v-model="value1" :disabled="disabled" /> -->
        <div style="padding-left: 10px" touch-action="none">
          <a-slider
              :marks="pitchMarks"
              :step="0.1"
              :min="minPitch"
              :max="maxPitch"
              @change="onPitchSlider"
              :included="false"
              :default-value="pitchValue"
          />
        </div>
      </a-col>
    </a-row>

    <!--    <a-row type="flex" justify="space-between" align="middle" class="pb10">-->
    <!--      <a-col class="flex-wrap">-->
    <!--        <p class="text-lf fweight-bold letter2 pl5 pb10" style="margin-right:10px;">开启录音 (record)</p>-->
    <!--        <a-switch :checked="recordStatus" @change="onChange"/>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
    <a class="link" @click="push">查看 Github 项目源码</a>
  </div>
</template>
<style scoped>
.a-textarea {
  box-shadow: inset 0px 1px 4px #ececec;
  -moz-box-shadow: inset 0px 1px 10px #ececec;
  -webkit-box-shadow: inset 0px 1px 10px #ececec;
}

.ant-slider-handle {
  background-color: #999 !important;
  border: solid 4px #333 !important;
}

.link {
  font-size: 14px;
  margin-top: 40px;
  color: #999;
  letter-spacing: 1px;
}
</style>

<script>
/* eslint-disable no-unused-vars */
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import { Button, Slider, Select } from 'ant-design-vue';

import pako from 'pako';

const textEncoder = new TextEncoder('utf-8');
const textDecoder = new TextDecoder('utf-8');

const readInt = function (buffer, start, len) {
  let result = 0
  for (let i = len - 1; i >= 0; i--) {
    result += Math.pow(256, len - i - 1) * buffer[start + i]
  }
  return result
}

const writeInt = function (buffer, start, len, value) {
  let i = 0
  while (i < len) {
    buffer[start + i] = value / Math.pow(256, len - i - 1)
    i++
  }
}

const encode = function (str, op) {
  let data = textEncoder.encode(str);
  let packetLen = 16 + data.byteLength;
  let header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1]
  writeInt(header, 0, 4, packetLen)
  return (new Uint8Array(header.concat(...data))).buffer
}
const decode = function (blob) {
  return new Promise(function (resolve) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let buffer = new Uint8Array(e.target.result)
      let result = {}
      result.packetLen = readInt(buffer, 0, 4)
      result.headerLen = readInt(buffer, 4, 2)
      result.ver = readInt(buffer, 6, 2)
      result.op = readInt(buffer, 8, 4)
      result.seq = readInt(buffer, 12, 4)
      if (result.op === 5) {
        result.body = []
        let offset = 0;
        while (offset < buffer.length) {
          let packetLen = readInt(buffer, offset, 4)
          let headerLen = 16 // readInt(buffer,offset + 4,4)
          let data = buffer.slice(offset + headerLen, offset + packetLen);
          let body = '';
          try {
            // pako可能无法解压
            body = textDecoder.decode(pako.inflate(data));
          } catch (e) {
            body = textDecoder.decode(data)
          }

          if (body) {
            // 同一条 message 中可能存在多条信息，用正则筛出来
            // eslint-disable-next-line no-control-regex
            const group = body.split(/[\x00-\x1f]+/);
            group.forEach(item => {
              try {
                const parsedItem = JSON.parse(item);
                if (typeof parsedItem === 'object') {
                  result.body.push(parsedItem);
                } else {
                  // 这里item可能会解析出number
                  // 此时可以尝试重新用pako解压data（携带转换参数）
                  // const newBody = textDecoder.decode(pako.inflate(data, {to: 'String'}))
                  // 重复上面的逻辑，筛选可能存在的多条信息
                  // 初步验证，这里可以解析到INTERACT_WORD、DANMU_MSG、ONLINE_RANK_COUNT
                  // SEND_GIFT、SUPER_CHAT_MESSAGE
                }
              } catch (e) {
                // 忽略非 JSON 字符串，通常情况下为分隔符
              }
            });
          }

          offset += packetLen;
        }
      } else if (result.op === 3) {
        result.body = {
          count: readInt(buffer, 16, 4)
        };
      }
      resolve(result)
    }
    reader.readAsArrayBuffer(blob);
  });
}

var synth = window.speechSynthesis;
var matches;
var utterThis;
var ws;
var intervalId;

// userName, giftName, num, timeoutId
let giftMessageQueue = [];

let filters = [
  /^www$/,
  // 全文不包含中文英文数字，可能是颜文字
  /^[^\w\u4e00-\u9fa5]+$/
];

function filterDanmu(message) {
  return message.length < 2 || filters.some(exp => message.match(exp));
}

function optimizeDanmu(message) {
  return message.replace(/(?<!\d)233+(?!\d)/g, function (s) {
    return "二".padEnd(s.length - 1, "三")
  })
}

// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('./sw.js')
//   .then(resolve =>{
//     console.log('⛳️ -> sw注册成功!');
//   }, reject => {
//     console.log(reject)
//   })

// }

export default {
  name: "Home",
  components: {
    // AButton: Button,
    // ASlider: Slider,
    // ASelect: Select
  },
  data() {
    return {
      voices: [],
      value: "",
      value1: 20,
      disabled: false,
      defaultSelect: "选择朗读语言类型",
      speedSelect: "x1",
      inputText: "",
      readTextLog: "",
      roomId: 10921,
      selectIdx: 0,
      selectVoice: {},

      // 语音倍速
      rateValue: 1.25,
      minRate: 0.5,
      maxRate: 2,
      rateMarks: {
        0.5: "缓慢",
        0.75: "",
        1: "常规",
        1.25: "",
        1.5: "",
        1.75: "",
        2: "快",
      },

      readRate: 100,

      // 音调高低
      pitchValue: 1,
      minPitch: 0,
      maxPitch: 2,
      pitchMarks: {
        0: "",
        2: "",
      },
      recordStatus: false,
      readDanmu: true,
      readGift: false,
      readWelcome: false,
    };
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
    this.populateVoiceList();
    this.checkBrowser();
    if (localStorage.roomId) {
      this.roomId = localStorage.roomId;
    }
  },
  watch: {
    roomId(newRoomId) {
      localStorage.roomId = newRoomId;
    }
  },
  updated() {
  },
  beforeDestroy() {
  },
  methods: {
    // 获取语言支持
    populateVoiceList: function () {
      if (typeof speechSynthesis === "undefined") {
        return;
      }
      new Promise((resolve, reject) => {
        setTimeout(() => {
          let voices = speechSynthesis.getVoices();

          resolve(voices);
        }, 0);
      }).then((voices) => {
        this.voices = voices
            .map((c) => {
              if (c.name.startsWith("Google ")) {
                c.displayName = c.name.replace(/^Google /, "");
              } else if (c.name.startsWith("Microsoft")) {

                matches = c.name.match(/^Microsoft (.+) Online.*- (.+)/);
                // c.displayName = `${matches[2]} - ${matches[1]}`;
                c.displayName = c.name
              } else {
                c.displayName = c.name;
              }
              return c;
            })
            .sort(function (a, b) {
              let aName = a.displayName.replace(/^.+-/, "");
              let bName = b.displayName.replace(/^.+-/, "");
              return aName.localeCompare(bName);
            });
        this.selectIdx = Math.max(0, this.voices.findIndex((c) => c.displayName.includes("Xiaoxiao")));
      });
    },
    test() {
      synth.resume()
      this.$message.success('继续播放');
    },
    onClick() {
      if (!this.inputText || this.inputText.length === 0) {
        return;
      }

      this.speak(this.inputText);
    },
    onConnect() {
      if (ws) {
        ws.close();
        clearInterval(intervalId);
      }
      ws = new WebSocket('wss://broadcastlv.chat.bilibili.com/sub');
      ws.onopen = () => {
        console.log("connect roomid: " + this.roomId);
        ws.send(encode(JSON.stringify({
          roomid: parseInt(this.roomId)
        }), 7));
      };
      intervalId = setInterval(function () {
        ws.send(encode('', 2));
      }, 30000);
      ws.onmessage = async msgEvent => {
        const packet = await decode(msgEvent.data);
        switch (packet.op) {
          case 8:
            console.log('加入房间');
            break;
          case 3:
            // eslint-disable-next-line no-case-declarations
            const count = packet.body.count;
            console.log(`人气：${count}`);
            break;
          case 5:
            packet.body.forEach((msg) => {
              console.log(msg);
              switch (msg.cmd) {
                  // 普通弹幕
                case 'DANMU_MSG':
                  if (this.readDanmu) {
                    let userName = msg.info[2][1].replace(/_*bili_*/g, "");
                    let message = msg.info[1];
                    let text = `${userName}说: ${message}`;
                    if (this.readRate >= Math.round(Math.random() * 100)) {
                      if (filterDanmu(message)) {
                        console.log(`无意义被过滤的弹幕：${text}`);
                      } else {
                        text = optimizeDanmu(text);
                        this.speak(text);
                      }
                    } else {
                      console.log(`因为朗读概率忽略的弹幕：${text}`);
                    }
                  }
                  break;
                  // 醒目留言（我也不知道是啥东西）
                case 'SUPER_CHAT_MESSAGE':
                case 'SUPER_CHAT_MESSAGE_JPN':
                  if (this.readDanmu) {
                    let text = `收到来自${msg.data.user_info.uname}的醒目留言：${msg.data.message}`;
                    this.speak(text);
                  }
                  break;
                  // 礼物
                case 'SEND_GIFT':
                  if (this.readGift) {
                    let userName = msg.data.uname;
                    let giftName = msg.data.giftName;
                    let num = msg.data.num;
                    let text = `收到来自${userName}的${num}个${giftName}`;
                    let giftMessage = giftMessageQueue.find(e => e.userName === userName && e.giftName === giftName);
                    if (giftMessage) {
                      clearTimeout(giftMessage.timeoutId);
                      giftMessage.num += num;
                      text = `收到来自${userName}的${giftMessage.num}个${giftName}`;
                      console.log(`合并礼物信息：${text}`);
                    } else {
                      giftMessage = {
                        userName: userName,
                        giftName: giftName,
                        num: num
                      };
                      giftMessageQueue.push(giftMessage);
                    }
                    giftMessage.timeoutId = setTimeout(() => {
                      this.speak(text);
                      giftMessageQueue = giftMessageQueue.filter(e => e !== giftMessage);
                    }, 5000);
                  }
                  break;
                  // 上舰
                case 'GUARD_BUY':
                  // eslint-disable-next-line no-case-declarations
                  let text = `欢迎加入${msg.data.username}大航海`;
                  this.speak(text);
                  break;
                  // 欢迎老爷和舰长
                case 'WELCOME':
                  if (this.readWelcome) {
                    let text = `欢迎${msg.data.uname}`;
                    this.speak(text);
                  }
                  break;
                  // 此处省略很多其他通知类型
              }
            })
            break;
          default:
            console.log(packet);
        }
      };
    },
    onDisconnect(e) {
      if (ws) {
        ws.close();
        clearInterval(intervalId);
        synth.cancel();
      }
    },
    onReadRateSlider(e) {
      this.readRate = e;
    },
    onInput(e) {
      this.inputText = e.target.value;
    },
    onInputReadTextLog(e) {
      this.readTextLog = e.target.value;
    },
    onInputRoomId(e) {
      this.roomId = e.target.value;
    },
    // select 选中
    onSelect(index) {
      this.selectIdx = index;
    },
    speak(text) {
      let {
        voices,
        selectIdx,
        rateValue,
        pitchValue
      } = this;

      // if (filterDanmu(text)) {
      //   console.log("过滤弹幕" + text);
      //   return;
      // }
      //
      // text = optimizeDanmu(text);

      this.readTextLog = `${new Date().toLocaleTimeString()}\t${text}\n${this.readTextLog}`;

      utterThis = new SpeechSynthesisUtterance(text);
      utterThis.onstart = function (event) {
        console.log(`SpeechSynthesisUtterance.onstart: ${text}`);
      };
      utterThis.onerror = function (event) {
        console.error(`SpeechSynthesisUtterance.onerror: ${text}`);
      };
      utterThis.voice = voices[selectIdx]; // 设置说话的声音
      utterThis.pitch = pitchValue; // 设置音调高低
      utterThis.rate = rateValue; // 设置说话的速度
      synth.speak(utterThis);
    },
    onChange(value) {
      console.log("change: ", value);
      if (!this.recordStatus) {
        // 请求录音授权
        this.initRecorder()
      }
      this.recordStatus = !this.recordStatus
    },
    onChangeDanmu(value) {
      console.log("onChangeDanmu: ", value);
      this.readDanmu = !this.readDanmu
    },
    onChangeGift(value) {
      console.log("onChangeGift: ", value);
      this.readGift = !this.readGift
    },
    onChangeWelcome(value) {
      console.log("onChangeWelcome: ", value);
      this.readWelcome = !this.readWelcome
    },
    onChangeVoice(value) {
      console.log("onChangeVoice: ", value);
      this.selectVoice = value.displayName;
    },
    onAfterChange(value) {
      console.log("afterChange: ", value);
    },
    // 改变语音速度
    onRateSlider(e) {
      this.rateValue = e
    },
    // 改变音调高低
    onPitchSlider(e) {
      this.pitchValue = e
    },
    checkBrowser() {
      // console.log('userAgent: '+window.navigator.userAgent)
    },
    // 跳转至 github仓库地址
    push() {
      window.location.href = "https://github.com/demojameson/ReadAloud"
    },

    // 新建 MediaRecorder对象
    initRecorder() {
      const _this = this
      var constraints = window.constraints = {
        audio: true,
        video: false
      };
      navigator.mediaDevices.getUserMedia(constraints)
          .then(function (stream) {
            /* use the stream */
            _this.recorderFn(stream)
            console.log(stream)

          })
          .catch(function (err) {
            console.log(err)
            _this.recordStatus = false
            _this.$message.warning('🙅🏻‍♀️ 拒绝录音权限')
            /* handle the error */
          });
    },
    // 创建录音实例
    recorderFn(stream) {
      let mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      console.log('录音中...')

    },
  }
  ,
}
;
</script>
