<!-- template -->
<template>
  <div class="printOuter">
    <div id="printPage" ref="printSection" :class="!isNoWatermark ? 'watermark': ''" :style="{padding: (isProve ? '124px 80px' : (stubOut ? '20px 20px' : '40px 60px'))}" :detail="detailCon">
      <!-- 编号1---在标题上面 -->
      <div class="fileNumContainer">
        <p v-if="fileTopNum"><span class="fileNo">NO:</span> <span class="printConNumFontFamily">{{fileTopNum}}</span></p>
      </div>
      <!-- 大标题和小标题 -->
      <div class="bigTitle printConNumFontFamily" :class="[isProve ? 'bigTitleProveCss' : 'bigTitleDefault']">
        <!-- <h1 :class="[isProve ? 'proveCss printConNumFontFamily marginBottom' : 'default printConNumFontFamily']">{{firstTitle}}</h1> -->
        <h1 :class="[isProve ? 'proveCss printConNumFontFamily marginBottom' : (IOU ? 'iouMargin default printConNumFontFamily' : 'default printConNumFontFamily')]">{{firstTitle}}</h1>
        <h2 v-if="secondTitle" :class="[isProve ? 'proveCss printConNumFontFamily' : 'default printConNumFontFamily']">{{secondTitle}}</h2>
        <h2 v-else class="proveCss printConNumFontFamily secondTitleCenter"><input class="secondTitleInput" type="text" placeholder="手动输入标题..."></h2>
      </div>
      <!-- 编号2--在标题下面 -->
      <div class="fileNumContainer">
        <p v-if="fileNum"> <span class="fileNo">NO:</span> <span class="printConNumFontFamily">{{fileNum}}</span> </p>
      </div>
      <slot name="printContent"></slot>
      <slot name="printContentDispatch"></slot>
    </div>
  </div>
</template>

<script>
// const commonStyleUrl = '../assets/print.css';
// fileNum 文件号 /  firstTitle 一级标题  / secondTitle 二级标题

export default {
  name: 'TemplateOfPrint',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: [
    'fileNum',
    'fileTopNum',
    'firstTitle',
    'secondTitle',
    'isNoWatermark',
    'stubOut',
    'isProve',
    'IOU'
  ],

  data() {
    return {
      detailCon: JSON.parse(sessionStorage.getItem('loginData')).loginUser['orgName']
    }
  },

  //监听属性 类似于data概念
  computed: {},

  //监控data中的数据变化
  watch: {
    //obj:{
    //    handler:function(val,oldval){
    //
    //    },
    //    deep:true,//深度监听
    //}
  },

  //方法集合
  methods: {
    printFun() {
      let tagArr = document.getElementsByClassName('printOuter')[0].getElementsByTagName('*')
      ;[].forEach.call(tagArr, item => {
        // if(item.getAttribute("class")){
        let cssObj = document.defaultView.getComputedStyle(item, null)
        let mapObj = {
          display: 'display',
          // "width":"width",
          // "height":"height",
          // "line-height":"lineHeight",
          'font-size': 'fontSize',
          margin: 'margin',
          padding: 'padding',
          color: 'color',
          postion: 'position',
          border: 'border',
          'text-indent': 'textIndent',
          'text-align': 'textAlign',
          'box-sizing': 'boxSizing',
          background: 'background',
          float: 'float',
          'font-weight': 'fontWeight',
          overflow: 'overflow',
          'border-right': 'borderRight',
          'border-left': 'borderLeft'
        }
        for (let styleName in mapObj) {
          if (styleName === 'font-size') {
            item.style[styleName] =
              Number(cssObj[mapObj[styleName]].substr(0, cssObj[mapObj[styleName]].length - 2)) +
              'px'
          } else {
            item.style[styleName] = cssObj[mapObj[styleName]]
          }
        }
        // }
      })

      this.$print(this.$refs.printSection)
    },
    printOtherFun() {
      this.$print(this.$refs.printSection)
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},

  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},

  beforeCreate() {}, //生命周期 - 创建之前

  beforeMount() {}, //生命周期 - 挂载之前

  beforeUpdate() {}, //生命周期 - 更新之前

  updated() {}, //生命周期 - 更新之后

  beforeDestroy() {}, //生命周期 - 销毁之前

  destroyed() {}, //生命周期 - 销毁完成

  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped>
.printOuter {
  height: 100%;
  margin: 10px 0;
  overflow-y: auto;
  font-family: HWFS !important;
  box-sizing: border-box;
  padding: 0 125px;
}

#printPage {
  height: 100%;
  padding: 40px 70px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  font-family: HWFS;
}

.watermark::after {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  top: 20%;
  left: -50%;
  content: attr(detail);
  font-size: 36px;
  transform: rotate(50deg);
  color: rgba(250, 250, 250, 0.6);
  letter-spacing: 10px;
  z-index: -1;
}

/* 文件号 */
.fileNumContainer {
  overflow: hidden;
}
.fileNumContainer > p {
  float: right;
  color: red;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 10px;
}

.fileNo {
  font-size: 16px;
  margin-right: 15px;
  font-weight: 900;
}

/* 一级标题 和  二级标题 */
.bigTitleDefault {
  margin: 0 0 10px 0;
}
.bigTitle > h1,
.bigTitle > h2 {
  text-align: center;
  font-weight: bold;
}
/* 一级标题 和  二级标题--默认 */
.bigTitle > h1.default {
  font-size: 35px;
  margin: 0;
  color: #000;
}
.bigTitle > h2.default {
  font-size: 32px;
  letter-spacing: 26px;
  letter-spacing: 32px;
  text-indent: 1em;
  color: #000;
}

/* 一级标题、二级标题---证明 */
.bigTitleProveCss {
  margin: 20px 0;
}
.bigTitle > h1.proveCss {
  font-size: 37px;
  margin: 0 0 40px 0;
}
.bigTitle > h2.proveCss {
  font-size: 34px;
}

/*根据需求新增样式*/
.bigTitle > h1.marginBottom {
  margin-bottom: 50px;
  letter-spacing: 6.6px;
}

/* 二级标题空白时的样式 */
/* h2.secondTitleCenter {
  display: flex;
  justify-content: center;
} */
h2 > .secondTitleInput {
  font-weight: 700;
  width: 250px;
}

.bigTitle > h1.iouMargin {
  margin: 12px 0px 44px 0px;
  letter-spacing: 7px;
}
</style>