<!-- template -->
<template>
  <div class="outer">
    <!-- 档案转出弹层 -->
    <div class="proofModal">
      <a-modal centered title="现场开具证明" :visible="visible" :width="'90%'" @cancel="handleCancel" style="height:85%;overflow: hidden;" :maskClosable='false' :footer="null">
        <TableView :initArrData="initArr1" :totalCount="tableTotalNum1" @searchTable="getTableData1" :loading="tableLoading1">
          <div slot="tableAction" slot-scope="slotPropsData" class="actionStyle">

            <a-select v-if="String(slotPropsData.currRowdata.isInware) === '0'" v-model="slotPropsData.currRowdata.proofType" placeholder="请选择证明类型" allowClear class="actionSelect">
              <a-select-option v-for="(el, index) in proofTypes" :key="index" :value="el.itemCode">{{el.itemName}}</a-select-option>
            </a-select>
            <a v-if="String(slotPropsData.currRowdata.isInware) === '0'" href="javascript:;" class="primaryBtnColor" @click="printPreview(slotPropsData.currRowdata)">预览打印</a>
            <a v-if="String(slotPropsData.currRowdata.isInware) === '2'" href="javascript:;" class="canNotClickBtnColor">抱歉,档案已转出,不可进行打印操作</a>
            <a v-if="String(slotPropsData.currRowdata.isInware) !== '0' && String(slotPropsData.currRowdata.isInware) !== '2'" href="javascript:;" class="canNotClickBtnColor">请完成其他正在进行的操作后进行打印</a>

          </div>

        </TableView>

        <!-- 此处为打印预览模板开始 -->

        <!-- 打印弹层 -->
        <div class="printEditModal">
          <a-modal centered title="预览打印" :visible="printVisiable" @cancel="cancelPrint" :width="'80%'" style="height:95%;overflow: hidden;" :maskClosable='false'>
            <template slot="footer">
              <a-button key="back" @click="cancelPrint">取 消</a-button>
              <a-button key="submit" type="primary" :loading='printLoading' @click="print">打 印</a-button>
            </template>

            <!-- 打印模板 -->

            <!-- 个人存档证明 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '1'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="存档证明" ref="print">
              <div slot="printContent" class="printContent">
                <p class="indent pOneMarginTopBottpm">
                  {{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员，档案管理编号：<span class="printConNumFontFamily">{{currRow && currRow.a0100A}}</span>，其人事档案在我中心管理。
                </p>
                <p class="indent pTwoMarginTopBottpm">特此证明。</p>
                <div class="bottomRight">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 档案记载证明 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '6'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="证  明" ref="print">
              <div slot="printContent" class="printContent">
                <p class="indent">{{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员，据其人事档案材料记载：该同志无违法犯罪记录，无参加“法轮功”等非法组织记录。
                </p>
                <p class="indent">特此证明。</p>
                <div class="bottomRight">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 档案记载空白证明 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '7'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="证  明" ref="print">
              <div slot="printContent" class="printContent">
                <p class="indent">{{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员，据其人事档案材料记载：
                </p>
                <p><textarea name="" id="" rows="4" class="textAreaStyle" maxlength="200" placeholder="请输入开具证明的内容..."></textarea></p>
                <p class="indent">特此证明。</p>
                <div class="bottomRight">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 单位存档证明 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '8'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="单位存档证明" ref="print">
              <div slot="printContent" class="printContent proveFontSize">
                <p class="indent">{{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员，档案管理编号：<span class="printConNumFontFamily">{{currRow && currRow.a0100A}}</span>，其人事档案由集体委托在我中心管理。</p>
                <p class="indent">特此证明。</p>
                <div class="bottomRight">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 现实表现证明 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '2'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="现实表现证明" ref="print">
              <div slot="printContent" class="printContent proveFontSize">
                <p class="indent">{{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员。据其档案材料记载：该同志始终立场坚定，旗帜鲜明地与党中央保持高度一致，坚持四项基本原则，遵守国家法律法规，在“六四”中无不良言行记录；遵守单位工作纪律，工作认真、负责。</p>
                <p class="indent proveIineHeight">无该同志参加“法轮功”等非法组织记录。</p>
                <p class="indent proveIineHeight">特此证明。</p>
                <div class="bottomRight datePadding datePaddingTop">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 同意调出函 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '3'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="同意调出函" ref="print">
              <div slot="printContent" class="printContent proveFontSize">
                <p class="indent">{{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员。根据中组部、人社部等国家五部委《关于进一步加强流动人员人事档案管理服务工作的通知（〔<span class="printConNumFontFamily">2014</span>〕<span class="printConNumFontFamily">90</span>号）和人社部办公厅《关于简化优化流动人员人事档案管理服务的通知》（〔<span class="printConNumFontFamily">2016</span>〕<span class="printConNumFontFamily">75</span>号）精神，经研究同意该同志调出，贵处能否接受，请复函。</p>
                <div class="bottomRight datePadding">
                  <p v-html="nowData"></p>
                </div>
                <div class="agreeTransferOut clear addressLineHeight">
                  <p>发函单位名称：{{this.loginDataInformation.loginUser.orgName}}</p>
                  <!-- <p>发函单位地址：江西省南昌市东湖区二七北路<span class="printConNumFontFamily">266</span>号人事代理部</p> -->
                  <p>发函单位地址：<span v-html="this.commonFun.toNumberFontFamily(this.loginDataInformation.loginUser.orgAddress, 'printConNumFontFamily')"></span></p>
                  <p>邮编：<span class="printConNumFontFamily">{{this.loginDataInformation.loginUser.orgPostalCode}}</span></p>
                  <p>联系电话：<span class="printConNumFontFamily">{{this.loginDataInformation.loginUser.orgPhone}}</span></p>
                </div>
                <div class="erWeimaProveCon erweimaMargin">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 空白证明 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '5'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="单位存档证明" ref="print">
              <div slot="printContent" class="printContent proveFontSize">
                <p class="indent marginTopBottom">
                  {{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，系我中心档案托管人员，档案管理编号：<span class="printConNumFontFamily">{{currRow && currRow.a0100A}}</span>。
                </p>
                <p>
                  <textarea class="textAreaStyle" name="" id="" rows="4" maxlength="200" placeholder="请输入开具证明的内容..." style="width: 100%; height: 75px;"></textarea>
                </p>
                <p class="indent">特此证明。</p>
                <div class="bottomRight">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

            <!-- 同意改派函 -->
            <TemplateOfPrint v-if="this.currRow && this.currRow.proofType && String(this.currRow.proofType) === '4'" :isProve="'1'" :fileTopNum="fileNum" :firstTitle="firstTitle" secondTitle="同意改派函" ref="print">
              <div slot="printContent" class="printContent proveFontSize">
                <p class="indent">
                  {{currRow && currRow.a0101}}，性别：{{currRow && currRow.a0104 === '1' ? '男' : (currRow.a0104 === '2' ? '女' : (currRow.a0104 === '9' ? '未说明的性别' : (currRow.a0104 === '0' ? '未知的性别' : ''))) }}，出生年月：<span v-html="currRow && this.commonFun.toBirthday(currRow.a0107, 'printConNumFontFamily')"></span>，身份证号：<span class="printConNumFontFamily">{{currRow && currRow.a0184}}</span>，该同志系
                  <input type="text" style="width:100px" v-model="printData.agreeCollegeYear" />年
                  <input type="text" style="width:300px" v-model="printData.agreeCollege" />毕业生，其《就业报到证》于
                  <input type="text" style="width:100px" v-model="printData.agreeYear" />年
                  <input type="text" style="width:50px" v-model="printData.agreeMonth" />月
                  <input type="text" style="width:50px" v-model="printData.agreeDay" />
                  日派遣至我中心。现该同志申请改派，我中心同意其改派申请。
                </p>
                <p class="indent">特此函告</p>
                <div class="bottomRight">
                  <p v-html="nowData"></p>
                </div>
                <div class="erWeimaProveCon">
                  <div style="width:100px; height: 100px;">
                    <img :src="erweimaPath" alt="二维码" style="width: 100px;height:100px;" />
                  </div>
                </div>
              </div>
            </TemplateOfPrint>

          </a-modal>
        </div>

        <!-- 此处为打印预览模板结束 -->

      </a-modal>
    </div>

    <TableView :initArrData="initArr" :totalCount="tableTotalNum" @searchTable="getTableData" :loading="tableLoading">

      <!-- tableFormSearch里添加其他按钮 -->
      <span slot="formAction">
        <a-button @click="proofOnSite">现场开具证明</a-button>
      </span>

      <!-- table操作列：操作按钮[备注：列的链接（slot='nameLink'）和图片参考['img']] -->
      <div slot="tableAction" slot-scope="slotPropsData">
        <!-- @click="showAndPrint(slotPropsData.currRowdata)" -->
        <a v-if="slotPropsData.currRowdata.printState !== '已打印'" href="javascript:;" @click="previewPrint(slotPropsData.currRowdata)" class="primaryBtnColor">预览打印</a>
        <a href="javascript:;" class="canNotClickBtnColor">预览打印</a>

      </div>
    </TableView>
  </div>
</template>

<script>
import moment from 'moment'
import utils from '@/utils/util'
import TableView from '@/components/tableView'
import TemplateOfPrint from '@/components/templateOfPrint'
export default {
  name: 'ProveService',
  //import引入的组件需要注入到对象中才能使用
  components: { TableView, TemplateOfPrint },
  props: [''],

  data() {
    return {
      visible: false,
      printVisiable: false,
      currRow: null,
      tableTotalNum: 0, //总页数：默认为0
      currentPage: 1,
      tableTotalNum1: 0,
      tempCondition: {},
      tempCondition1: {},
      tableLoading: false,
      tableLoading1: false,
      printLoading: false,
      // 证明类型
      proofTypes: [
        { itemCode: '1', itemName: '个人存档证明' },
        { itemCode: '6', itemName: '档案记载证明' },
        { itemCode: '7', itemName: '档案记载空白证明' },
        { itemCode: '8', itemName: '单位存档证明' },
        { itemCode: '2', itemName: '现实表现证明' },
        { itemCode: '3', itemName: '同意调出函' },
        { itemCode: '5', itemName: '空白证明' },
        { itemCode: '4', itemName: '同意改派函' }
      ],
      proofUrl: {
        '1': 'archPrintProof@sencePrintProofApply.action',
        '2': 'archPrintProof@realityShowProof.action',
        '3': 'archPrintProof@callOutProof.action',
        '4': 'archPrintProof@gpProof.action',
        '5': 'archPrintProof@kbProof.action',
        '6': 'archPrintProof@dnjzProof.action',
        '7': 'archPrintProof@dnjzkbProof.action',
        '8': 'archPrintProof@dwcdProof.action'
      },
      selectProofType: void 0,
      // tableView传值方式
      initArr: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            //input
            {
              title: '姓名',
              type: 'text',
              required: false,
              placeholder: '请输入姓名',
              key: 'applyName',
              name: 'applyName',
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '',
              postname: 'applyName',
              status: ''
            },
            {
              title: '公民身份号码/社保卡号',
              type: 'text',
              required: false,
              placeholder: '请输入公民身份号码/社保卡号',
              key: 'applyIdNum',
              name: 'applyIdNum',
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '',
              postname: 'applyIdNum',
              status: ''
            }
          ],

          // form btns
          formBtns: [
            { title: '查询', htmltype: 'submit', operate: 'searchForm' },
            { title: '重置', htmltype: 'button', operate: 'resetForm' }
          ]
        },
        //table的表头
        columnsArr: [
          {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            fixed: 'left',
            width: 60,
            scopedSlots: { customRender: 'cursorTitle' } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: '姓名',
            dataIndex: 'applyName',
            key: 'applyName',
            width: 150,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '公民身份号码/社保卡号',
            dataIndex: 'applyIdNum',
            key: 'applyIdNum',
            width: 200,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '联系电话',
            dataIndex: 'applyTelNum',
            key: 'applyTelNum',
            width: 150,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '联系地址',
            dataIndex: 'applyContactAddress',
            key: 'applyContactAddress',
            width: 220,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '证明类型',
            dataIndex: 'proofType',
            key: 'proofType',
            width: 200,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '打印日期',
            dataIndex: 'printDate',
            key: 'printDate',
            width: 150,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '数据来源',
            dataIndex: 'sourceType',
            key: 'sourceType',
            width: 150,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '打印状态',
            dataIndex: 'printState',
            key: 'printState',
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // table数据
        tabledataArr: []
      },
      initArr1: {
        treeflag: false, //左侧tree是否存在
        tableCheck: false, //table是否可以check
        // formInputs 传值方式
        formData: {
          //forminputs data
          formInputs: [
            //input
            {
              title: '存档编号',
              type: 'text',
              required: false,
              placeholder: '请输入存档编号',
              key: 'a0100A',
              name: 'a0100A',
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '',
              postname: 'a0100A',
              status: ''
            },
            {
              title: '姓名',
              type: 'text',
              required: false,
              placeholder: '请输入姓名',
              key: 'a0101',
              name: 'a0101',
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '',
              postname: 'a0101',
              status: ''
            },
            {
              title: '公民身份号码/社保卡号',
              type: 'text',
              required: false,
              placeholder: '请输入公民身份号码/社保卡号',
              key: 'a0184',
              name: 'a0184',
              val: void 0,
              maxlength: 20,
              minlength: 0,
              reg: '',
              tip: '',
              postname: 'a0184',
              status: ''
            }
          ],

          // form btns
          formBtns: [
            { title: '查询', htmltype: 'submit', operate: 'searchForm' },
            { title: '重置', htmltype: 'button', operate: 'resetForm' }
          ]
        },
        //table的表头
        columnsArr: [
          {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            fixed: 'left',
            width: 100,
            scopedSlots: { customRender: 'cursorTitle' } //鼠标滑上去tip显示当前，不写的话则不显示
          },
          {
            title: '存档编号',
            dataIndex: 'a0100A',
            key: 'a0100A',
            width: 250,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '姓名',
            dataIndex: 'a0101',
            key: 'a0101',
            width: 200,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '公民身份号码/社保卡号',
            dataIndex: 'a0184',
            key: 'a0184',
            width: 300,
            scopedSlots: { customRender: 'cursorTitle' }
          },

          {
            title: '委托存档单位编号',
            dataIndex: 'oldArchiveUnit',
            key: 'oldArchiveUnit',
            width: 250,
            scopedSlots: { customRender: 'cursorTitle' }
          },
          {
            title: '选择证明类型预览打印',
            key: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // table数据
        tabledataArr: []
      },
      fileNum: '',
      nowData: moment(new Date()).format('YYYY年MM月DD日'),
      printData: {
        agreeCollegeYear: '',
        agreeCollege: '',
        agreeYear: '',
        agreeMonth: '',
        agreeDay: ''
      },
      firstTitle: JSON.parse(sessionStorage.getItem('loginData')).loginUser['orgName'],
      erweimaPath: '', //二维码路径
      printCount: 0,
      // 接收 Session Storage 中 loginData 的值（存储单位的名称，地址，邮政编码，电话）
      loginDataInformation: {}
    }
  },

  //监听属性 类似于data概念
  computed: {
    directoryData: function() {
      if (this.$store.getters.getDirectoryData) {
        // this.splitDirectoryData(this.$store.getters.getDirectoryData);
        return this.$store.getters.getDirectoryData
      } else {
        return null
      }
    }
  },

  //监控data中的数据变化
  watch: {
    directoryData: {
      // 改变数据
      handler: function(newVal, oldVal) {
        this.splitDirectoryData(newVal)
      },
      deep: true //深度监听
    }
  },

  //方法集合
  methods: {
    getTableData(condition, pageNum, limitNum) {
      const _this = this
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       **/
      this.tableLoading = true
      this.currentPage = pageNum
      this.tempCondition = condition
      this.$http
        .fetchPost('archPrintProof@printProofService.action', {
          page: pageNum,
          limit: limitNum,
          ...condition
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.tableTotalNum = res.count
            this.initArr.tabledataArr = res.data
            this.initArr.tabledataArr.forEach((element, index) => {
              let tempState = String(element.transferOutState)
              Object.assign(element, {
                key: element.id,
                num: (pageNum - 1) * limitNum + index + 1,
                sourceType:
                  String(element.sourceType) === '1'
                    ? '现场打印'
                    : String(element.sourceType) === '0'
                    ? '网站申请'
                    : '未知来源',
                printState: String(element.printState) === '1' ? '已打印' : '未打印',
                proofType: this.findProofName(element.proofType)
              })
            })
          } else {
            _this.$message.warning('抱歉,暂时未查到数据!')
          }
        })
        .catch(err => {
          // console.log(err)
          _this.$message.error('抱歉,网络异常,请稍后重试')
        })
        .finally(end => {
          _this.tableLoading = false
        })
    },

    getTableData1(condition, pageNum, limitNum) {
      const _this = this
      /***
       * 功能：点击查询按钮，根据子组件返回的结果重新获取table数据
       * 参数：condition:form查询结果：{}
       **/
      this.tableLoading1 = true
      this.tempCondition1 = condition
      this.$http
        .fetchPost('personalArch@getPersonalArchProofList.action', {
          page: pageNum,
          limit: limitNum,
          orgName: this.firstTitle,
          ...condition
        })
        .then(res => {
          if (Number(res.code) === 0) {
            // this.erweimaPath = this.$targetHost + res.savePath.substring(3);
            // this.erweimaPath = this.$targetHost + 'weixin/111.jpg';
            let tempPathArr = res.savePath.split('/')
            this.erweimaPath =
              this.$targetHost +
              tempPathArr[tempPathArr.length - 2] +
              '/' +
              tempPathArr[tempPathArr.length - 1]

            this.tableTotalNum1 = res.count
            this.initArr1.tabledataArr = res.data
            this.initArr1.tabledataArr.forEach((element, index) => {
              let tempState = String(element.transferOutState)
              Object.assign(element, {
                key: element.a01000,
                num: (pageNum - 1) * limitNum + index + 1
              })
            })
          } else {
            _this.$message.warning('抱歉,暂时未查到数据!')
          }
        })
        .catch(err => {
          _this.$message.error('抱歉,网络异常,请稍后重试')
        })
        .finally(end => {
          _this.tableLoading1 = false
        })
    },

    // 现场开具证明
    proofOnSite() {
      this.visible = true
    },

    handleCancel() {
      this.getTableData(null, this.currentPage, 10)
      this.visible = false
    },

    cancelPrint() {
      this.printVisiable = false
    },

    // 拆分字典数据
    splitDirectoryData(Data) {
      if (!Data) return
      this.proofTypes = Data.proofTypeList
    },

    findProofName(proofCode) {
      let result = proofCode
      this.proofTypes.forEach(item => {
        if (proofCode === item.itemCode) {
          result = item.itemName
        }
      })
      return result
    },

    // 打印预览
    printPreview(currRowdata) {
      this.currRow = currRowdata
      if (currRowdata.a01000 && currRowdata.proofType && this.proofUrl[currRowdata.proofType]) {
        this.$http
          .fetchPost(this.proofUrl[currRowdata.proofType], {
            archiveId: currRowdata.a01000,
            proofType: currRowdata.proofType,
            sourceType: '1'
          })
          .then(res => {
            // console.log(res);
            if (Number(res.code) === 0) {
              this.fileNum = res.data.grcdzmNum
            } else {
              this.$message.warning('获取编号失败')
            }
          })
          .catch(err => {
            this.$message.error('抱歉,网络异常,请稍后重试')
          })
        if (currRowdata.proofType) {
          this.printVisiable = true
        } else {
          this.$message.warning('请选择打印类型后进行打印预览操作!')
        }
      }
    },

    previewPrint(currData) {
      // console.log(currData);
      this.printVisiable = true
    },

    print() {
      if (this.printCount === 0) {
        this.$refs.print.printFun()
        this.printCount++
      } else {
        this.$refs.print.printOtherFun()
      }
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.nowData = this.commonFun.toNumberFontFamily(this.nowData, 'printConNumFontFamily')
    this.loginDataInformation = JSON.parse(sessionStorage.getItem('loginData'))
    // this.getTableData(null,this.currentPage,10);
    // this.getTableData1(null,this.currentPage,10);
  },

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
.actionStyle {
  display: flex;
  align-items: center;
  height: 52px;
}
.actionStyle .actionSelect {
  width: 180px;
  margin-right: 10px;
}
.agreeTransferOut {
  padding-top: 0px;
}
.agreeTransferOut > p {
  font-size: 16px;
  font-weight: 400;
  margin-top: 10px;
}
.textAreaStyle {
  /* background:#e8e8e8; */
  background: transparent;
  width: 100%;
  border: none;
  text-indent: 40px;
  outline: none;
  resize: none;
}

.erWeimaProveCon {
  clear: both;
  display: flex;
  justify-content: center;
  height: 100px;
  width: 100%;
  margin: 60px 0;
}

/*根据需求新增样式*/
.printContent {
  font-size: 21px;
  color: rgba(0, 0, 0, 1);
}

.printContent > p.pOneMarginTopBottpm {
  margin: 6px 0px 0px 0px;
}

.printContent > p.pTwoMarginTopBottpm {
  margin: 0px 0px 43px 0px;
}

.printContent .datePadding {
  padding: 40px 0 40px;
}

.addressLineHeight {
  line-height: 1;
  font-weight: 400;
}

.erweimaMargin {
  margin: 40px 0px;
}

p.proveIineHeight {
  line-height: 1;
}

.printContent .datePaddingTop {
  padding-top: 82px;
}
</style>