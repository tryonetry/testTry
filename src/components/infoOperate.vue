<template>
  <!-- 人才信息总库操作:查看详情、编辑、添加 -->
  <div class="outerContainer">
    <a-tabs class="tabContainer" defaultActiveKey="1">
      <a-tab-pane class="tabView" tab="人员信息浏览" key="1">
        <div class="left_anchor">
          <a
            v-for="(item, index) in anchorList"
            :key="index"
            href="javascript:void(0)"
            @click="anchorClick(item.value, index)"
            :class="{'left_anchorClick': index == currClickAnchor}"
          >{{item.name}}</a>
        </div>
        <div class="right_container right_containerWidth">
          <!-- 1-基本信息 -->
          <div class="basicInfo" id="anchor_basicInfo" ref="anchor_basicInfo">
            <table class="infoTable" border="1">
              <thead>
                <tr>
                  <th colspan="24">
                    <h2 style="font-size: 18px;">人员基本信息表</h2>
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
                      class="info_input required_input"
                      type="text"
                      placeholder="姓名"
                      maxlength="40"
                      v-model="personBasicInfo.a0101"
                      @blur="regInput(personBasicInfo.a0101, 2, 40, null, '请输入正确的姓名', $event, 'a0101')"
                      ref="reqiuredList0"
                      data-type="basicInfoRequire"
                    >{{personBasicInfo.a0101}}</a-input>
                  </td>
                  <td colspan="4">
                    公民身份号码/社保卡号
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0184}}</span>
                    <a-input
                      class="info_input required_input"
                      type="text"
                      placeholder="身份证号码"
                      maxlength="18"
                      v-model="personBasicInfo.a0184"
                      v-show="operateStatusVal !== 2"
                      @blur="regInput(personBasicInfo.a0184, 15, 18,'testid', '请输入正确的身份证号', $event, 'a0184')"
                      ref="reqiuredList1"
                      data-type="basicInfoRequire"
                    ></a-input>
                  </td>
                  <td colspan="2" rowspan="4">
                    <img :src="imgUrl" alt="照片" style="width: 130px;height: 180px;" />
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
                    >{{personBasicInfo.a0104 === '1' ? '男' : (personBasicInfo.a0104 === '2' ? '女' : (personBasicInfo.a0104 === '9' ? '未说明的性别' : '未知的性别'))}}</span>
                    <a-radio-group
                      :options="genderOptions"
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
                    >{{this.conVersionData('a0117', personBasicInfo.a0117, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0117"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList3"
                      data-type="basicInfoRequire"
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
                      ref="reqiuredList4"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0141', personBasicInfo.a0141, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0141"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList5"
                      data-type="basicInfoRequire"
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
                      @blur="regInput(personBasicInfo.a3707c, null, null, 'testMobile', '请输入正确的手机号码', $event, 'a0101')"
                    ></a-input>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">婚姻状况</td>
                  <td colspan="4">
                    <span
                      class="info_view"
                      v-show="operateStatusVal == 2"
                    >{{this.conVersionData('a0131', personBasicInfo.a0131, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
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
                      @blur="regInput(personBasicInfo.a3708, 2, 40,'testEmail', '请输入正确的电子邮箱地址', $event, 'a3708')"
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
                    >{{this.conVersionData('a0834', personBasicInfo.a0834, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0834"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList6"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0914', personBasicInfo.a0914, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0914"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList7"
                      data-type="basicInfoRequire"
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
                      class="info_input required_input"
                      type="text"
                      placeholder="毕业院校"
                      v-model="personBasicInfo.a0888"
                      v-show="operateStatusVal !== 2"
                      maxlength="20"
                      @blur="regInput(personBasicInfo.a0888, 2, 20, null, '请输入正确的毕业院校', $event, 'a0888')"
                      ref="reqiuredList8"
                      data-type="basicInfoRequire"
                    ></a-input>
                  </td>
                  <td colspan="2" v-show="operateStatusVal !== 2">
                    <div>
                      <!-- action="http://192.168.1.215:8181/hasngcadrefile/informationPool@uploadImgNoUsed.action" -->
                      <a-upload
                        class="avatar-uploader"
                        listType="picture"
                        :showUploadList="false"
                        :beforeUpload="beforeUpload"
                        @change="uploadPhoto"
                        :action="imgUploadUrl"
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
                      ref="reqiuredList9"
                      data-type="basicInfoRequire"
                    />
                  </td>
                  <td colspan="2">
                    最高学历所学专业
                    <sup style="color:red;">*</sup>
                  </td>
                  <td colspan="6">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0824}}</span>
                    <a-input
                      class="info_input  required_input"
                      type="text"
                      placeholder="最高学历所学专业"
                      v-model="personBasicInfo.a0824"
                      v-show="operateStatusVal !== 2"
                      maxlength="20"
                      @blur="regInput(personBasicInfo.a0824, 2, 20, null, '请输入正确的专业名称', $event, 'a0824')"
                      ref="reqiuredList10"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0827', personBasicInfo.a0827, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0827"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList11"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0127', personBasicInfo.a0127, 'itemCode')}}</span>
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
                      class="info_input required_input"
                      type="text"
                      placeholder="工作单位名称"
                      v-model="personBasicInfo.a0202a"
                      v-show="operateStatusVal !== 2"
                      maxlength="40"
                      @blur="regInput(personBasicInfo.a0202a, 2, 40, null, '请输入正确的工作单位', $event, 'a0202a')"
                      ref="reqiuredList12"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0202d', personBasicInfo.a0202d, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0202d"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList13"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0202c', personBasicInfo.a0202c, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0202c"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList14"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0202b', personBasicInfo.a0202b, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0202b"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList15"
                      data-type="basicInfoRequire"
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
                    >{{this.conVersionData('a0211', personBasicInfo.a0211, 'itemCode')}}</span>
                    <a-select
                      class="info_select"
                      placeholder="请选择"
                      v-model="personBasicInfo.a0211"
                      v-show="operateStatusVal !== 2"
                      ref="reqiuredList16"
                      data-type="basicInfoRequire"
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
                  <td colspan="4">户口所在地址</td>
                  <td colspan="4">
                    <span class="info_view" v-show="operateStatusVal == 2">{{personBasicInfo.a0181}}</span>
                    <a-input
                      class="info_input"
                      type="text"
                      placeholder="户口所在地址"
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
          </div>
          <!-- v-show="operateStatusVal !== 1" -->
          <div class="otherInfo">
            <!-- 2-工作经历 -->
            <div id="workExperience" class="otherinfo">
              <p class="title">工作经历</p>
              <div class="tableViewsCon">
                <TableView :initArrData="workInitArr"  :loading="workTableLoading" ref='editTable1' data-type="editTableRequire"></TableView>
              </div>
            </div>
            <!-- 3-教育经历 -->
            <div id="educationExperience" class="otherinfo">
              <p class="title">教育经历</p>
              <div class="tableViewsCon">
                <TableView :initArrData="eduInitArr" :loading="eduTableLoading"  ref='editTable2' data-type="editTableRequire"></TableView>
              </div>
            </div>
            <!-- 4-家庭情况 -->
            <div id="familySta" class="otherinfo">
              <p class="title">家庭情况</p>
              <div class="tableViewsCon">
                <TableView :initArrData="familyInitArr" :loading="familyTableLoading"  ref='editTable3' data-type="editTableRequire"></TableView>
              </div>
            </div>
            <!-- 5-奖惩历史 -->
            <div id="rewordsHistory" class="otherinfo">
              <p class="title">奖惩历史</p>
              <div class="tableViewsCon">
                <TableView :initArrData="rewordInitArr" :loading="rewordTableLoading"  ref='editTable4' data-type="editTableRequire"></TableView>
              </div>
            </div>
            <!-- 6-语言能力 -->
            <div id="languageAbility" class="otherinfo">
              <p class="title">语言能力</p>
              <div class="tableViewsCon">
                <TableView :initArrData="languageInitArr" :loading="languageTableLoading"  ref='editTable5' data-type="editTableRequire"></TableView>
              </div>
            </div>
            <!-- 7-培训经历 -->
            <div id="trainExperience" class="otherinfo">
              <p class="title">人员培训信息</p>
              <div class="tableViewsCon">
                <TableView :initArrData="trainerInitArr" :loading="trainerTableLoading"  ref='editTable6' data-type="editTableRequire"></TableView>
              </div>
            </div>
            <!-- 8-专业与职业技术 -->
            <div id="professional" class="otherinfo">
              <p class="title">专业与职业技术</p>
              <div class="tableViewsCon">
                <TableView :initArrData="professionalInitArr" :loading="professionalTableLoading"></TableView>
              </div>
            </div>
            <!-- 9-委托单位存档数据 -->
            <div id="delagateData" class="otherinfo"  v-if="personBasicInfo">
              <p class="title">委托单位存档数据</p>
              <div class="tableViewsCon" v-show="operateStatusVal == 2">
                 <span style="padding-left:20px;">委托存档单位:</span>
                 <span class="info_view">{{this.conVersionData('delagate', personBasicInfo.companyId, 'itemId')}}</span>
              </div>
              <div class="tableViewsCon" v-show="operateStatusVal !== 2">
                <span style="padding-left:20px;">请选择委托存档单位名称：</span>
                 <!-- @change="delagateChange" -->
                <a-select placeholder="请选择委托存档单位名称"  style="width: 40%;" v-model="personBasicInfo.companyId">
                  <a-select-option v-for="item in delagateUnitList" :key="item.itemId">{{item.itemName}}</a-select-option>
                </a-select>
              </div> 
            </div>
            <!-- 10-档案接转数据 -->
            <div id="archiveData" class="otherinfo">
              <p class="title">档案接转数据</p>
              <div class="tableViewsCon">
                <TableView :initArrData="archiveInitArr" :loading="archiveTableLoading"  ref='editTable7' data-type="editTableRequire"></TableView>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane class="tabView" tab="人员档案目录" key="2" v-if="operateStatusVal == 2">
        <DocDirectory :userId="currRowDataId" :ramdomKey="ramdomKey"></DocDirectory>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import moment from "moment";
import address from "../../public/json/address.js";
import DocDirectory from "./docDirectory";
import regs from "../utils/regexp.js";
import utils from "../utils/util.js";
import TableView from "@/components/tableView";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  name: "InfoOperate",
  props: [
    "operateStatusVal",
    "currRowDataId",
    "addSelectTreeNode",
    "ramdomKey"
  ],
  components: {
    DocDirectory,
    TableView
  },
  created() {
    
  },
  mounted() {
    this.getColumnDataFun(this.operateStatusVal);   //根据当前操作值--替换表头
    this.getDelagateUnitListFun();  //获取委托存档单位：单位列表数据

    if (this.operateStatusVal !== 1) {
      //浏览、编辑
      this.getBasicInfo(this.currRowDataId); //人员基本信息
      this.getPersonOtherInfo(this.currRowDataId);
    } else {
      //添加
      this.addTreeNode = this.addSelectTreeNode;
      this.getPersonOtherInfo(null);
    }

    window.addEventListener("scroll", this.scrollAddListening,true);
  },
  data() {
    return {
      regs,
      utils,
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
        a0107: moment(new Date()).format("YYYY-MM-DD"),
        a0111: "",
        a0111d: "",
        a0111dName: "",
        a0114: "",
        a0114Name: "",
        a0117: "01",
        a0127: "1",
        a0131: "1",
        a0134: moment(new Date()).format("YYYY-MM"),
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
        a0807: moment(new Date()).format("YYYY-MM-DD"),
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
        uSortNo: "",
        companyId: ''
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

      workInitArr:null,  //工作经历表头
      workTableLoading: false,
      workViewInitArr:{
        //浏览--工作经历
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr:[
          { title: "所在工作单位名称", dataIndex: "a0157a", key: "a0157a", width: 350 },
          { title: "从事工作或担任职务", dataIndex: "a0215a", key: "a0215a", width: 300 },
          { title: "工作起始日期", dataIndex: "a4801", key: "a4801", width: 200 },
          { title: "工作终止日期", dataIndex: "a4804", key: "a4804", width: 200 },
          { title: "单位证明人", dataIndex: "a0202dwork", key: "a0202dwork" }
        ],
        tabledataArr:[]
      },
      workEditInitArr: {
        //编辑--工作经历
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol: [
          "a0157a_editInput",
          "a4801_editDateInput",
          "a4804_editDateInput",
          "a0215a_editInput",
          "a0215a_editInput",
          "a0202dwork_editInput",
          '所在工作单位名称_requireTitle',
          '从事工作或担任职务_requireTitle',
          '工作起始日期_requireTitle',
          '工作终止日期_requireTitle'
        ],
        columnsArr: [
          {
            dataIndex: "a0157a",
            key: "a0157a",
            width: 350,
            slots: { title: '所在工作单位名称_requireTitle' },
            scopedSlots: { customRender: "a0157a_editInput" }
          },
          {
            dataIndex: "a0215a",
            key: "a0215a",
            width: 300,
            slots: { title: '从事工作或担任职务_requireTitle' },
            scopedSlots: { customRender: "a0215a_editInput" }
          },
          {
            dataIndex: "a4801",
            key: "a4801",
            width: 200,
            slots: { title: '工作起始日期_requireTitle' },
            scopedSlots: { customRender: "a4801_editDateInput" },
            dateFormat: "YYYY-MM-DD"
          },
          {
            dataIndex: "a4804",
            key: "a4804",
            width: 250,
            slots: { title: '工作终止日期_requireTitle' },
            scopedSlots: { customRender: "a4804_editDateInput" },
            dateFormat: "YYYY-MM-DD"
          },
          {
            title: "单位证明人",
            dataIndex: "a0202dwork",
            key: "a0202dwork",
            scopedSlots: { customRender: "a0202dwork_editInput" }
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 200,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },

      eduInitArr: null, //教育经历表头
      eduTableLoading: false,
      eduViewInitArr: {
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr: [
          { title: "所在学校", dataIndex: "a0814", key: "a0814", width: 300 },
          { title: "教育类别", dataIndex: "a0837", key: "a0837", width: 150 },
          { title: "学习形式", dataIndex: "a0838", key: "a0838", width: 150 },
          {
            title: "所学专业名称",
            dataIndex: "a0824a08",
            key: "a0824a08",
            width: 200 
          },
          { title: "所获学位", dataIndex: "a0901a", key: "a0901a", width: 150  },
          {
            title: "所获学历",
            dataIndex: "a0801a",
            key: "a0801a",
            width: 150 
          },
          { title: "学习起始日期", dataIndex: "a0804", key: "a0804", width: 150  },
          { title: "学习终止日期", dataIndex: "a0807", key: "a0807" }
        ],
        tabledataArr:[]
      },
      eduEditInitArr: {
        //编辑--教育经历--tableView
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol: [
          "a0814_editInput", 
          'a0837_editSelectInput',
          'a0838_editSelectInput',
          'a0824a08_editSelectInput',
          'a0901a_editSelectInput',
          'a0801a_editSelectInput',
          'a0804_editDateInput',
          'a0807_editDateInput',
          '所在学校_requireTitle',
          '教育类别_requireTitle',
          '学习形式_requireTitle',
          '所获学历_requireTitle'
        ],
        columnsArr: [
          {
            dataIndex: "a0814",
            key: "a0814",
            width: 200,
            slots: { title: '所在学校_requireTitle' },
            scopedSlots: { customRender: "a0814_editInput" }
          },
          {
            dataIndex: "a0837",
            key: "a0837",
            width: 150,
            slots: { title: '教育类别_requireTitle' },
            scopedSlots: { customRender: "a0837_editSelectInput" },
            itemChildren: []
          },
          {
            dataIndex: "a0838",
            key: "a0838",
            width: 150,
            slots: { title: '学习形式_requireTitle' },
            scopedSlots: { customRender: "a0838_editSelectInput" },
            itemChildren:[]
          },
          {
            title:'所学专业名称',
            dataIndex: "a0824a08",
            key: "a0824a08",
            width: 200,
            scopedSlots: { customRender: "a0824a08_editSelectInput" },
            itemChildren:[]
          },
          {
            title:'所获学位',
            dataIndex: "a0901a",
            key: "a0901a",
            width: 200,
            scopedSlots: { customRender: "a0901a_editSelectInput" },
            itemChildren:[]
          },
          {
            dataIndex: "a0801a",
            key: "a0801a",
            width: 200,
            slots: { title: '所获学历_requireTitle' },
            scopedSlots: { customRender: "a0801a_editSelectInput" },
            itemChildren:[]
          },
          {
            title:'学习起始日期',
            dataIndex: "a0804",
            key: "a0804",
            width: 200,
            scopedSlots: { customRender: "a0804_editDateInput" },
            dateFormat: "YYYY-MM-DD"
          },
          {
            title:'学习终止日期',
            dataIndex: "a0807",
            key: "a0807",
            scopedSlots: { customRender: "a0807_editDateInput" },
            dateFormat: "YYYY-MM-DD"
          },
          {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 200,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },

      familyInitArr: null,  //家庭情况表头
      familyTableLoading: false,
      familyViewInitArr:{
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr: [
          { title: "姓名", dataIndex: "a3601", key: "a3601", width: 400 },
          { title: "与本人关系", dataIndex: "a3604a", key: "a3604a", width: 400 },
          { title: "家庭成员工作单位及职务", dataIndex: "a3611", key: "a3611" }
        ],
        tabledataArr:[]
      },
      familyEditInitArr:{
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol: [
          'a3601_editInput',
          'a3604a_editSelectInput',
          'a3611_editInput',
          '姓名_requireTitle',
          '与本人关系_requireTitle'
        ],
        columnsArr: [
          { 
            dataIndex: "a3601", 
            key: "a3601",
            width:400,
            slots: { title: '姓名_requireTitle' },
            scopedSlots: { customRender: "a3601_editInput" }
          },
          { 
            dataIndex: "a3604a", 
            key: "a3604a",
            width:400,
            slots: { title: '与本人关系_requireTitle' },
            scopedSlots: { customRender: "a3604a_editSelectInput" },
            itemChildren: []
          },
          { 
            title: "家庭成员工作单位及职务", 
            dataIndex: "a3611", 
            key: "a3611",
            scopedSlots: { customRender: "a3611_editInput" }
          },
          {
            title: "操作",
            key: "action",
            width:150,
            fixed:'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[]
      },

      rewordInitArr: null,  //奖惩历史
      rewordTableLoading: false,
      rewordViewInitArr:{
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr: [
          { title: "奖励名称", dataIndex: "a14Z204a", key: "a14Z204a", width: 200 },
          { title: "奖励批准日期", dataIndex: "a14Z211", key: "a14Z211", width: 200 },
          { title: "奖励批准单位名称", dataIndex: "a14Z214a", key: "a14Z214a", width: 300 },
          { title: "处分名称", dataIndex: "a14Z304a", key: "a14Z304a", width: 200 },
          { title: "处分批准日期", dataIndex: "a14Z307", key: "a14Z307", width: 200 },
          { title: "处分批准单位名称", dataIndex: "a14Z311a", key: "a14Z311a" }
        ],
        tabledataArr:[]
      },
      rewordEditInitArr:{
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol: [
          'a14Z204a_editSelectInput',
          'a14Z211_editDateInput',
          'a14Z214a_editInput',
          'a14Z304a_editSelectInput',
          'a14Z307_editDateInput',
          'a14Z311a_editInput',
          '奖励批准日期_requireTitle',
          '奖励批准单位名称_requireTitle',
          '处分批准日期_requireTitle',
          '处分批准单位名称_requireTitle'
        ],
        columnsArr:[
          { 
            title: "奖励名称", 
            dataIndex: "a14Z204a", 
            key: "a14Z204a",
            width: 300,
            scopedSlots: {customRender: "a14Z204a_editSelectInput" },
            itemChildren:[]
          },
          { 
            dataIndex: "a14Z211", 
            key: "a14Z211",
            width: 200,
            slots: { title: '奖励批准日期_requireTitle' },
            scopedSlots: { customRender: "a14Z211_editDateInput" },
            dateFormat: "YYYY-MM-DD" 
          },
          { 
            dataIndex: "a14Z214a", 
            key: "a14Z214a",
            width: 250,
            slots: { title: '奖励批准单位名称_requireTitle' },
            scopedSlots: { customRender: "a14Z214a_editInput" } 
          },
          { 
            title: "处分名称", 
            dataIndex: "a14Z304a", 
            key: "a14Z304a",
            width: 300,
            scopedSlots: { customRender: "a14Z304a_editSelectInput" },
            itemChildren:[]  
          },
          { 
            dataIndex: "a14Z307", 
            key: "a14Z307",
            width: 200,
            slots: { title: '处分批准日期_requireTitle' },
            scopedSlots: { customRender: "a14Z307_editDateInput" },
            dateFormat: "YYYY-MM-DD"  
          },
          { 
            dataIndex: "a14Z311a", 
            key: "a14Z311a",
            slots: { title: '处分批准单位名称_requireTitle' },
            scopedSlots: { customRender: "a14Z311a_editInput" }  
          },
          {
            title: "操作",
            key: "action",
            fixed: 'right',
            width: 150,
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[]
      },

      languageInitArr:null,  //语言能力
      languageTableLoading: false,
      languageViewInitArr:{
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr: [
          { title: "语种", dataIndex: "dc010701", key: "dc010701", width: 350 },
          { title: "熟练程度", dataIndex: "dc010702", key: "dc010702", width: 350 },
          { title: "备注", dataIndex: "remark", key: "remark" }
        ],
        tabledataArr:[]
      },
      languageEditInitArr:{
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol: [
          'dc010701_editSelectInput',
          'dc010702_editSelectInput',
          'remark_editInput',
          '语种_requireTitle',
          '熟练程度_requireTitle'
        ],
        columnsArr:[
          {  
            dataIndex: "dc010701", 
            key: "dc010701",
            width: 300,
            slots: { title: '语种_requireTitle' },
            scopedSlots: {customRender: "dc010701_editSelectInput" },
            itemChildren:[]
          },
          {  
            dataIndex: "dc010702", 
            key: "dc010702",
            width: 300,
            slots: { title: '熟练程度_requireTitle' },
            scopedSlots: {customRender: "dc010702_editSelectInput" },
            itemChildren:[] 
          },
          {  
            title:'备注',
            dataIndex: "remark", 
            key: "remark",
            scopedSlots: { customRender: "remark_editInput" }  
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[]
      },

      trainerInitArr: null, //培训经历
      trainerTableLoading: false,
      trainerViewInitArr:{
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr: [
          { title: "培训班名称", dataIndex: "a1131", key: "a1131", width: 400 },
          { title: "培训起始日期", dataIndex: "a1107", key: "a1107", width: 300 },
          { title: "培训终止日期", dataIndex: "a1111", key: "a1111", width: 300 },
          { title: "培训主办单位名称", dataIndex: "a1114A", key: "a1114A" }
        ],
        tabledataArr:[]
      },
      trainerEditInitArr:{
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol:[
          'a1131_editInput',
          'a1107_editDateInput',
          'a1111_editDateInput',
          'a1114A_editInput',
          '培训班名称_requireTitle',
          '培训起始日期_requireTitle',
          '培训终止日期_requireTitle',
          '培训主办单位名称_requireTitle'
        ],
        columnsArr:[
          {  
            dataIndex: "a1131", 
            key: "a1131",
            width: 400,
            slots: { title: '培训班名称_requireTitle' },
            scopedSlots: { customRender: "a1131_editInput" },

          },
          { 
            dataIndex: "a1107", 
            key: "a1107",
            width: 300,
            slots: { title: '培训起始日期_requireTitle' },
            scopedSlots: { customRender: "a1107_editDateInput" },
            dateFormat: "YYYY-MM-DD" 
          },
          { 
            dataIndex: "a1111", 
            key: "a1111",
            width: 300,
            slots: { title: '培训终止日期_requireTitle' },
            scopedSlots: { customRender: "a1111_editDateInput" },
            dateFormat: "YYYY-MM-DD"  
          },
          { 
            dataIndex: "a1114A", 
            key: "a1114A",
            slots: { title: '培训主办单位名称_requireTitle' },
            scopedSlots: { customRender: "a1114A_editInput" }   
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr: []
      },

      professionalInitArr: null,  //专业与职业技术
      professionalTableLoading: false,
      professionalViewInitArr:{
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        columnsArr: [
          { title: "专业技术职务名", dataIndex: "a0215a", key: "a0215a", width: 300 },
          { title: "专业技术职务级别", dataIndex: "a0215c", key: "a0215c", width: 300 },
          { title: "取得专技资格日期", dataIndex: "a0604", key: "a0604", width: 200 },
          { title: "职业(工种)资格名称", dataIndex: "a0601", key: "a0601", width: 300 },
          { title: "资格等级(技能人员等级)", dataIndex: "a0602", key: "a0602", width: 300 },
          { title: "职业(工种)资格日期", dataIndex: "a0603", key: "a0603" }
        ],
        tabledataArr:[]
      },
      professionalEditInitArr:{
        isEditAndAdd: true,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        formData: {},
        editableCol: [
          'a0215a_editSelectInput',
          'a0215c_editSelectInput',
          'a0604_editDateInput',
          'a0601_editSelectInput',
          'a0602_editSelectInput',
          'a0603_editDateInput'
        ],
        columnsArr: [
          { 
            title: "专业技术职务名", 
            dataIndex: "a0215a", 
            key: "a0215a",
            width: 250,
            scopedSlots: {customRender: "a0215a_editSelectInput" },
            itemChildren:[] 
          },
          { 
            title: "专业技术职务级别", 
            dataIndex: "a0215c", 
            key: "a0215c",
            width: 250,
            scopedSlots: {customRender: "a0215c_editSelectInput" },
            itemChildren:[] 
          },
          { 
            title: "取得专技资格日期", 
            dataIndex: "a0604", 
            key: "a0604",
            width: 200,
            scopedSlots: { customRender: "a0604_editDateInput" },
            dateFormat: "YYYY-MM-DD"  
          },
          { 
            title: "职业(工种)资格名称", 
            dataIndex: "a0601", 
            key: "a0601",
            width: 250,
            scopedSlots: {customRender: "a0601_editSelectInput" },
            itemChildren:[]
          },
          { 
            title: "资格等级(技能人员等级)", 
            dataIndex: "a0602",
            key: "a0602",
            width: 250,
            scopedSlots: {customRender: "a0602_editSelectInput" },
            itemChildren:[] 
          },
          { 
            title: "职业(工种)资格日期",
            dataIndex: "a0603", 
            key: "a0603",
            scopedSlots: { customRender: "a0603_editDateInput" },
            dateFormat: "YYYY-MM-DD"  
          },
          {
            title: "操作",
            key: "action",
            width: 150, 
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[]
      },

      delagateUnitList: [],  //委托存档单位---select单位数据
      // delagateCompanyId: null,   //委托存档单位---单位id

      archiveInitArr: null, //档案接转数据
      archiveTableLoading: false,
      archiveViewInitArr:{
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        superimposeWidth: true,
        formData: {},
        columnsArr: [
          { title: "存档编号", dataIndex: "dc030001", key: "dc030001", width: 300 },
          {
            title: "现档案管理机构名称",
            dataIndex: "a3807a",
            key: "a3807a",
            width: 400
          },
          { title: "转入日期", dataIndex: "a3801", key: "a3801", width: 300 },
          { title: "转入原因", dataIndex: "a3803", key: "a3803" }
        ],
        tabledataArr:[]
      },
      archiveEditInitArr:{
        isEditAndAdd: true,
        addMaxLength: 1,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        superimposeWidth: true,
        formData: {},
        editableCol:[
          'dc030001_editInput',
          'a0002_editInput',
          'dc030003_editSelectInput',
          'dc030004_editSelectInput',
          'a3807a_editInput',
          'a3801_editDateInput',
          'a3803_editSelectInput',
          'a3802_editInput',
          'dc030009_editAddressInput',
          'dc030010_editDateInput',
          'dc030011_editSelectInput',
          'dc030012_editInput',
          'dc030013_editAddressInput',
          '存档编号_requireTitle',
          '存档状态_requireTitle',
          '存档性质_requireTitle',
          '现档案管理机构名称_requireTitle',
          '转入日期_requireTitle',
          '转入原因_requireTitle',
          '原存档单位名称_requireTitle'
        ],
        columnsArr:[
          { 
            dataIndex: "dc030001", 
            key: "dc030001",
            width: 200,
            slots: { title: '存档编号_requireTitle' },
            scopedSlots: { customRender: "dc030001_editInput" } 
          },
          { 
            title: '索引号',
            dataIndex: "a0002", 
            key: "a0002",
            width: 100,
            scopedSlots: { customRender: "a0002_editInput" } 
          },
          { 
            dataIndex: "dc030003", 
            key: "dc030003",
            width: 150,
            slots: { title: '存档状态_requireTitle' },
            scopedSlots: { customRender: "dc030003_editSelectInput" },
            itemChildren:[],
          },
          { 
            dataIndex: "dc030004", 
            key: "dc030004",
            width: 150,
            slots: { title: '存档性质_requireTitle' },
            scopedSlots: { customRender: "dc030004_editSelectInput" },
            itemChildren:[]
          },
          {
            dataIndex: "a3807a",
            key: "a3807a",
            width: 300,
            slots: { title: '现档案管理机构名称_requireTitle' },
            scopedSlots: { customRender: "a3807a_editInput" } 
          },
          {  
            dataIndex: "a3801", 
            key: "a3801",
            width: 200,
            slots: { title: '转入日期_requireTitle' },
            scopedSlots: { customRender: "a3801_editDateInput" },
            dateFormat: "YYYY-MM-DD" 
          },
          {  
            dataIndex: "a3803", 
            key: "a3803",
            width: 400,
            slots: { title: '转入原因_requireTitle' },
            scopedSlots: { customRender: "a3803_editSelectInput" },
            itemChildren:[]  
          },
          {
            dataIndex: "a3802",
            key: "a3802",
            width: 300,
            slots: { title: '原存档单位名称_requireTitle' },
            scopedSlots: { customRender: "a3802_editInput" } 
          },
          { 
            title: '原存档单位行政区划',
            dataIndex: "dc030009", 
            key: "dc030009",
            width: 300,
            scopedSlots: { customRender: "dc030009_editAddressInput" },
          },
          { 
            title: '转出日期',
            dataIndex: "dc030010", 
            key: "dc030010",
            width: 200,
            scopedSlots: { customRender: "dc030010_editDateInput" },
            dateFormat: "YYYY-MM-DD" 
          },
          {  
            title: '转出原因',
            dataIndex: "dc030011", 
            key: "dc030011",
            width: 300,
            scopedSlots: { customRender: "dc030011_editSelectInput" },
            itemChildren:[]  
          },
          {
            title: '转往档案单位名称',
            dataIndex: "dc030012",
            key: "dc030012",
            width: 300,
            scopedSlots: { customRender: "dc030012_editInput" } 
          },
          { 
            title: '转往档案单位行政区划',
            dataIndex: "dc030013", 
            key: "dc030013",
            scopedSlots: { customRender: "dc030013_editAddressInput" },
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[]
      },
      archiveAddInitArr:{
        isEditAndAdd: true,
        addMaxLength: 1,
        treeflag: false,
        tableCheck: false,
        noPagination: true, // 分页是否不显示
        bordered: true, // 表格 border 是否显示
        superimposeWidth: true,
        formData: {},
        editableCol:[
          'dc030001_editInput',
          'a0002_editInput',
          'dc030003_editSelectInput',
          'dc030004_editSelectInput',
          'a3807a_editInput',
          'a3801_editDateInput',
          'a3803_editSelectInput',
          'a3802_editInput',
          'dc030009_editAddressInput',
          '存档编号_requireTitle',
          '存档状态_requireTitle',
          '存档性质_requireTitle',
          '现档案管理机构名称_requireTitle',
          '转入日期_requireTitle',
          '转入原因_requireTitle',
          '原存档单位名称_requireTitle',
        ],
        columnsArr:[
          { 
            dataIndex: "dc030001", 
            key: "dc030001",
            width: 200,
            slots: { title: '存档编号_requireTitle' },
            scopedSlots: { customRender: "dc030001_editInput" } 
          },
          { 
            title: '索引号',
            dataIndex: "a0002", 
            key: "a0002",
            width: 120,
            scopedSlots: { customRender: "a0002_editInput" } 
          },
          { 
            dataIndex: "dc030003", 
            key: "dc030003",
            width: 150,
            slots: { title: '存档状态_requireTitle' },
            scopedSlots: { customRender: "dc030003_editSelectInput" },
            itemChildren:[],
          },
          { 
            dataIndex: "dc030004", 
            key: "dc030004",
            width: 150,
            slots: { title: '存档性质_requireTitle' },
            scopedSlots: { customRender: "dc030004_editSelectInput" },
            itemChildren:[]
          },
          {
            dataIndex: "a3807a",
            key: "a3807a",
            width: 300,
            slots: { title: '现档案管理机构名称_requireTitle' },
            scopedSlots: { customRender: "a3807a_editInput" } 
          },
          {  
            dataIndex: "a3801", 
            key: "a3801",
            width: 200,
            slots: { title: '转入日期_requireTitle' },
            scopedSlots: { customRender: "a3801_editDateInput" },
            dateFormat: "YYYY-MM-DD" 
          },
          {  
            dataIndex: "a3803", 
            key: "a3803",
            width: 400,
            slots: { title: '转入原因_requireTitle' },
            scopedSlots: { customRender: "a3803_editSelectInput" },
            itemChildren:[]  
          },
          {
            dataIndex: "a3802",
            key: "a3802",
            width: 300,
            slots: { title: '原存档单位名称_requireTitle' },
            scopedSlots: { customRender: "a3802_editInput" } 
          },
          { 
            title: '原存档单位行政区划',
            dataIndex: "dc030009", 
            key: "dc030009",
            // width: 300,
            scopedSlots: { customRender: "dc030009_editAddressInput" },
          },
          {
            title: "操作",
            key: "action",
            width: 150,
            fixed: 'right',
            scopedSlots: { customRender: "action" }
          }
        ],
        tabledataArr:[]
      },
      
      
      imgUrl: "", //照片地址
      imgUploadUrl: this.$targetHost + 'hasngcadrefile/informationPool@uploadImgNoUsed.action',  //照片上传地址
      statusVal: null, //人才信息总库页面：操作状态： 1-添加， 2-浏览， 3-编辑
      birthday: moment(new Date(), "YYYY-MM-DD"), //出生日期
      graduateDate: moment(new Date(), "YYYY-MM-DD"), //最高学历毕业日期
      workDate: moment(new Date(), "YYYY-MM-DD"), //参加工作年月
      addTreeNode: "", //当为添加操作时，选择的treeNode值
      hjCode: [], //户籍行政区划
      birthdayCode: [], //出生地行政区划
      workCode: [], //工作地行政区划
    };
  },
  updated() {},
  computed: {
    address() {
      return address;
    },
    
    directoryData: function() {
      //字典数据
      if (this.$store.getters.getDirectoryData) {
        this.getBasicInfoOther(this.$store.getters.getDirectoryData);
        return this.$store.getters.getDirectoryData;
      } else {
        return null;
      }
    }
  },
  methods: {
    getColumnDataFun(operateVal){
      /**
       * 功能：根据操作替换当前table--表头 
       * 参数：operateVal -- 当前传过来的操作值； 1---添加；  2--浏览； 3---编辑
       */
      if(Number(operateVal) === 1 || Number(operateVal) === 3){
        //添加、编辑tableview传值
        //教育经历edit--表头
        this.eduEditInitArr.columnsArr.forEach(el => {
          if(el.key === 'a0837')  el.itemChildren = this.educationTypeArr;  //教育类别
          if(el.key === 'a0838')  el.itemChildren = this.studyFormArr;      //学习形式
          if(el.key === 'a0824a08')  el.itemChildren = this.professionalArr;   //所学专业名称
          if(el.key === 'a0901a') el.itemChildren = this.degreeArr;         //所获学位
          if(el.key === 'a0801a') el.itemChildren = this.educationArr;      //所获学历
        });
        //家庭情况edit--表头
        this.familyEditInitArr.columnsArr.forEach(el => {
          if(el.key === 'a3604a') el.itemChildren = this.relationshipArr;   //与本人关系
        });

        //奖惩历史--表头
        this.rewordEditInitArr.columnsArr.forEach(el => {
          if(el.key === 'a14Z204a') el.itemChildren = this.rewordNameArr;    //奖励名称
          if(el.key === 'a14Z304a') el.itemChildren = this.punishmentNameArr;    //处分名称
        });

        //语言能力--表头
        this.languageEditInitArr.columnsArr.forEach(el => {
          if(el.key === 'dc010701')  el.itemChildren = this.languageTypeArr;  //语言
          if(el.key === 'dc010702') el.itemChildren = this.languageProficiencyArr;  //语言熟练程度
        });

        //专业与职业技术
        this.professionalEditInitArr.columnsArr.forEach(el => {
          if(el.key === 'a0601') el.itemChildren = this.positionArr ; //职业(工种)资格名称
          if(el.key === 'a0602') el.itemChildren = this.occupationLevelArr;  //资格等级(技能人员等级)
          if(el.key === 'a0215a') el.itemChildren = this.positionNameArr;  //专业技术职务名
          if(el.key === 'a0215c') el.itemChildren = this.positionLevelArr; //专业技术职务级别
        });

        this.workInitArr = this.workEditInitArr;  //工作经历
        this.eduInitArr = this.eduEditInitArr;  //教育经历
        this.familyInitArr = this.familyEditInitArr;  //家庭情况
        this.rewordInitArr = this.rewordEditInitArr;  //奖惩历史
        this.languageInitArr = this.languageEditInitArr;  //语言能力
        this.trainerInitArr = this.trainerEditInitArr;  //培训经历
        this.professionalInitArr = this.professionalEditInitArr;  //专业与职业技术
        if(Number(operateVal) === 1){
          //档案转接--添加
          //档案转接数据--添加
          this.archiveAddInitArr.columnsArr.forEach(el => {
            if(el.key === 'dc030003') el.itemChildren = this.saveRecordStaArr; //存档状态
            if(el.key === 'dc030004') el.itemChildren = this.saveRecordNatureArr;   //存档性质
            if(el.key === 'a3803')  el.itemChildren = this.inReasonArr;  //转入原因
            if(el.key === 'dc030011') el.itemChildren = this.outReasonArr;   //转出原因
          });
          this.archiveInitArr = this.archiveAddInitArr;  //档案转接数据--添加表头
          console.log(this.archiveInitArr);
        } else{
          //编辑
          //档案转接数据--编辑
          this.archiveEditInitArr.columnsArr.forEach(el => {
            if(el.key === 'dc030003') el.itemChildren = this.saveRecordStaArr; //存档状态
            if(el.key === 'dc030004') el.itemChildren = this.saveRecordNatureArr;   //存档性质
            if(el.key === 'a3803')  el.itemChildren = this.inReasonArr;  //转入原因
            if(el.key === 'dc030011') el.itemChildren = this.outReasonArr;   //转出原因
          });
          this.archiveInitArr = this.archiveEditInitArr;  //档案转接数据--编辑表头
        }
        
      } else{
        //浏览--tableview传值
        this.workInitArr = this.workViewInitArr;  //工作经历
        this.eduInitArr = this.eduViewInitArr;  //教育经历
        this.familyInitArr = this.familyViewInitArr;  //家庭情况
        this.rewordInitArr = this.rewordViewInitArr;  //奖惩历史
        this.languageInitArr = this.languageViewInitArr;  //语言能力
        this.trainerInitArr = this.trainerViewInitArr;  //培训经历
        this.professionalInitArr = this.professionalViewInitArr;  //专业与职业技术
        this.archiveInitArr = this.archiveViewInitArr;  //档案转接数据
      }
    },

    getBasicInfoOther(directoryData) {
      /***
       * 功能：字典数据：放到对应的下拉选择数据里；
       * 参数：directoryData:当前字典数据
       */
      this.nationalArr = directoryData["ethnicList"]; //民族
      this.healthArr = directoryData["healList"]; //健康状况
      this.marriageArr = directoryData["maritalList"]; //婚姻状况
      this.politicsStatusArr = directoryData["politicalList"]; //政治面貌
      this.educationArr = directoryData["educationList"]; //最高学历
      this.degreeArr = directoryData["degreeList"]; //最高学位
      this.economicArr = directoryData["economicTypeList"]; //工作单位经济类型
      this.industryArr = directoryData["belongIndustryList"]; //工作单位所属行业
      this.workUnitArr = directoryData["organizationTypeList"]; //工作单位机构类型
      this.professionalArr = directoryData["MajorList"]; //最高学历所学专业类别
      this.positionArr = directoryData["positionTypeList"]; //工作职位(岗位)类型
      this.relationshipArr = directoryData["familyRelationsList"]; //与本人关系
      this.studyFormArr = directoryData["studyFormList"]; //学习形式
      this.educationTypeArr = directoryData["educationTypeList"]; //教育类别
      this.rewordNameArr = directoryData["rewardNameList"]; //奖励名称
      this.punishmentNameArr = directoryData["punishmentNameList"]; //处罚名称
      this.languageTypeArr = directoryData["languageTypeList"]; //语言
      this.languageProficiencyArr = directoryData["proficiencyValueList"]; //语种熟练程度
      this.occupationLevelArr = directoryData["techniqueList"]; //职业资格等级（技能人员等级）
      this.positionNameArr = directoryData["technicalCodeList"]; //专业技术职务名称
      this.positionLevelArr = directoryData["professorlevelList"]; //专业技术职务级别
      this.saveRecordStaArr = directoryData["isInwareList"]; //存档状态
      this.saveRecordNatureArr = directoryData["archiveTypeList"]; //存档性质
      this.inReasonArr = directoryData["inComeReasonList"]; //转入原因
      this.outReasonArr = directoryData["archTransferTypeList"]; //转出原因
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
            for(let prop in res.data){
              if(prop == 'a0107'){
                this.birthday = res.data[prop] ? moment(res.data[prop], 'YYYY-MM-DD') : void 0;
              } else if(prop == 'a0807'){
                this.graduateDate = res.data[prop] ? moment(res.data[prop], 'YYYY-MM-DD') : void 0;
              } else if(prop == 'a0134'){
                this.workDate = res.data[prop] ? moment(res.data[prop], 'YYYY-MM') : void 0;
              }
            }
            
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
      if(currId){
        //浏览/编辑
        this.getWork(currId);
        this.getEducation(currId);
        this.getFamily(currId);
        this.getLanguage(currId);
        this.getAward(currId);
        this.getTrainer(currId);
        this.getProfessional(currId);
        this.getArchiveTableData(currId);
      } else{
        //添加
        this.workInitArr.tabledataArr = [];
        this.eduInitArr.tabledataArr = [];
        this.familyInitArr.tabledataArr = [];
        this.rewordInitArr.tabledataArr = [];
        this.languageInitArr.tabledataArr = [];
        this.trainerInitArr.tabledataArr = [];
        this.professionalInitArr.tabledataArr = [];
        this.archiveInitArr.tabledataArr = [];
      }
    },

    getWork(currId) {
      //获取工作经历
      this.workTableLoading = true;
      this.$http
        .fetchGet("informationPool@findA02List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.workInitArr.tabledataArr = [];
            currTempData.forEach(element => {
              this.workInitArr.tabledataArr.push({
                key: element.a02000,
                a0157a: element.a0157a,
                a4801: element.a4801,
                a4804: element.a4804,
                a0215a: element.a0215a,
                a0202dwork: element.a0202dwork
              });
            });
            if(this.operateStatusVal !== 2){
              //编辑
              this.workInitArr.tabledataArr.forEach(el => {
                el.inEdit = false;
              })
            }
          } else{
            this.$message.error('抱歉，数据加载失败！请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.workTableLoading = false;
        });
    },

    getEducation(currId) {
      //获取教育经历
      this.eduTableLoading = true;
      this.$http
        .fetchGet("informationPool@findA08List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.eduInitArr.tabledataArr = [];
            if(this.operateStatusVal === 2){
              //浏览
              currTempData.forEach(element => {
                this.eduInitArr.tabledataArr.push({
                  key: element.a08000,
                  a0801a: element.a0801a,
                  a0801a_Code: element.a0801a_Code,
                  a0804: element.a0804,
                  a0807a08: element.a0807a08,
                  a0814: element.a0814,
                  a0824a08: element.a0824a08,
                  a0824a08_Code: element.a0824a08_Code,
                  a0837: element.a0837,
                  a0837_Code: element.a0837_Code,
                  a0838: element.a0838,
                  a0838_Code: element.a0838_Code,
                  a0901a: element.a0901a,
                  a0901a_Code: element.a0901a_Code
                });
              });
            } else {
              //编辑
              currTempData.forEach(element => {
                this.eduInitArr.tabledataArr.push({
                  key: element.a08000,
                  a0814: element.a0814,
                  a0804: element.a0804,
                  a0807a08: element.a0807a08,
                  a0837: {code: element.a0837_Code, name: element.a0837},
                  a0801a: {code: element.a0801a_Code, name: element.a0801a},
                  a0824a08: {code: element.a0824a08_Code, name: element.a0824a08},
                  a0838: {code: element.a0838_Code, name: element.a0838},
                  a0901a: {code: element.a0901a_Code, name: element.a0901a},
                  inEdit: false
                })
              });
            }
            
          } else{
            this.$message.error('抱歉，数据加载失败！请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.eduTableLoading = false;
        });
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
            this.familyInitArr.tabledataArr = [];
            if(this.operateStatusVal === 2){
              //浏览
              currTempData.forEach(element => {
                this.familyInitArr.tabledataArr.push({
                  key: element.a36000,
                  a3601: element.a3601,
                  a3604a: element.a3604a,
                  a3604a_Code: element.a3604a_Code,
                  a3611: element.a3611
                });
              });
            } else{
              currTempData.forEach(element => {
                this.familyInitArr.tabledataArr.push({
                  key: element.a36000,
                  a3601: element.a3601,
                  a3604a: {code: element.a3604a_Code, name: element.a3604a},
                  a3611: element.a3611,
                  inEdit: false
                });
              });
            }
          }
        })
        .catch(err => {});
    },

    getAward(currId) {
      //获取奖惩情况
      this.rewordTableLoading = true;
      this.$http
        .fetchGet("informationPool@findA14List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.rewordInitArr.tabledataArr = [];
            if(this.operateStatusVal === 2){
              currTempData.forEach(element => {
                this.rewordInitArr.tabledataArr.push({
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
            } else{
              currTempData.forEach(element => {
                this.rewordInitArr.tabledataArr.push({
                  key: element.a14000,
                  a14Z204a: {code: element.a14Z204a_Code, name: element.a14Z204a},
                  a14Z211: element.a14Z211,
                  a14Z214a: element.a14Z214a,
                  a14Z304a: {code: element.a14Z304a_Code, name: element.a14Z304a},
                  a14Z307: element.a14Z307,
                  a14Z311a: element.a14Z311a,
                  inEdit: false
                });
              });
            }
          } else{
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        })
        .finally(end => {
          this.rewordTableLoading = false;
        });
    },

    getLanguage(currId) {
      //语言能力
      this.languageTableLoading = true;
      this.$http
        .fetchGet("informationPool@findDC0107ByA01Id.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.languageInitArr.tabledataArr = [];
            if(this.operateStatusVal === 2){
              //浏览
              currTempData.forEach(element => {
                this.languageInitArr.tabledataArr.push({
                  key: element.dc0107000,
                  dc010701: element.dc010701,
                  dc010701_Code: element.dc010701_Code,
                  dc010702: element.dc010702,
                  dc010702_Code: element.dc010702_Code,
                  remark: element.remark
                });
              });
            } else{
              currTempData.forEach(element => {
                this.languageInitArr.tabledataArr.push({
                  key: element.dc0107000,
                  dc010701: {code: element.dc010701_Code, name: element.dc010701},
                  dc010702: {code: element.dc010702_Code, name: element.dc010702},
                  remark: element.remark,
                  inEdit: false
                });
              });
            }
          } else{
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.languageTableLoading = false;
        });
    },

    getTrainer(currId) {
      //获取培训经历
      this.trainerTableLoading = true;
      this.$http
        .fetchGet("informationPool@findA11List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.trainerInitArr.tabledataArr = [];
            currTempData.forEach(element => {
              this.trainerInitArr.tabledataArr.push({
                key: element.a11000,
                a1107: element.a1107,
                a1111: element.a1111,
                a1114A: element.a1114A,
                a1131: element.a1131
              });
            });
            if(this.operateStatusVal !== 2){
              //编辑
              this.trainerInitArr.tabledataArr.forEach(el => {
                el.inEdit = false;
              })
            }
          } else{
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.trainerTableLoading = false;
        });
    },

    getProfessional(currId) {
      //获取专业与职业技术
      this.professionalTableLoading = true;
      this.$http
        .fetchGet("informationPool@findA06List.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.professionalInitArr.tabledataArr = [];
            if(this.operateStatusVal === 2){
              //浏览
              currTempData.forEach(element => {
                this.professionalInitArr.tabledataArr.push({
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
            } else{
              currTempData.forEach(element => {
                this.professionalInitArr.tabledataArr.push({
                  key: element.a06000,
                  a0215a: {code: element.a0215a_Code, name: element.a0215a},
                  a0215c: {code: element.a0215c_Code, name: element.a0215c},
                  a0601: {code: element.a0601_Code, name: element.a0601},
                  a0602: {code: element.a0602_Code, name: element.a0602},    //缺code值
                  a0603: element.a0603,
                  a0604: element.a0604,
                  inEdit: false
                });
              });
            }
          } else{
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.professionalTableLoading = false;
        });
    },

    getArchiveTableData(currId) {
      //档案转接数据
      this.archiveTableLoading = false;
      this.$http
        .fetchGet("informationPool@findA38ByA01Id.action", {
          a01Id: currId
        })
        .then(res => {
          if (Number(res.code) === 0) {
            let currTempData = res.data;
            this.archiveInitArr.tabledataArr = [];
            if(this.operateStatusVal === 2){
              //浏览
              currTempData.forEach(element => {
                this.archiveInitArr.tabledataArr.push({
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
            } else{
              currTempData.forEach(element => {
                this.archiveInitArr.tabledataArr.push({
                  key: element.dc38000,
                  dc030001: element.dc030001,
                  a3807a: element.a3807a,
                  a3801: element.a3801,
                  a3803: {code: element.a3803_Code, name: element.a3803},
                  a0002: element.a0002,
                  dc030003: {code: element.dc030003, name: element.dc030003},      //缺code,name
                  dc030004: {code: element.dc030004, name: element.dc030004},      //缺code,name
                  a3802: element.a3802,
                  dc030009: {code: element.dc030009 ? element.dc030009.split('.') : [], name: element.dc030009},      //行政区划区划
                  dc030010: element.dc030010,
                  dc030011: {code: element.dc030011, name: element.dc030011},      //缺code,name
                  dc030012: element.dc030012,
                  dc030013: {code: element.dc030013 ? element.dc030013.split('.') : [], name: element.dc030013}       //行政区划区划
                });
              });
            }
          } else{
            this.$message.error('抱歉，获取数据失败，请刷新后重试！');
          }
        })
        .catch(err => {
          this.$message.error('抱歉，网络异常！');
        }).finally(end => {
          this.archiveTableLoading = false;
        });
    },

    getDelagateUnitListFun(){
      //获取委托存档单位列表数据
      this.$http.fetchGet('personalArch@getCompanyList.action').then(res => {
        if(Number(res.code) === 0){
          this.delagateUnitList = res.data;
        } else{
          this.$message.error('抱歉，获取数据失败，请刷新后重试！');
        }
      }).catch(error => {
        this.$message.error('抱歉，网络异常！');
      })
    },

    // delagateChange(value){
    //   //获取委托存档单位列表数据--change
    //   this.delagateCompanyId = value;
    // },

    conVersionData(keyVal, data, searchKey) {
      /***
       * 功能：浏览页面:根据当前的属性值itemCode，查找对应的数组，判断匹配的data（拿到的itemCode）返回value（itemName）
       * 参数：keyVal: 当前在哪个数组里查找；data:当前itemCode; searchKey:在数据里data根据哪个值匹配查找
       */
      let tempData = [];
      let tempName = "";
      if (keyVal && data) {
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
          tempData = this.positionArr;
        } else if(keyVal === 'delagate'){
          tempData = this.delagateUnitList;
        }
        tempData.forEach(el => {
          if (el[searchKey] === data) {
            tempName = el.itemName;
          }
        });
      } else {
        tempName = "";
      }
      return tempName;
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
        let currResImgUrl = info.fileList,
          len = info.fileList.length;
        this.personBasicInfo.imgPath = currResImgUrl[len - 1].response;

        getBase64(info.file.originFileObj, imgUrl => {
          this.imgUrl = imgUrl;
        });
      }
    },

    beforeUpload(file) {
      //上传照片前--照片格式校验

      const isJPG = file.type === "image/jpeg" || file.type === 'image/png';
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


    regInput(val, minLength, maxLength, regways, tip, e, key) {
      /***
       * 功能：必填项验证
       * 参数：val:当前值; reg:验证方法
       */
      // let flag = true;
      if (val) {
        if (regways) {
          let regResult = this.regs[regways](val);
          if(regways === 'testid'){
            //身份证重复验证
            if (regResult === 0) {
              this.$message.error(tip);
            } else{
              //通过输入的身份证号码--填写出生日期和性别
              if(Number(val)){
                let tempGender = 0;
                if(val.length === 18){
                  this.birthday = moment(val.substr(6,8), 'YYYY-MM-DD');
                  tempGender = Number(val[16])%2 === 0 ? '2':'1';
                } else if(val.length){
                  this.birthday = moment(val.substr(6,6), 'YYYY-MM-DD');
                  tempGender = Number(val[14])%2 === 0 ? '2':'1';
                }
                this.$set(this.personBasicInfo, 'a0104', tempGender)
              } else{
                this.birthday = moment(new Date(), 'YYYY-MM-DD');
                this.$set(this.personBasicInfo, 'a0104', '1')
              }
              if(Number(val)){
                //通过id验证身份证号码---添加/编辑的分别验证: 18/15个0  不参与验证
                this.$http.fetchPost('informationPool@checkPerson.action', {
                  a0184: val,
                  a01000: this.currRowDataId
                }).then(res => {
                  if(Number(res.code) === 0){
                    //重复：已经存在
                    this.$message.error('该人员已经存在，请勿重复添加');
                  }
                }).catch(error => {
                  this.$message.error('抱歉，网络异常！');
                })
              }
            }
          } else{
            if (regResult === 0) {
              this.$message.error(tip);
            }
          }
        } else {
          if (val.length > maxLength || val.length < minLength) {
            this.$message.error(tip);
          }
        }
      }
    },

    getFinishData() {
      /**
       * 功能：1.查看必填项：如果有必填项为空则标红，且得到为空必填项长度requiredLen；否则必填项全填，requiredLen =0; 2.验证存档编号是否存在
       */

      //人员基本信息--不能为空, 可编辑表格必填项---不为空
      let tempRefsArr = [], requiredLen = 0, tableRequireArr = [];

      for(let prop in this.$refs){
        if(this.$refs[prop].className != 'basicInfo'){
          if(this.$refs[prop].$el.dataset['type'] == 'basicInfoRequire'){
            tempRefsArr.push(this.$refs[prop]);    //人员基本信息必填项--数组
          }
          if(this.$refs[prop].$el.dataset['type'] == 'editTableRequire'){
            tableRequireArr.push(this.$refs[prop]);  //可编辑表格有必填--数组
          }
        }
      }

      for(let i = 0; i < tempRefsArr.length; i ++){
        if(tempRefsArr[i].value == '' || tempRefsArr[i].value == 'undefined'){
          tempRefsArr[i].$el.style.outline = '1px solid red';
          document.getElementsByClassName("right_container")[0].scrollTop = 0;
          requiredLen++;
        } else{
          tempRefsArr[i].$el.style.outline = '';
        }
      }

      //可编辑表格--必填项遍历
      let temptableRequireObj = {};
      tableRequireArr.forEach((item, index) => {
        let tempReCloumnArr = [];   //当前可编辑表--必填列--数组
        item.initArrData.columnsArr.forEach(el => {
          if(el.slots){
            tempReCloumnArr.push(el.key);
          }
        });
        if(item.initArrData.tabledataArr.length > 0){
          tempReCloumnArr.forEach(elem => {
            item.initArrData.tabledataArr.forEach(element => {
              for(let prop in element){
                if(elem == prop){
                  if(typeof(element[prop]) == "object") {
                    if(!element[prop].name){
                       temptableRequireObj[index] = false;
                    }
                  } else{
                    if(!element[prop]){
                       temptableRequireObj[index] = false;
                    }
                  }
                }
              }
            });
          });
        }
      });
      
     

      if(!requiredLen){
        if(Object.keys(temptableRequireObj).length  > 0){
          this.$message.warning('必填项不能为空!');
          document.getElementsByClassName("right_container")[0].scrollTop = tableRequireArr[Object.keys(temptableRequireObj)[0]].$el.offsetTop - 110;
        } else{
          if(this.archiveInitArr && this.archiveInitArr.tabledataArr && this.archiveInitArr.tabledataArr.length > 0){
            this.$http.fetchPost('informationPool@checkArchNumber.action',{
                dc030001: this.archiveInitArr.tabledataArr[0].dc030001
              }).then(res =>{
                if(Number(res.code) === 0){
                  if(this.operateStatusVal === 3){
                    //编辑状态
                    this.$emit('OperateStatusFun', true);
                    this.postOtherData();
                  } else{
                    //添加状态
                    this.$message.error('档案转接数据：存档编号已经存在，不能重复');
                    this.$emit('OperateStatusFun', false);
                  }
                } else {
                  //没重复
                  this.postOtherData();
                }
              }).catch(error => {
                this.$message.error('抱歉，网络异常！');
                this.$emit('OperateStatusFun', false);
              });
            } else{
              this.postOtherData();
            }
        }
        
      } else{
        this.$message.warning('人员基本信息必填项不能为空!');
      }
      
    },
    
    postOtherData(){
      let tempBasicInfo = this.personBasicInfo;
      let tempFamilyDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.familyInitArr.tabledataArr)));
      let tempEduDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.eduInitArr.tabledataArr)));
      let tempWorkDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.workInitArr.tabledataArr)));
      let tempTrainerDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.trainerInitArr.tabledataArr)));
      let tempRewordDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.rewordInitArr.tabledataArr)));
      let tempLanguageDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.languageInitArr.tabledataArr)));
      let tempProfessDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.professionalInitArr.tabledataArr)));
      let tempArchiveDataArr = this.transferNewDataArrFun(JSON.parse(JSON.stringify(this.archiveInitArr.tabledataArr)));
      tempBasicInfo.upUnitId = this.addTreeNode["key"] ? this.addTreeNode["key"] : '';
      
      let postdataArr = [];
      // 先把数组转成str， 在转码，解码
      postdataArr.push(
        tempFamilyDataArr, 
        tempEduDataArr, 
        tempWorkDataArr,
        tempTrainerDataArr,
        tempRewordDataArr,
        tempLanguageDataArr,
        tempProfessDataArr,
        tempArchiveDataArr)
      tempBasicInfo.dataArr = encodeURI(JSON.stringify(postdataArr));
      this.$http.fetchPost("informationPool@personInfoAdd.action",tempBasicInfo)
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("提交成功");
            this.$emit('OperateStatusFun', true);
          } else{
            this.$message.error("提交失败");
            this.$emit('OperateStatusFun', false);
          }
        })
        .catch(err => {
          this.$message.error("抱歉，网络异常！");
          this.$emit('OperateStatusFun', false);
        });
    },
  

    transferNewDataArrFun(dataArr){
      /**
       * 功能：把当前数组里select为对象的转换为提交的数组：只需要itemCode
       * 参数：dataArr:当前需要转换的数组
       */
      let resultDataArr = [],
      objName = "[object Object]",
      arrName = "[object Array]"
      if(dataArr && dataArr.length > 0){
        dataArr.forEach(el => {
          for(let key in el){
            if(Object.prototype.toString.call(el[key]) === objName){
              if(Object.prototype.toString.call(el[key]['code']) === arrName){
                //行政区划
                el[key] = el[key]['code'].join('.');
              } else{
                el[key] = el[key]['code']
              }
              delete el['inEdit'];
            }
          }
          resultDataArr.push(el);
        });
      } else{
        resultDataArr = [];
      }
      
      return resultDataArr;
    },

    anchorClick(anchorId, indexVal) {
      //左侧锚点点击
      this.currClickAnchor = indexVal;
      // console.log(this.currClickAnchor);
      let anchor = document.getElementById(anchorId);
      document.getElementsByClassName("right_container")[0].scrollTop =
        anchor.offsetTop - 60;
    },

    scrollAddListening() {
      //右侧内容滚动条监听
      let scrollListener = document.getElementsByClassName("right_container");
      let currScrollTopVal =
          scrollListener[0].scrollTop || scrollListener[0].pageYOffset;
      this.anchorList.forEach((item, index) => {
        this.$nextTick(() => {
          item.idscrollTop = document.getElementById(item.value).offsetTop;
        });
      });
      
      let tempAnchor = 0;
      this.anchorList.forEach((el, index) => {
        if(currScrollTopVal < this.anchorList[1].idscrollTop - 100){
          tempAnchor = 0;
        } else{
          if (currScrollTopVal >= this.anchorList[index].idscrollTop) {
            if (this.anchorList[index + 1] && currScrollTopVal <= this.anchorList[index + 1].idscrollTop) {
              tempAnchor = index + 1;
            } else {
              tempAnchor = this.anchorList.length;
            }
          }
        }
      });
      this.currClickAnchor = tempAnchor;
    },
    
  },
  watch: {
    operateStatusVal: {
      handler(newVal) {
        if (newVal === 1) {
          //添加操作
          this.personBasicInfo = {...this.addInitPersonBasicInfo};
          this.getPersonOtherInfo(null);
        } else {
          //浏览或编辑操作
          this.getBasicInfo(this.currRowDataId);
          this.getPersonOtherInfo(this.currRowDataId);
        }
        this.getColumnDataFun(newVal);
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
          this.personBasicInfo = {...this.addInitPersonBasicInfo};
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

    directoryData: {
      // 监听：字典数据
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getBasicInfoOther(newVal);
        }
      },
      deep: true //深度监听
    },
    ramdomKey: {
      immediate: true,
      handler(newVal) {
        if(this.operateStatusVal === 1){
          this.personBasicInfo = {...this.addInitPersonBasicInfo};
          this.birthday = moment(new Date(), 'YYYY-MM-DD');
          this.graduateDate = moment(new Date(), 'YYYY-MM-DD');
          this.workDate = moment(new Date(), 'YYYY-MM-DD');
          this.imgUrl = '';
        } else{
          this.getBasicInfo(this.currRowDataId);
          this.getPersonOtherInfo(this.currRowDataId);
        }
        this.$nextTick(function(){
          document.getElementsByClassName("right_container")[0].scrollTop = 0;
        })
      }
    },
  },
  destroyed(){
    window.removeEventListener('scroll', this.scrollAddListening, true);
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
  height: 50px;
  white-space: nowrap;
  width: 80px;
  box-sizing: border-box;
}

.info_input {
  border: none;
  text-align: center;
  padding: 0;
  height: auto;
  line-height: 50px;
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
/* .right_containeraddWidth {
  width: 100%;
} */

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

.info_view{
  color: #7F7F7F;
}

</style>

