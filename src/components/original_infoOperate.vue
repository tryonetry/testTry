<template>
  <!-- 人才信息总库操作:查看详情、编辑、添加 -->
  <div class="outerContainer">
    <a-tabs class="tabContainer" defaultActiveKey="1">
      <a-tab-pane class="tabView" tab="人员信息浏览" :key="1">
        <div class="left_anchor" v-show="operateStatusVal !== 1">
          <a
            href="javascript:void(0)"
            v-for="(item, index) in anchorList"
            :key="index"
            @click="anchorClick(item.value, index)"
            :class="{left_anchorClick: index == currClickAnchor}"
          >{{item.name}}</a>
        </div>
        <div
          :class="['right_container', operateStatusVal !==1 ? 'right_containerWidth': 'right_containeraddWidth']"
        >
          <!-- 1-基本信息 -->
          <div class="basicInfo" id="anchor_basicInfo" ref="anchor_basicInfo">
            <table class="infoTable" border="1">
              <thead>
                <tr>
                  <th colspan="24">
                    <h2>人员基本信息表</h2>
                  </th>
                </tr>
              </thead>
              <tbody v-if="personBasicInfo">
                <tr>
                  <td colspan="4">
                    姓名
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span class="info_view" v-if="operateStatusVal == 2">{{personBasicInfo.a0101}}</span>
                    <a-input
                      v-show="operateStatusVal !== 2"
                      class="info_input"
                      type="text"
                      placeholder="姓名"
                      maxlength="40"
                      v-model="personBasicInfo.a0101"
                      @blur="regInput(personBasicInfo.a0101, 2, 40, null, '请输入正确的姓名')"
                    >{{personBasicInfo.a0101}}</a-input>
                  </td>
                  <td colspan="4">
                    身份证号码
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0184}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="身份证号码"
                      maxlength="18"
                      v-model="personBasicInfo.a0184"
                      v-show="operateStatusVal !== 2"
                      @blur="regInput(personBasicInfo.a0184, 15, 18,'testid', '请输入正确的身份证号')"
                    ></a-input>
                  </td>
                  <td colspan="2" rowspan="4">
                    <img :src="imgUrl" alt="avatar" style="width: 130px;height: 180px;">
                  </td>
                </tr>

                <tr>
                  <td colspan="4">
                    性别
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="2">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{personBasicInfo.a0104==='1'?'男': '女'}}</span>
                    <a-radio-group
                      :options="genderOptions"
                      @change="genderChange"
                      v-model="personBasicInfo.a0104"
                      v-show="operateStatusVal !== 2"
                    />
                  </td>
                  <td colspan="2">
                    民族
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <!-- nationalVal -->
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0117', personBasicInfo.a0117)}}</span>
                    <a-select
                      class="info_select"
                      @change="nationalChange"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0117"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in nationalArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="2">
                    出生日期
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="2">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0107}}</span>
                    <a-date-picker
                      class="info_date"
                      v-show="operateStatusVal !== 2"
                      v-model="birthday"
                      @change="birthdayChange"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="4">籍贯</td>
                  <td colspan="2">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0111}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="籍贯"
                      v-model="personBasicInfo.a0111"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                  <td colspan="2">
                    政治面貌
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0141', personBasicInfo.a0141)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0141"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in politicsStatusArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="2">手机号码</td>
                  <td colspan="2">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{personBasicInfo.a3707c}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="手机号码"
                      v-model="personBasicInfo.a3707c"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">婚姻状况</td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0131', personBasicInfo.a0131)}}</span>
                    <a-select
                      class="info_select"
                      @change="nationalChange"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0131"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in marriageArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="4">电子邮箱</td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a3708}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="电子邮箱"
                      maxlength="40"
                      v-model="personBasicInfo.a3708"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">
                    最高学历
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="2">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0834', personBasicInfo.a0834)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0834"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in educationArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="2">
                    最高学位
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0914', personBasicInfo.a0914)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0914"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in degreeArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="2">
                    最高学历毕业院校
                    <sup style="color:red;">*</sup>
                  </td>
                  <td :colspan="operateStatusVal==2 ? 4 : 2">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0888}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="毕业院校"
                      v-model="personBasicInfo.a0888"
                      v-show="operateStatusVal !== 2"
                      maxlength="20"
                      @blur="regInput(personBasicInfo.a0888, 2, 20, null, '请输入正确的毕业院校')"
                    ></a-input>
                  </td>
                  <td colspan="2" v-show="operateStatusVal !== 2">
                    <div>
                      <a-upload
                        class="avatar-uploader"
                        listType="picture"
                        :showUploadList="false"
                        :beforeUpload="beforeUpload"
                        @change="uploadPhoto"
                        action = "http://192.168.1.222:8181/hasngcadrefile/informationPool@uploadImgNoUsed.action"
                      >
                        <a-button type="primary">上传照片</a-button>
                        
                      </a-upload>
                      <a-button type="default" style="margin-left: 15px;" @click="clearImgUrl">清空</a-button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">
                    最高学历毕业日期
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="2">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0807}}</span>
                    <a-date-picker
                      class="info_date"
                      @change="graduateChange"
                      v-model="graduateDate"
                      v-show="operateStatusVal !== 2"
                    />
                  </td>
                  <td colspan="2">
                    最高学历所学专业
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="6">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0824}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="最高学历所学专业"
                      v-model="personBasicInfo.a0824"
                      v-show="operateStatusVal !== 2"
                      maxlength="20"
                      @blur="regInput(personBasicInfo.a0824, 2, 20, null, '请输入正确的专业名称')"
                    ></a-input>
                  </td>
                  <td colspan="2">
                    最高学历所学专业类别
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="2">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0827', personBasicInfo.a0827)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0827"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in professionalArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">健康状况</td>
                  <td colspan="2">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0127', personBasicInfo.a0127)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0127"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in healthArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="2">
                    工作单位名称
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="6">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{personBasicInfo.a0202a}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="工作单位名称"
                      v-model="personBasicInfo.a0202a"
                      v-show="operateStatusVal !== 2"
                      maxlength="40"
                      @blur="regInput(personBasicInfo.a0202a, 2, 40, null, '请输入正确的工作单位')"
                    ></a-input>
                  </td>
                  <td colspan="2">参加工作年月</td>
                  <td colspan="2">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0134}}</span>
                    <a-month-picker
                      class="info_date"
                      format="YYYY-MM"
                      placeholder="参加工作年月"
                      v-model="workDate"
                      v-show="operateStatusVal !== 2"
                      @change="joinWorkChange"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="4">
                    工作职位（岗位）类型
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0202d', personBasicInfo.a0202d)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0202d"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in positionArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="6">
                    工作单位机构类型
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0202c', personBasicInfo.a0202c)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0202c"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in workUnitArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">
                    工作单位经济类型
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0202b', personBasicInfo.a0202b)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0202b"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in economicArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                  <td colspan="6">
                    工作单位所属行业
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0211', personBasicInfo.a0211)}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0211"
                      v-show="operateStatusVal !== 2"
                    >
                      <a-select-option
                        v-for="(item, index) in industryArr"
                        :value="item.itemCode"
                        :key="index"
                      >{{item.itemName}}</a-select-option>
                    </a-select>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">曾用名</td>
                  <td colspan="2">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0139}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="曾用名"
                      v-model="personBasicInfo.a0139"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                  <td colspan="2">邮编</td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a3714}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="邮编"
                      v-model="personBasicInfo.a3714"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                  <td colspan="2">现居住地址</td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a3711}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="现居住地址"
                      v-model="personBasicInfo.a3711"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">户籍地址</td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0181}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="户籍地址"
                      v-model="personBasicInfo.a0181"
                      v-show="operateStatusVal !== 2"
                    ></a-input>
                  </td>
                  <td colspan="6">户籍行政区划</td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.utils.checkAddressName(personBasicInfo.a0111d)}}</span>
                    <a-cascader
                      class="info_division"
                      :options="address"
                      placeholder="请选择省/市/区"
                      v-show="operateStatusVal !== 2"
                      v-model="hjCode"
                      :fieldNames="{label:'name',value:'code',children:'children'}"
                      @change="hujiCodeChange"
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan="4">出生地</td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.utils.checkAddressName(personBasicInfo.a0114)}}</span>
                    <a-cascader
                      class="info_division"
                      :options="address"
                      placeholder="请选择省/市/区"
                      v-model="birthdayCode"
                      v-show="operateStatusVal !== 2"
                      :fieldNames="{label:'name',value:'code',children:'children'}"
                      @change="birthdayCodeChange"
                    />
                  </td>
                  <td colspan="6">工作地行政区划</td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.utils.checkAddressName(personBasicInfo.a0203)}}</span>
                    <a-cascader
                      class="info_division"
                      :options="address"
                      placeholder="请选择省/市/区"
                      v-show="operateStatusVal !== 2"
                      v-model="workCode"
                      :fieldNames="{label:'name',value:'code',children:'children'}"
                      @change="workCodeChange"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="display:none" >{{ exitsVal }}</div>
          </div>
          <div class="otherInfo" v-show="operateStatusVal !== 1">
            <!-- 2-工作经历 -->
            <div id="workExperience" class="otherinfo">
              <p class="title">工作经历</p>
              <a-table
                v-show="operateStatusVal == 2"
                :dataSource="workTableData"
                :columns="workColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="workTableData"
                  :columns="workColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'workExperience' , 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('workExperience', currentData=record)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'workExperience', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 3-教育经历 -->
            <div id="educationExperience" class="otherinfo">
              <p class="title">教育经历</p>
              <a-table
                v-show="operateStatusVal == 2"
                :dataSource="educationTableData"
                :columns="educationColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="educationTableData"
                  :columns="educationColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'educationExperience' , 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('educationExperience', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'educationExperience' ,0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 4-家庭情况 -->
            <div id="familySta" class="otherinfo">
              <p class="title">家庭情况</p>
              <a-table
                v-show="operateStatusVal == 2"
                :dataSource="familyTableData"
                :columns="familyColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="familyTableData"
                  :columns="familyColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'familySta' , 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('familySta', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'familySta' ,0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 5-奖惩历史 -->
            <div id="rewordsHistory" class="otherinfo">
              <p class="title">奖惩历史</p>
              <a-table
                v-show="operateStatusVal == 2"
                :dataSource="historyTableData"
                :columns="historyColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="historyTableData"
                  :columns="historyColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'rewordsHistory', 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('rewordsHistory', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'rewordsHistory', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 6-语言能力 -->
            <div id="languageAbility" class="otherinfo">
              <p class="title">语言能力</p>
              <a-table
                v-show="operateStatusVal == 2"
                :dataSource="languageTableData"
                :columns="languageColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="languageTableData"
                  :columns="languageColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'languageAbility', 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('languageAbility', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'languageAbility', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 7-培训经历 -->
            <div id="trainExperience" class="otherinfo">
              <p class="title">人员培训信息</p>
              <a-table
                v-show="operateStatusVal === 2"
                :dataSource="trainTableData"
                :columns="trainColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="trainTableData"
                  :columns="trainColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'trainExperience', 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('trainExperience', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'trainExperience', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 8-专业与职业技术 -->
            <div id="professional" class="otherinfo">
              <p class="title">专业与职业技术</p>
              <a-table
                v-show="operateStatusVal === 2"
                :dataSource="professionalTableData"
                :columns="professionalColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="professionalTableData"
                  :columns="professionalColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'professional', 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('professional', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'professional', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 9-委托单位存档数据 -->
            <div id="delagateData" class="otherinfo">
              <p class="title">委托单位存档数据</p>
              <a-table
                v-show="operateStatusVal === 2"
                :dataSource="delagateTableData"
                :columns="delagateColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="delagateTableData"
                  :columns="delagateColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'delagateData', 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('delagateData', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'delagateData', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
            <!-- 10-档案接转数据 -->
            <div id="archiveData" class="otherinfo">
              <p class="title">档案接转数据</p>
              <a-table
                v-show="operateStatusVal === 2"
                :dataSource="archiveTableData"
                :columns="archiveColumns"
                :pagination="false"
                bordered
              ></a-table>
              <div v-show="operateStatusVal !== 2">
                <a-table
                  :dataSource="archiveTableData"
                  :columns="archiveColumnsEdit"
                  :pagination="false"
                  bordered
                >
                  <div slot="action" slot-scope="text, record">
                    <a
                      href="javascript:;"
                      data-type="编辑"
                      @click="personOtherInfoOperate(currentData=record, 'archiveData', 1)"
                    >编辑</a>
                    <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="editInOperateDelete('archiveData', currentData=record,)"
                    >
                      <a href="javascript:;" class="errorBtnColor">删除</a>
                    </a-popconfirm>
                  </div>
                </a-table>
                <a
                  href="javascript:void(0);"
                  class="primaryBtnColor add_info_btn"
                  @click="personOtherInfoOperate(currentData={}, 'archiveData', 0)"
                >
                  <a-icon type="plus" style="color: #9b9797;font-size:24px;line-height: 50px;"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane class="tabView" tab="人员档案目录" key="2" v-if="operateStatusVal == 2">
        <DocDirectory :userId="currRowDataId" :ramdomKey='ramdomKey'></DocDirectory>
      </a-tab-pane>
    </a-tabs>
   
    <!-- 当为编辑状态时：添加或编辑操作 -->
    <div class="addModal">
      <a-modal
        centered
        :title="operateStatus == 0 ? '添加': '编辑'"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :width="1600"
        @cancel="handleCancel"
        style="height:85%;overflow: hidden;"
      >
        <TableFromSearch :formDataArr="personInfoForm" ref="infoForm"></TableFromSearch>
        <template slot="footer">
          <a-button key="cancel" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" @click="handleOk">提交</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import address from "../../public/json/address.js";
import DocDirectory from "./docDirectory";
import regs from "../utils/regexp.js";
import utils from "../utils/util.js";
import TableFromSearch from "../components/tableFormSearch";
import { format } from 'path';
import axios from 'axios'
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name: "InfoOperate",
  props: ["operateStatusVal", "currRowDataId", "addSelectTreeNode",'ramdomKey'],
  components: {
    DocDirectory,
    TableFromSearch
  },
  created() {
    this.getBasicInfoOther(); //获取基本信息里面selct对应得数组
  },
  mounted() {
    if (this.operateStatusVal !== 1) {
      this.getBasicInfo(this.currRowDataId); //人员基本信息
      this.getPersonOtherInfo(this.currRowDataId);
    } else {
      this.addTreeNode = this.addSelectTreeNode;
    }

    let scrollListener = document.getElementsByClassName("right_container");
    window.addEventListener(
      "scroll",
      () => {
        let currScrollTop =
          scrollListener[0].scrollTop || scrollListener[0].pageYOffset;
        // 控制滚动按钮的隐藏或显示
        this.scrollAddListening(currScrollTop);
      },
      true
    );
  },
  data() {
    return {
      regs,
      utils,
      isRight: true, //必填项是否标红
      ifExist: 0,
      file: [],
      anchorList: [
        //左侧锚点
        { value: "anchor_basicInfo", name: "人员基本信息" },
        { value: "workExperience", name: "工作经历" },
        { value: "educationExperience", name: "教育经历" },
        { value: "familySta", name: "家庭情况" },
        { value: "rewordsHistory", name: "奖惩历史" },
        { value: "languageAbility", name: "语言能力" },
        { value: "trainExperience", name: "培训经历" },
        { value: "professional", name: "专业与职业技术" },
        { value: "delagateData", name: "委托单位存档数据" },
        { value: "archiveData", name: "档案接转数据" }
      ],
      currClickAnchor: 0, //默认锚点选择
      personBasicInfo: null,
      addInitPersonBasicInfo: {
        //人员基本信息
        a0100a: "",
        a0101: "",
        a0101py: "",
        a0104: "1",
        a0107: this.moment(new Date()).format("YYYY-MM-DD"),
        a0111: "",
        a0111d: "",
        a0111dName: "",
        a0114: "",
        a0114Name: "",
        a0117: "01",
        a0127: "",
        a0131: "",
        a0134: this.moment(new Date()).format("YYYY-MM-DD"),
        a0139: "",
        a0141: "01",
        a0181: "",
        a0184: "",
        a0202a: "",
        a0202b: "100",
        a0202c: "10",
        a0202d: "10300",
        a0203: "",
        a0203Name: "",
        a0211: "0100",
        a0807: this.moment(new Date()).format("YYYY-MM-DD"),
        a0824: "",
        a0827: "990000",
        a0834: "11",
        a0888: "",
        a0914: "900",
        a01000: "",
        a3707c: "",
        a3708: "",
        a3711: "",
        a3714: "",
        b01000: "",
        cityId: "",
        confNumber: "",
        endDate: "",
        imgPath: null,
        isInware: "",
        pageView: "76",
        personEntry: "",
        shelvesNo: "",
        startDate: "",
        state: "",
        uCreateDate: "",
        uCreator: "",
        uCreatorOrgID: "",
        uIsSystem: "",
        uIsValid: "",
        uLastModifiedDate: "",
        uLastModifieder: "",
        uLastModifiederOrgID: "",
        uSortNo: ""
      },
      politicsStatusArr: [], //政治面貌
      nationalArr: [], //民族
      genderOptions: [
        //性别
        { label: "男", value: "1" },
        { label: "女", value: "2" }
      ],
      marriageArr: [], //婚姻状况
      educationArr: [], //学历
      degreeArr: [], //学位
      healthArr: [], //健康状况
      positionArr: [], //工作职位(岗位)类型
      workUnitArr: [], //工作单位机构类型
      professionalArr: [], //最高学历所学专业类别
      economicArr: [], //工作单位经济类型
      industryArr: [], //工作单位所属行业
      relationshipArr: [], //与本人关系
      studyFormArr: [], //学习形式
      educationTypeArr: [], //教育类别
      rewordNameArr: [], //奖励名称
      punishmentNameArr: [], //处罚名称
      languageTypeArr: [], //语种
      languageProficiencyArr: [], //语言熟练程度
      occupationLevelArr: [], //职业资格等级（技能人员等级）
      positionNameArr: [], //专业技术职务名称
      positionLevelArr: [], //专业技术职务级别
      saveRecordStaArr: [], //存档状态
      saveRecordNatureArr: [], //存档性质
      inReasonArr: [], //转入原因
      outReasonArr: [], //传出原因
      workColumns: [
        //工作经历--列
        { title: "所在工作单位名称", dataIndex: "a0157a", key: "a0157a" },
        { title: "工作起始日期", dataIndex: "a4801", key: "a4801" },
        { title: "工作终止日期", dataIndex: "a4804", key: "a4804" },
        { title: "从事工作或担任职务", dataIndex: "a0215a", key: "a0215a" },
        { title: "单位证明人", dataIndex: "a0202d", key: "a0202d" }
      ],
      workColumnsEdit: [
        //工作经历:编辑/添加--列
        {
          title: "所在工作单位名称",
          dataIndex: "a0157a",
          key: "a0157a"
        },
        {
          title: "工作起始日期",
          dataIndex: "a4801",
          key: "a4801"
        },
        {
          title: "工作终止日期",
          dataIndex: "a4804",
          key: "a4804"
        },
        {
          title: "从事工作或担任职务",
          dataIndex: "a0215a",
          key: "a0215a"
        },
        {
          title: "单位证明人",
          dataIndex: "a0202d",
          key: "a0202d"
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      workTableData: [], //工作经历table
      educationColumns: [
        //教育经历-列
        { title: "所在学校", dataIndex: "a0814", key: "a0814" },
        { title: "教育类别", dataIndex: "a0837", key: "a0837" },
        { title: "学习形式", dataIndex: "a0838", key: "a0838" },
        {
          title: "所学专业名称",
          dataIndex: "a0824",
          key: "a0824"
        },
        { title: "所获学位", dataIndex: "a0901a", key: "a0901a" },
        {
          title: "所获学历",
          dataIndex: "a0801a",
          key: "a0801a"
        },
        { title: "学习起始日期", dataIndex: "a0804", key: "a0804" },
        { title: "学习终止日期", dataIndex: "a0807", key: "a0807" }
      ],
      educationColumnsEdit: [
        //教育经历--编辑列
        { title: "所在学校", dataIndex: "a0814", key: "a0814" },
        { title: "教育类别", dataIndex: "a0837", key: "a0837" },
        { title: "学习形式", dataIndex: "a0838", key: "a0838" },
        {
          title: "所学专业名称",
          dataIndex: "a0824",
          key: "a0824"
        },
        { title: "所获学位", dataIndex: "a0901a", key: "a0901a" },
        {
          title: "所获学历",
          dataIndex: "a0801a",
          key: "a0801a"
        },
        { title: "学习起始日期", dataIndex: "a0804", key: "a0804" },
        { title: "学习终止日期", dataIndex: "a0807", key: "a0807" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      educationTableData: [], //教育经历--tableDate
      familyColumns: [
        //家庭情况--列
        { title: "姓名", dataIndex: "a3601", key: "a3601" },
        { title: "与本人关系", dataIndex: "a3604a", key: "a3604a" },
        { title: "单位及职务", dataIndex: "a3611", key: "a3611" }
      ],
      familyColumnsEdit: [
        //家庭情况编辑--列
        { title: "姓名", dataIndex: "a3601", key: "a3601" },
        { title: "与本人关系", dataIndex: "a3604a", key: "a3604a" },
        { title: "单位及职务", dataIndex: "a3611", key: "a3611" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      familyTableData: [], //家庭情况--tableData
      historyColumns: [
        //奖惩历史--列
        { title: "奖励名称", dataIndex: "a14Z204a", key: "a14Z204a" },
        { title: "奖励批准日期", dataIndex: "a14Z211", key: "a14Z211" },
        { title: "奖励批准单位名称", dataIndex: "a14Z214a", key: "a14Z214a" },
        { title: "处分名称", dataIndex: "a14Z304a", key: "a14Z304a" },
        { title: "处分批准日期", dataIndex: "a14Z307", key: "a14Z307" },
        { title: "处分批准单位名称", dataIndex: "a14Z311a", key: "a14Z311a" }
      ],
      historyColumnsEdit: [
        //奖惩历史--编辑列
        { title: "奖励名称", dataIndex: "a14Z204a", key: "a14Z204a" },
        { title: "奖励批准日期", dataIndex: "a14Z211", key: "a14Z211" },
        { title: "奖励批准单位名称", dataIndex: "a14Z214a", key: "a14Z214a" },
        { title: "处分名称", dataIndex: "a14Z304a", key: "a14Z304a" },
        { title: "处分批准日期", dataIndex: "a14Z307", key: "a14Z307" },
        { title: "处分批准单位名称", dataIndex: "a14Z311a", key: "a14Z311a" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      historyTableData: [], //奖惩历史--tableData
      languageColumns: [
        //语言能力--列
        { title: "语种", dataIndex: "dc010701", key: "dc010701" },
        { title: "熟练程度", dataIndex: "dc010702", key: "dc010702" },
        { title: "备注", dataIndex: "remark", key: "remark" }
      ],
      languageColumnsEdit: [
        //语言能力--列
        { title: "语种", dataIndex: "dc010701", key: "dc010701" },
        { title: "熟练程度", dataIndex: "dc010702", key: "dc010702" },
        { title: "备注", dataIndex: "remark", key: "remark" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      languageTableData: [], //语言能力--tableData
      trainColumns: [
        //培训经历--列
        { title: "培训班名称", dataIndex: "a1131", key: "a1131" },
        { title: "培训起始日期", dataIndex: "a1107", key: "a1107" },
        { title: "培训终止日期", dataIndex: "a1111", key: "a1111" },
        { title: "培训主办单位名称", dataIndex: "a1114A", key: "a1114A" }
      ],
      trainColumnsEdit: [
        //培训经历--编辑列
        { title: "培训班名称", dataIndex: "a1131", key: "a1131" },
        { title: "培训起始日期", dataIndex: "a1107", key: "a1107" },
        { title: "培训终止日期", dataIndex: "a1111", key: "a1111" },
        { title: "培训主办单位名称", dataIndex: "a1114A", key: "a1114A" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      trainTableData: [], //培训经历--tabledate
      professionalColumns: [
        //专业与职业技术--列
        { title: "职业(工种)资格名称", dataIndex: "a0601", key: "a0601" },
        { title: "资格等级(技能人员等级)", dataIndex: "a0602", key: "a0602" },
        { title: "专业技术职务名", dataIndex: "a0215a", key: "a0215a" },
        { title: "专业技术职务级别", dataIndex: "a0215c", key: "a0215c" },
        { title: "取得专技资格日期", dataIndex: "a0604", key: "a0604" },
        { title: "职业(工种)资格日期", dataIndex: "a0603", key: "a0603" }
      ],
      professionalColumnsEdit: [
        //专业与职业技术--编辑--列
        { title: "职业(工种)资格名称", dataIndex: "a0601", key: "a0601" },
        { title: "资格等级(技能人员等级)", dataIndex: "a0602", key: "a0602" },
        { title: "专业技术职务名", dataIndex: "a0215a", key: "a0215a" },
        { title: "专业技术职务级别", dataIndex: "a0215c", key: "a0215c" },
        { title: "取得专技资格日期", dataIndex: "a0604", key: "a0604" },
        { title: "职业(工种)资格日期", dataIndex: "a0603", key: "a0603" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      professionalTableData: [], //专业与职业技术--tableDate
      delagateColumns: [
        //委托单位存档数据--列
        { title: "单位立户号", dataIndex: "b0102", key: "b0102" },
        { title: "单位名称", dataIndex: "b0101", key: "b0101" },
        { title: "组织机构代码", dataIndex: "b0114", key: "b0114" },
        { title: "单位机构类型", dataIndex: "b0103", key: "b0103" },
        { title: "单位所属行业", dataIndex: "b0134", key: "b0134" },
        { title: "经济行业", dataIndex: "b0105", key: "b0105" }
      ],
      delagateColumnsEdit: [
        //委托单位存档数据--编辑--列
        { title: "单位立户号", dataIndex: "b0102", key: "b0102" },
        { title: "单位名称", dataIndex: "b0101", key: "b0101" },
        { title: "组织机构代码", dataIndex: "b0114", key: "b0114" },
        { title: "单位机构类型", dataIndex: "b0103", key: "b0103" },
        { title: "单位所属行业", dataIndex: "b0134", key: "b0134" },
        { title: "经济行业", dataIndex: "b0105", key: "b0105" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      delagateTableData: [], //委托单位存档数据--tableData
      archiveColumns: [
        //档案接转数据--列
        { title: "存档编号", dataIndex: "dc030001", key: "dc030001" },
        {
          title: "现档案管理机构名称",
          dataIndex: "a3807a",
          key: "a3807a"
        },
        { title: "转入日期", dataIndex: "a3801", key: "a3801" },
        { title: "转入原因", dataIndex: "a3803", key: "a3803" }
      ],
      archiveColumnsEdit: [
        //档案接转数据--编辑--列
        { title: "存档编号", dataIndex: "dc030001", key: "dc030001" },
        {
          title: "现档案管理机构名称",
          dataIndex: "a3807a",
          key: "a3807a"
        },
        { title: "转入日期", dataIndex: "a3801", key: "a3801" },
        { title: "转入原因", dataIndex: "a3803", key: "a3803" },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      archiveTableData: [], //档案接转数据--tableData
      imgUrl: "", //照片地址
      statusVal: null, //人才信息总库页面：操作状态： 1-添加， 2-浏览， 3-编辑
      birthday: moment(new Date(), "YYYY-MM-DD"), //出生日期
      graduateDate: moment(new Date(), "YYYY-MM-DD"), //最高学历毕业日期
      workDate: moment(new Date(), "YYYY-MM-DD"), //参加工作年月
      addTreeNode: "", //当为添加操作时，选择的treeNode值
      visible: false, //编辑/添加状态时： 模态框默认不可见
      confirmLoading: false, //编辑/添加状态时： 模态框确认按钮加载：默认不加载
      operateStatus: null, //编辑/添加状态时： 添加或编辑状态
      personInfoForm: {}, //tableformSearch默认值
      currOperatePersonInfo: "", //添加或编辑状态时： 针对具体某一个信息进行添加或编辑
      currentData: {}, //编辑状态时： 编辑信息：当前数据
      familyStaForm: {
        //工作经历：tableformSearch
        formInputs: [
          {
            title: "家庭成员姓名",
            type: "text",
            required: true,
            placeholder: "请输入家庭成员姓名",
            key: "a3601",
            name: "a3601",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "与该人关系",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择与该人关系",
            key: "a3604a_Code",
            name: "a3604a_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "工作单位及职务 ",
            type: "text",
            required: false,
            placeholder: "请输入工作单位及职务",
            key: "a3611",
            name: "a3611",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          }
        ]
      },
      workForm: {
        //工作经历--tableFormSearch
        formInputs: [
          {
            title: "所在工作单位名称",
            type: "text",
            required: true,
            placeholder: "请输入所在工作单位名称",
            key: "a0157a",
            name: "a0157a",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "工作起始日期",
            otherType: "date",
            required: true,
            placeholder: "请选择工作起始日期",
            key: "a4801",
            name: "a4801",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "工作终止日期",
            otherType: "date",
            required: true,
            placeholder: "请选择工作终止日期",
            key: "a4804",
            name: "a4804",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "从事工作或担任职务",
            type: "text",
            required: true,
            placeholder: "请输入从事工作或担任职务 ",
            key: "a0215a",
            name: "a0215a",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "单位证明人",
            type: "text",
            required: false,
            placeholder: "请输入单位证明人",
            key: "a0202d",
            name: "a0202d",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          }
        ]
      },
      educationForm: {
        //教育经历--tableFormsearch
        formInputs: [
          {
            title: "学校(单位)名称",
            type: "text",
            required: true,
            placeholder: "请输入学校(单位)名称",
            key: "a0814",
            name: "a0814",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "学习起始日期",
            otherType: "date",
            required: false,
            placeholder: "请选择学习起始日期 ",
            key: "a0804",
            name: "a0804",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "学习终止日期",
            otherType: "date",
            required: true,
            placeholder: "请选择工作终止日期",
            key: "a0807",
            name: "a0807",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "教育类别",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择教育类别",
            key: "a0837_Code",
            name: "a0837_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "所获学历",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择所获学历",
            key: "a0801a_Code",
            name: "a0801a_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "所获学位 ",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择所获学位",
            key: "a0901a_Code",
            name: "a0901a_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "所学专业",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择所学专业",
            key: "a0824_Code",
            name: "a0824_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "学习形式",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择学习形式",
            key: "a0838_Code",
            name: "a0838_Code",
            val: void 0,
            children: [],
            status: ""
          }
        ]
      },
      rewordHistoryForm: {
        //奖惩历史---tableFormSearch
        formInputs: [
          {
            title: "奖励名称",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择奖励名称",
            key: "a14Z204a_Code",
            name: "a14Z204a_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "奖励批准日期",
            otherType: "date",
            required: false,
            placeholder: "请选择奖励批准日期",
            key: "a14Z211",
            name: "a14Z211",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "奖励批准单位名称",
            type: "text",
            required: false,
            placeholder: "请输入奖励批准单位名称",
            key: "a14Z214a",
            name: "a14Z214a",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "处分名称",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择处分名称",
            key: "a14Z304a_Code",
            name: "a14Z304a_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "处分批准日期",
            otherType: "date",
            required: false,
            placeholder: "请选择处分批准日期",
            key: "a14Z307",
            name: "a14Z307",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "处分批准单位名称",
            type: "text",
            required: false,
            placeholder: "请输入处分批准单位名称",
            key: "a14Z311a",
            name: "a14Z311a",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          }
        ]
      },
      languageForm: {
        //语言能力---tableFormSearch
        formInputs: [
          {
            title: "语种",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择语种",
            key: "dc010701_Code",
            name: "dc010701_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "语种熟练程度",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择语种熟练程度",
            key: "dc010702_Code",
            name: "dc010702_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "备注",
            type: "text",
            required: true,
            placeholder: "请输入备注",
            key: "remark",
            name: "remark",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          }
        ]
      },
      trainerForm: {
        formInputs: [
          {
            title: "培训班名称",
            type: "text",
            required: true,
            placeholder: "请输入培训班名称",
            key: "a1131",
            name: "a1131",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "培训起始日期 ",
            otherType: "date",
            required: false,
            placeholder: "请选择培训起始日期 ",
            key: "a1107",
            name: "a1107",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "培训终止日期",
            otherType: "date",
            required: false,
            placeholder: "请选择培训终止日期",
            key: "a1111",
            name: "a1111",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "培训主办单位名称 ",
            type: "text",
            required: true,
            placeholder: "请输入培训主办单位名称 ",
            key: "a1114A",
            name: "a1114A",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          }
        ]
      },
      professionalForm: {
        formInputs: [
          {
            title: "专业技术职务名称",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择专业技术职务名称",
            key: "a0215a_Code",
            name: "a0215a_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "专业技术职务级别",
            otherType: "select",
            required: false,
            placeholder: "请选择专业技术职务级别",
            key: "a0215c_Code",
            name: "a0215c_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "取得专技资格日期 ",
            otherType: "date",
            required: false,
            placeholder: "请选择取得专技资格日期",
            key: "a0604",
            name: "a0604",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "职业（工种）资格日期  ",
            otherType: "date",
            required: false,
            placeholder: "请选择职业（工种）资格日期 ",
            key: "a0603",
            name: "a0603",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "职业（工种）资格名称",
            otherType: "searchSelect",
            required: false,
            placeholder: "请选择职业（工种）资格名称",
            key: "a0601_Code",
            name: "a0601_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "职业资格等级（技能人员等级）",
            otherType: "select",
            required: false,
            placeholder: "请选择职业资格等级（技能人员等级）",
            key: "a0602_Code",
            name: "a0602_Code",
            val: void 0,
            children: [],
            status: ""
          }
        ]
      },
      delagateForm: {
        formInputs: [
          {
            title: "委托存档单位编号 ",
            type: "text",
            required: false,
            placeholder: "请输入委托存档单位编号 ",
            key: "b0102",
            name: "b0102",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "委托存档单位名称",
            type: "text",
            required: true,
            placeholder: "请输入委托存档单位名称",
            key: "b0101",
            name: "b0101",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "单位机构类型",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择单位机构类型",
            key: "b0103_Code",
            name: "b0103_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "委托存档单位组织机构代码",
            type: "text",
            required: false,
            placeholder: "请输入委托存档单位组织机构代码",
            key: "b0114",
            name: "b0114",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "单位所属行业",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择单位所属行业",
            key: "b0134_Code",
            name: "b0134_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "单位经济类型",
            otherType: "searchSelect",
            required: true,
            placeholder: "请选择单位经济类型",
            key: "b0105_Code",
            name: "b0105_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "行政区划 ",
            otherType: "addressSelect",
            required: false,
            placeholder: "请选择行政区划",
            key: "b0107",
            name: "b0107",
            val: void 0,
            children: [],
            status: ""
          }
        ]
      },
      archiveForm: {
        formInputs: [
          {
            title: "存档编号 ",
            type: "text",
            required: true,
            placeholder: "请输入存档编号",
            key: "dc030001",
            name: "dc030001",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "索引号",
            type: "text",
            required: false,
            placeholder: "请输入索引号",
            key: "a0002",
            name: "a0002",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "存档状态",
            otherType: "select",
            required: true,
            placeholder: "请选择存档状态",
            key: "dc030003",
            name: "dc030003",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "存档性质",
            otherType: "select",
            required: true,
            placeholder: "请选择存档性质",
            key: "dc030004",
            name: "dc030004",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "现档案管理机构名称",
            type: "text",
            required: true,
            placeholder: "请输入现档案管理机构名称",
            key: "a3807a",
            name: "a3807a",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "转入日期",
            otherType: "date",
            required: false,
            placeholder: "请选择转入日期",
            key: "a3801",
            name: "a3801",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "转入原因",
            otherType: "select",
            required: true,
            placeholder: "请选择转入原因",
            key: "a3803_Code",
            name: "a3803_Code",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "原存档单位名称 ",
            type: "text",
            required: true,
            placeholder: "请输入原存档单位名称 ",
            key: "a3802",
            name: "a3802",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "原存档单位行政区划 ",
            otherType: "addressSelect",
            required: false,
            placeholder: "请选择原存档单位行政区划",
            key: "dc030009",
            name: "dc030009",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "转出日期",
            otherType: "date",
            required: false,
            placeholder: "请选择转出日期",
            key: "dc030010",
            name: "dc030010",
            val: void 0,
            postname: "",
            status: ""
          },
          {
            title: "转出原因",
            otherType: "select",
            required: true,
            placeholder: "请选择转出原因",
            key: "dc030011",
            name: "dc030011",
            val: void 0,
            children: [],
            status: ""
          },
          {
            title: "转往档案单位名称  ",
            type: "text",
            required: true,
            placeholder: "请输入转往档案单位名称",
            key: "dc030012",
            name: "dc030012",
            val: void 0,
            maxlength: 20,
            minlength: 0,
            reg: "",
            tip: "",
            status: ""
          },
          {
            title: "转往档案单位行政区划  ",
            otherType: "addressSelect",
            required: false,
            placeholder: "请选择转往档案单位行政区划 ",
            key: "dc030013",
            name: "dc030013",
            val: void 0,
            children: [],
            status: ""
          }
        ]
      },
      hjCode: [], //户籍行政区划
      birthdayCode: [], //出生地行政区划
      workCode: [],//工作地行政区划
    };
  },
  updated() {},
  computed: {
    address() {
      return address;
    },
    exitsVal(){
      if(this.personBasicInfo){
            return  this.ifExist = Number(Boolean(this.personBasicInfo.a0101)) + 
            Number(Boolean(this.personBasicInfo.a0184)) +
            Number(Boolean(this.personBasicInfo.a0104)) +
            Number(Boolean(this.personBasicInfo.a0117)) + 
            Number(Boolean(this.personBasicInfo.a0107)) +
            Number(Boolean(this.personBasicInfo.a0141)) +
            Number(Boolean(this.personBasicInfo.a0914)) +
            Number(Boolean(this.personBasicInfo.a0834)) +
            Number(Boolean(this.personBasicInfo.a0888)) +
            Number(Boolean(this.personBasicInfo.a0807)) +
            Number(Boolean(this.personBasicInfo.a0824)) +
            Number(Boolean(this.personBasicInfo.a0827)) +
            Number(Boolean(this.personBasicInfo.a0202a)) +
            Number(Boolean(this.personBasicInfo.a0202b)) +
            Number(Boolean(this.personBasicInfo.a0202c)) +
            Number(Boolean(this.personBasicInfo.a0202d)) +
            Number(Boolean(this.personBasicInfo.a0211));
      } else{
        return this.ifExist = 0;
      }
    }
  },
  methods: {
    moment,
    getBasicInfoOther() {
      /***
       * 功能：基本信息选择项对应得value
       */
      //民族
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "Ethnic"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.nationalArr = res.data;
          }
        });
      //健康状况
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "HealthState"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.healthArr = res.data;
          }
        });
      //婚姻状况
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "MaritalStatus"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.marriageArr = res.data;
          }
        });
      //政治面貌
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "PoliticalStatus"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.politicsStatusArr = res.data;
          }
        });
      //最高学历
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "EducationBackground"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.educationArr = res.data;
          }
        });
      //最高学位
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "Degree"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.degreeArr = res.data;
          }
        });
      //工作单位经济类型
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "EconomicType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.economicArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //工作单位所属行业
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "BelongIndustry"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.industryArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //工作单位机构类型
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "OrganizationType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.workUnitArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //最高学历所学专业类别
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "Major"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.professionalArr = res.data;
          }
        });
      //工作职位(岗位)类型
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "PositionType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.positionArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //与本人关系
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "FamilyRelations"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.relationshipArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
            this.familyStaForm.formInputs[1].children = this.relationshipArr;
          }
        });
      //学习形式
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "StudyForm"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.studyFormArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //教育类别
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "EducationType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.educationTypeArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //奖励名称
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "RewardName"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.rewordNameArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //处罚名称
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "PunishmentName"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.punishmentNameArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //语言
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "LanguageType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.languageTypeArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //语种熟练程度
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "ProficiencyValue"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.languageProficiencyArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //职业资格等级（技能人员等级）
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "Technique"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.occupationLevelArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //专业技术职务名称
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "TechnicalCode"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.positionNameArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //专业技术职务级别
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "Professorlevel"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.positionLevelArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //存档状态
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "IsInware"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.saveRecordStaArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //存档性质
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "ArchivingType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.saveRecordNatureArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //转入原因
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "ArchReceiveType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.inReasonArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
      //转出原因
      this.$http
        .fetchGet("dictItem@getDictItemByDictCode.action", {
          dictCode: "ArchTransferType"
        })
        .then(res => {
          if (Number(res.code) === 0) {
            res.data.forEach(element => {
              this.outReasonArr.push({
                itemCode: element.itemCode,
                itemName: element.itemName
              });
            });
          }
        });
    },
    getBasicInfo(currId) {
      /***
       * 功能：获取基本信息:[编辑状态下可选择的信息返回值为code值，转化为对应的value显示]；
       */
      this.$http
        .fetchGet("informationPool@infoCollections.action", {
          a01000: this.currRowDataId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.personBasicInfo = res.data;
            this.imgUrl =
              this.$targetHost + this.personBasicInfo.imgPath.substr(2);
            this.hjCode = res.data["a0111d"].split(".");
            this.birthdayCode = res.data["a0114"].split(".");
            this.workCode = res.data["a0203"].split(".");
          }
        });
    },

    getPersonOtherInfo(currId) {
      // 获取个人信息的其他信息：工作经历等
      this.getWork(currId);
      this.getEducation(currId);
      this.getFamily(currId);
      this.getLanguage(currId);
      this.getAward(currId);
      this.getTrainer(currId);
      this.getProfessional(currId);
      this.getUnitSaveRecord(currId);
      this.getArchiveTableData(currId);
    },
    getWork(currId) {
      //获取工作经历
      this.$http
        .fetchGet("informationPool@findA02List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.workTableData = [];
            currTempData.forEach(element => {
              this.workTableData.push({
                key: element.a02000,
                a0157a: element.a0157a,
                a4801: element.a4801,
                a4804: element.a4804,
                a0215a: element.a0215a,
                a0202d: element.a0202d
              });
            });
          }
        })
        .catch(err => {});
    },
    getEducation(currId) {
      //获取教育经历
      this.$http
        .fetchGet("informationPool@findA08List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.educationTableData = [];
            currTempData.forEach(element => {
              this.educationTableData.push({
                key: element.a08000,
                a0801a: element.a0801a,
                a0801a_Code: element.a0801a_Code,
                a0804: element.a0804,
                a0807: element.a0807,
                a0814: element.a0814,
                a0824: element.a0824,
                a0824_Code: element.a0824_Code,
                a0837: element.a0837,
                a0837_Code: element.a0837_Code,
                a0838: element.a0838,
                a0838_Code: element.a0838_Code,
                a0901a: element.a0901a,
                a0901a_Code: element.a0901a_Code
              });
            });
          }
        })
        .catch(err => {});
    },
    getFamily(currId) {
      //获取家庭情况
      this.$http
        .fetchGet("informationPool@findA36List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.familyTableData = [];
            currTempData.forEach(element => {
              this.familyTableData.push({
                key: element.a36000,
                a3601: element.a3601,
                a3604a: element.a3604a,
                a3604a_Code: element.a3604a_Code,
                a3611: element.a3611
              });
            });
          }
        })
        .catch(err => {});
    },
    getAward(currId) {
      //获取奖惩情况
      this.$http
        .fetchGet("informationPool@findA14List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.historyTableData = [];
            currTempData.forEach(element => {
              this.historyTableData.push({
                key: element.a14000,
                a14Z204a: element.a14Z204a,
                a14Z204a_Code: element.a14Z204a_Code,
                a14Z211: element.a14Z211,
                a14Z214a: element.a14Z214a,
                a14Z304a: element.a14Z304a,
                a14Z304a_Code: element.a14Z304a_Code,
                a14Z307: element.a14Z307,
                a14Z311a: element.a14Z311a
              });
            });
          }
        })
        .catch(err => {});
    },
    getLanguage(currId) {
      //语言能力
      this.$http
        .fetchGet("informationPool@findDC0107ByA01Id.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.languageTableData = [];
            currTempData.forEach(element => {
              this.languageTableData.push({
                key: element.dc0107000,
                dc010701: element.dc010701,
                dc010701_Code: element.dc010701_Code,
                dc010702: element.dc010702,
                dc010702_Code: element.dc010702_Code,
                remark: element.remark
              });
            });
          }
        })
        .catch(err => {});
    },
    getTrainer(currId) {
      //获取培训经历
      this.$http
        .fetchGet("informationPool@findA11List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.trainTableData = [];
            currTempData.forEach(element => {
              this.trainTableData.push({
                key: element.a11000,
                a1107: element.a1107,
                a1111: element.a1111,
                a1114A: element.a1114A,
                a1131: element.a1131
              });
            });
          }
        })
        .catch(err => {});
    },
    getProfessional(currId) {
      //获取专业与职业技术
      this.$http
        .fetchGet("informationPool@findA06List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.professionalTableData = [];
            currTempData.forEach(element => {
              this.professionalTableData.push({
                key: element.a06000,
                a0215a: element.a0215a,
                a0215a_Code: element.a0215a_Code,
                a0215c: element.a0215c,
                a0215c_Code: element.a0215c_Code,
                a0601: element.a0601,
                a0601_Code: element.a0601_Code,
                a0603: element.a0603,
                a0604: element.a0604,
                a0602: element.a0602
              });
            });
          }
        })
        .catch(err => {});
    },
    getUnitSaveRecord(currId) {
      //委托单位存档数据
      this.$http
        .fetchGet("informationPool@findB0A01ByA01Id.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.delagateTableData = [];
            currTempData.forEach(element => {
              this.delagateTableData.push({
                key: element.b01000,
                b0101: element.b0101,
                b0102: element.b0102,
                b0103: element.b0103,
                b0103_Code: element.b0103_Code,
                b0105: element.b0105,
                b0105_Code: element.b0105_Code,
                b0114: element.b0114,
                b0134: element.b0134,
                b0134_Code: element.b0134_Code,
                b0107: element.b0107
              });
            });
          }
        })
        .catch(err => {});
    },
    getArchiveTableData(currId) {
      //档案转接数据
      this.$http
        .fetchGet("informationPool@findA38ByA01Id.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.archiveTableData = [];
            res.data.forEach(element => {
              this.archiveTableData.push({
                key: element.dc38000,
                dc030001: element.dc030001,
                a3807a: element.a3807a,
                a3801: element.a3801,
                a3803: element.a3803,
                a3803_Code: element.a3803_Code,
                a0002: element.a0002,
                dc030003: element.dc030003,
                dc030004: element.dc030004,
                a3802: element.a3802,
                dc030009: element.dc030009,
                dc030010: element.dc030010,
                dc030011: element.dc030011,
                dc030012: element.dc030012,
                dc030013: element.dc030013
              });
            });
          }
        })
        .catch(err => {});
    },

    conVersionData(keyVal, data) {
      /***
       * 功能：根据当前的属性值，查找对应的数组，判断匹配的data（拿到的itemCode）返回value
       */
      let tempData = [];
      let tempName = "";
      if (keyVal) {
        if (keyVal === "a0117") {
          //民族
          tempData = this.nationalArr;
        } else if (keyVal === "a0131") {
          //婚姻状况
          tempData = this.marriageArr;
        } else if (keyVal === "a0127") {
          //健康状况
          tempData = this.healthArr;
        } else if (keyVal === "a0141") {
          //政治面貌
          tempData = this.politicsStatusArr;
        } else if (keyVal === "a0914") {
          //最高学位
          tempData = this.degreeArr;
        } else if (keyVal === "a0834") {
          //最高学历
          tempData = this.educationArr;
        } else if (keyVal === "a0202b") {
          //工作单位经济类型
          tempData = this.economicArr;
        } else if (keyVal === "a0211") {
          //工作单位所属行业
          tempData = this.industryArr;
        } else if (keyVal === "a0202c") {
          //工作单位机构类型
          tempData = this.workUnitArr;
        } else if (keyVal === "a0827") {
          //最高学历所学专业类别
          tempData = this.professionalArr;
        } else if (keyVal === "a0202d") {
          //工作职位(岗位)类型
          tempData = this.professionalArr;
        }
        tempData.forEach(el => {
          if (el.itemCode === data) {
            tempName = el.itemName;
          }
        });
      } else {
        tempName = "";
      }
      return tempName;
    },
    nationalChange(value) {
      // console.log(`selected ${value}`);
    },
    genderChange(e) {
      // console.log("性别:", e.target.value);
    },
    birthdayChange(date, dateString) {
      //出生日期修改
      for (let key in this.personBasicInfo) {
        if (key === "a0107") {
          this.personBasicInfo[key] = dateString;
        }
      }
    },
    graduateChange(date, dateString) {
      //最高学历毕业日期修改
      for (let key in this.personBasicInfo) {
        if (key === "a0807") {
          this.personBasicInfo[key] = dateString;
        }
      }
    },
    joinWorkChange(date, dateString) {
      //参加工作年月
      for (let key in this.personBasicInfo) {
        if (key === "a0134") {
          this.personBasicInfo[key] = dateString;
        }
      }
    },
    hujiCodeChange(value) {
      //户籍行政区划
      // console.log(value);
      this.personBasicInfo["a0111d"] = value.join(".");
    },
    birthdayCodeChange(value) {
      //出生地行政区划
      this.personBasicInfo["a0114"] = value.join(".");
    },
    workCodeChange(value) {
      //工作地行政区划
      this.personBasicInfo["a0203"] = value.join(".");
    },
    uploadPhoto(info) {
      //上传照片
      if (info.file.status === "done") {
        // console.log(info);
        let currResImgUrl = info.fileList, len = info.fileList.length;
        this.personBasicInfo.imgPath = currResImgUrl[len - 1].response;
        
        getBase64(info.file.originFileObj, imgUrl => {
          this.imgUrl = imgUrl;
        });
      }
    },
    beforeUpload(file) {
      //上传照片前--照片格式校验
      
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("请上传JPEG格式!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片大小不能超过2M!");
      }
      return isJPG && isLt2M;
    },
    clearImgUrl() {
      //清空当前图片
      this.imgUrl = "";
    },
    regInput(val, minLength, maxLength, regways, tip) {
      /***
       * 功能：必填项验证
       * 参数：val:当前值; reg:验证方法
       */
      if (val) {
        if (regways) {
          let regResult = this.regs[regways](val);
          if (regResult === 0) {
            this.$message.error(tip);
            this.isRight = false;
          }
        } else {
          if (val.length > maxLength || val.length < minLength) {
            this.$message.error(tip);
            this.isRight = false;
          }
        }
      } else {
        this.$message.error(tip);
        this.isRight = false;
      }
    },
    getFinishData() {
      let tempBasicInfo = this.personBasicInfo;
      let isCloseModel = true;
      if (this.isRight) {
        if (this.operateStatusVal !== 1) {
          //编辑
          this.$http
            .fetchPost("informationPool@upDataPersonInfo.action", tempBasicInfo)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("提交成功");
                isCloseModel = true;
              }
            })
            .catch(err => {
              this.$message.error("提交失败");
              isCloseModel = false;
            });
        } else {
          //添加
          tempBasicInfo.upUnitId = this.addTreeNode["key"];
          this.$http
            .fetchPost(
              "informationPool@personInfoAdd.action?upUnitId=" +
                this.addTreeNode["key"],
              tempBasicInfo
            )
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("提交成功");
                isCloseModel = true;
              }
            })
            .catch(err => {
              this.$message.error("提交失败");
              isCloseModel = false;
            });
        }
      } else {
        this.$message.error("必填项不能为空");
        isCloseModel = false;
      }
      return  isCloseModel;
    },
    anchorClick(anchorId, indexVal) {
      //左侧锚点点击
      this.currClickAnchor = indexVal;
      let anchor = document.getElementById(anchorId);
      document.getElementsByClassName("right_container")[0].scrollTop =
        anchor.offsetTop - 60;
    },
    scrollAddListening(currScrollTopVal) {
      //右侧内容滚动条监听
      this.anchorList.forEach((item, index) => {
        this.$nextTick(() => {
          item.idscrollTop = document.getElementById(item.value).offsetTop;
        });
      });
      let tempAnchor = 0;
      this.anchorList.forEach((el, index) => {
        if (currScrollTopVal >= this.anchorList[index].idscrollTop) {
          if (
            this.anchorList[index + 1] &&
            currScrollTopVal <= this.anchorList[index + 1].idscrollTop
          ) {
            tempAnchor = index + 1;
          } else {
            tempAnchor = this.anchorList.length;
          }
        }
      });
      this.currClickAnchor = tempAnchor;
    },
    //从这里开始时模态框里的操作
    handleCancel() {
      /***
       * 功能：模态框取消操作
       */
      this.visible = false;
    },
    personOtherInfoOperate(data, curr, statusVal) {
      /***
       * 功能：通过操作状态和当前行数据，返回传给子组件tableFormSearch的值；
       * 参数：data:当前行数据； curr:当前信息； statusVal：当前操作状态
       */
      this.operateStatus = statusVal;
      this.currOperatePersonInfo = curr;
      this.visible = true;
      let initData = {};
      if (curr === "familySta") {
        if (statusVal === 0) {
          initData = {
            a3601: "",
            a3604a: "",
            a3611: "",
            a3604a_Code: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        this.personInfoForm = this.utils.getNewFormSearch(
          initData,
          this.familyStaForm
        );
      } else if (curr === "workExperience") {
        if (statusVal === 0) {
          //添加
          initData = {
            a0157a: "",
            a0202d: "",
            a0215a: "",
            a4801: "",
            a4804: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        this.personInfoForm = this.utils.getNewFormSearch(initData, this.workForm);
      } else if (curr === "educationExperience") {
        this.educationForm.formInputs.forEach(item => {
          if (item.key === "a0837_Code") {
            //教育类别
            item.children = this.educationTypeArr;
          } else if (item.key === "a0801a_Code") {
            //所获学历
            item.children = this.educationArr;
          } else if (item.key === "a0901a_Code") {
            //所获学位
            item.children = this.degreeArr;
          } else if (item.key === "a0824_Code") {
            //最高学历所学专业
            item.children = this.professionalArr;
          } else if (item.key === "a0838_Code") {
            //学习形式
            item.children = this.studyFormArr;
          }
        });
        if (statusVal === 0) {
          initData = {
            a0801a: "",
            a0801a_Code: "",
            a0804: "",
            a0807: "",
            a0814: "",
            a0824: "",
            a0824_Code: "",
            a0837: "",
            a0837_Code: "",
            a0838: "",
            a0838_Code: "",
            a0901a: "",
            a0901a_Code: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        // console.log(initData);
        this.personInfoForm = this.utils.getNewFormSearch(
          initData,
          this.educationForm
        );
      } else if (curr === "rewordsHistory") {
        this.rewordHistoryForm.formInputs.forEach(item => {
          if (item.key === "a14Z204a_Code") {
            item.children = this.rewordNameArr;
          } else if (item.key === "a14Z304a_Code") {
            item.children = this.punishmentNameArr;
          }
        });
        if (statusVal === 0) {
          initData = {
            a14Z204a: "",
            a14Z204a_Code: "",
            a14Z211: "",
            a14Z214a: "",
            a14Z304a: "",
            a14Z304a_Code: "",
            a14Z307: "",
            a14Z311a: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        this.personInfoForm = this.utils.getNewFormSearch(
          initData,
          this.rewordHistoryForm
        );
      } else if (curr === "languageAbility") {
        this.languageForm.formInputs.forEach(item => {
          if (item.key === "dc010701_Code") {
            item.children = this.languageTypeArr;
          } else if (item.key === "dc010702_Code") {
            item.children = this.languageProficiencyArr;
          }
        });
        if (statusVal === 0) {
          initData = {
            dc010701: "",
            dc010701_Code: "",
            dc010702: "",
            dc010702_Code: "",
            remark: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        // console.log(this.languageForm);
        this.personInfoForm = this.utils.getNewFormSearch(
          initData,
          this.languageForm
        );
      } else if (curr === "trainExperience") {
        if (statusVal === 0) {
          initData = {
            a1107: "",
            a1111: "",
            a1114A: "",
            a1131: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        this.personInfoForm = this.utils.getNewFormSearch(initData, this.trainerForm);
      } else if (curr === "professional") {
        this.professionalForm.formInputs.forEach(item => {
          if (item.key === "a0602_Code") {
            item.children = this.occupationLevelArr;
          } else if (item.key === "a0215a_Code") {
            item.children = this.positionNameArr;
          } else if (item.key === "a0215c_Code") {
            item.children = this.positionLevelArr;
          } else if (item.key === "a0601_Code") {
            item.children = this.positionArr;
          }
        });
        if (statusVal === 0) {
          initData = {
            a0215a: "",
            a0215c: "",
            a0601: "",
            a0602: "",
            a0603: "",
            a0604: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        // console.log(this.professionalForm);
        this.personInfoForm = this.utils.getNewFormSearch(
          initData,
          this.professionalForm
        );
      } else if (curr === "delagateData") {
        this.delagateForm.formInputs.forEach(item => {
          if (item.key === "b0103_Code") {
            item.children = this.workUnitArr;
          } else if (item.key === "b0105_Code") {
            item.children = this.economicArr;
          } else if (item.key === "b0134_Code") {
            item.children = this.industryArr;
          }
        });
        if (statusVal === 0) {
          initData = {
            b0101: "",
            b0102: "",
            b0103: "",
            b0103_Code: "",
            b0105: "",
            b0105_Code: "",
            b0107: "",
            b0114: "",
            b0134: "",
            b0134_Code: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        this.personInfoForm = this.utils.getNewFormSearch(
          initData,
          this.delagateForm
        );
      } else if (curr === "archiveData") {
        this.archiveForm.formInputs.forEach(item => {
          if (item.key === "a3803_Code") {
            item.children = this.inReasonArr;
          } else if (item.key === "dc030011") {
            item.children = this.outReasonArr;
          } else if (item.key === "dc030003") {
            item.children = this.saveRecordStaArr;
          } else if (item.key === "dc030004") {
            item.children = this.saveRecordNatureArr;
          }
        });
        if (statusVal === 0) {
          initData = {
            dc030001: "",
            a3807a: "",
            a3801: "",
            a3803: "",
            a3803_Code: "",
            a0002: "",
            dc030003: "",
            dc030004: "",
            a3802: "",
            dc030009: "",
            dc030010: "",
            dc030011: "",
            dc030012: "",
            dc030013: ""
          };
        } else {
          initData = data;
          this.currentId = data["key"];
        }
        this.personInfoForm = this.utils.getNewFormSearch(initData, this.archiveForm);
        // console.log(this.personInfoForm);
      }
    },

    handleOk() {
      /***
       * 功能：模态框点击提交按钮：当前获取的表单内容，把值为空的赋值为''; 不为空的为原值;
       */
      let formDataObj = this.$refs.infoForm.getFormData();
      let submitFormData =this.utils.transferFormToObj(formDataObj['resultData']);
      if(formDataObj['notRequiredHasDataRight'] && formDataObj['requiredFiledsRight']){
        this.operateSubmitData(submitFormData);
      }
    },
    operateSubmitData(dataObj) {
      /***
       * 功能:点击模态框得确认操作功能：提交数据
       */
      dataObj = this.transformDataObj(dataObj);
      if (this.operateStatus === 0) {
        //添加
        dataObj = Object.assign({}, dataObj, { a01000: this.currRowDataId });
        if (this.currOperatePersonInfo === "familySta") {
          this.$http
            .fetchPost("familyInformationEditor@doAddFamily.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getFamily(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "workExperience") {
          this.$http
            .fetchPost("workInfomationEditor@doAddWork.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getWork(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "educationExperience") {
          this.$http
            .fetchPost("informationEditor@doAddEducation.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getEducation(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "rewordsHistory") {
          this.$http
            .fetchPost("rewardInfomationEditor@doAddReward.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getAward(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "languageAbility") {
          this.$http
            .fetchPost("languageAbility@doLanguageAbilityInfo.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getLanguage(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "trainExperience") {
          this.$http
            .fetchPost("trainInformationEditor@doAddTrain.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getTrainer(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "professional") {
          this.$http
            .fetchPost("technologyInformation@doAddTechnology.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getProfessional(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "delagateData") {
          this.$http
            .fetchPost("ArchCompany@doAddarchCompany.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getUnitSaveRecord(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        } else if (this.currOperatePersonInfo === "archiveData") {
          this.$http
            .fetchPost(
              "archReceiveAndOut@doAddarchReceiveAndOut.action",
              dataObj
            )
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("添加成功");
                this.getArchiveTableData(this.currRowDataId);
              } else {
                this.$message.error("添加失败");
              }
            })
            .catch(err => {
              this.$message.error("添加失败");
            });
        }
      } else {
        //编辑
        if (this.currOperatePersonInfo === "familySta") {
          dataObj = Object.assign({}, dataObj, { a36000: this.currentId });
          this.$http
            .fetchPost("familyInformationEditor@updataFamily.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getFamily(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "workExperience") {
          dataObj = Object.assign({}, dataObj, { a02000: this.currentId });
          this.$http
            .fetchPost("workInfomationEditor@updateWork.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getWork(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "educationExperience") {
          dataObj = Object.assign({}, dataObj, { a08000: this.currentId });
          this.$http
            .fetchPost("informationEditor@updataEducation.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getEducation(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "rewordsHistory") {
          dataObj = Object.assign({}, dataObj, { a14000: this.currentId });
          this.$http
            .fetchPost("rewardInfomationEditor@updataReward.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getAward(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "languageAbility") {
          dataObj = Object.assign({}, dataObj, { dc0107000: this.currentId });
          this.$http
            .fetchPost(
              "languageAbility@updataLanguageAbilityInfo.action",
              dataObj
            )
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getLanguage(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "trainExperience") {
          dataObj = Object.assign({}, dataObj, { a11000: this.currentId });
          this.$http
            .fetchPost("trainInformationEditor@updataTrain.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getTrainer(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "professional") {
          dataObj = Object.assign({}, dataObj, { a06000: this.currentId });
          this.$http
            .fetchPost("technologyInformation@updateTechnology.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getProfessional(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "delagateData") {
          dataObj = Object.assign({}, dataObj, { b01000: this.currentId });
          this.$http
            .fetchPost("ArchCompany@updateCompanyInfo.action", dataObj)
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getUnitSaveRecord(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        } else if (this.currOperatePersonInfo === "archiveData") {
          dataObj = Object.assign({}, dataObj, { dc38000: this.currentId });
          this.$http
            .fetchPost(
              "archReceiveAndOut@updateArchReceiveAndOut.action",
              dataObj
            )
            .then(res => {
              if (Number(res.code) === 0) {
                this.$message.success("编辑成功");
                this.getArchiveTableData(this.currRowDataId);
              } else {
                this.$message.error("编辑提交失败");
              }
            })
            .catch(err => {
              this.$message.error("编辑提交失败");
            });
        }
      }
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },

    transformDataObj(currDataObj) {
      /***
       * 功能：当前提交对象，属性为时间的修改为字符串格式，return回去
       * 参数：currDataObj:当前提交的对象
       */
      if (currDataObj) {
        for (let i in currDataObj) {
          if (
            i === "a4801" ||
            i === "a4804" ||
            i === "a0804" ||
            i === "a0807" ||
            i === "a14Z211" ||
            i === "a14Z307" ||
            i === "a1107" ||
            i === "a1111" ||
            i === "a0603" ||
            i === "a0604" ||
            i === "a3801" ||
            i === "dc030010"
          ) {
            currDataObj[i] = this.moment(currDataObj[i]).format("YYYY-MM-DD");
          } else if (i === "dc030009" || i === "dc030013" || i === "b0107") {
            // console.log(currDataObj[i]);
            let tempAddressStr = "";
            currDataObj[i].forEach(item => {
              tempAddressStr += item + ".";
            });
            currDataObj[i] = tempAddressStr.substring(
              0,
              tempAddressStr.length - 1
            );
          } else {
            let tempKey = i.split("_");
            if (tempKey.length > 1) {
              currDataObj[tempKey[0]] = currDataObj[i];
            } else {
              currDataObj[i] = currDataObj[i];
            }
          }
        }
        return currDataObj;
      }
    },

    editInOperateDelete(currInfo, data) {
      /***
       * 编辑状态下：表格里面的删除操作
       * currInfo：操作的哪一个信息； data:当前的值
       */
      if (currInfo === "familySta") {
        this.$http
          .fetchGet("familyInformationEditor@delFamily.action", {
            a36000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getFamily(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "workExperience") {
        this.$http
          .fetchGet("workInfomationEditor@delWork.action", {
            a02000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getWork(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "educationExperience") {
        this.$http
          .fetchGet("informationEditor@delEducation.action", {
            a08000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getEducation(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "rewordsHistory") {
        this.$http
          .fetchGet("rewardInfomationEditor@delReward.action", {
            a14000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getAward(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "languageAbility") {
        this.$http
          .fetchGet("languageAbility@delLanguageAbilityInfo.action", {
            dc0107000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getLanguage(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "trainExperience") {
        this.$http
          .fetchGet("trainInformationEditor@delTrain.action", {
            a11000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getTrainer(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "professional") {
        this.$http
          .fetchGet("technologyInformation@delTechnology.action", {
            a06000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getProfessional(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "delagateData") {
        this.$http
          .fetchGet("ArchCompany@deleteById.action", {
            b01000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getUnitSaveRecord(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      } else if (currInfo === "archiveData") {
        this.$http
          .fetchGet("archReceiveAndOut@deleteById.action", {
            dc38000: data.key
          })
          .then(res => {
            if (Number(res.code) === 0) {
              this.$message.success("删除成功");
              this.getArchiveTableData(this.currRowDataId);
            } else {
              this.$message.success("删除失败");
            }
          })
          .catch(err => {
            this.$message.error("删除失败");
          });
      }
    }
  },
  watch: {
    operateStatusVal: {
      handler(newVal) {
        if (newVal === 1) {
          //添加操作
          this.personBasicInfo = this.addInitPersonBasicInfo;
        } else {
          //浏览或编辑操作
          this.getBasicInfo(this.currRowDataId);
        }
      }
    },
    currRowDataId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          //有传过来的id：编辑和浏览操作
          this.getBasicInfo(newVal); //人员基本信息
          this.getPersonOtherInfo(newVal);
        } else {
          //没有id值：添加操作
          this.personBasicInfo = this.addInitPersonBasicInfo;
        }
      }
    },
    addSelectTreeNode: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.addTreeNode = newVal;
        }
      }
    },
    currentId: {
      immediate: true,
      handler(newVal) {
        this.currentId = newVal;
      }
    },
    ifExist:{
      immediate: true,
      handler(newVal){
        // console.log('newVal:'+ Number(newVal));
        if(Number(newVal) === 17){  //required全有值
          this.isRight = true;
        } else{
          //至少有一个没值
          this.isRight = false;
        }
      }
    }
  }
};
</script>
<style scoped>
.infoTable {
  width: 100%;
  border: 1px solid #ddd;
}

.infoTable thead tr th,
.infoTable tbody tr td {
  text-align: center;
  line-height: 50px;
  white-space: nowrap;
  width: 80px;
}

.info_input {
  border: none;
  text-align: center;
  padding: 0;
  height: auto;
  line-height: 50px;
}

.info_select {
  width: 150px;
}

.outerContainer,
.tabContainer,
.tabView {
  width: 100%;
  height: 100%;
}

.tabView {
  display: flex;
  justify-content: center;
}

.left_anchor {
  width: 180px;
  padding: 0 5px;
  overflow: auto;
}

.left_anchor::-webkit-scrollbar {
  width: 0;
}

.left_anchor a {
  padding-left: 20px;
  display: block;
  width: 100%;
  line-height: 40px;
  text-decoration: none;
  border-left: 1px solid #ccc;
}

.left_anchor a:hover {
  color: #aad4fc;
}

.left_anchorClick {
  color: #1890ff;
  position: relative;
}

.left_anchorClick::before {
  content: "";
  position: absolute;
  left: -4.5px;
  top: 0;
  bottom: 0;
  margin: auto auto auto 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #1890ff;
}

.right_container {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 30px;
}
.right_containerWidth {
  width: calc(100% - 180px);
}
.right_containeraddWidth {
  width: 100%;
}

.otherinfo {
  margin: 40px 0;
}
.otherinfo p.title {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.add_info_btn {
  display: block;
  margin: 0;
  text-decoration: none;
  text-align: center;
  border: 1px solid #e8e8e8;
  border-top: none;
}
</style>

