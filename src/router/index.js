import Vue from 'vue';
import vueRouter from 'vue-router';
Vue.use(vueRouter);

// import components
// eslint-disable-next-line no-unused-vars



const routes = [
    {
        path: '/login',name:'login',component:resolve => require(['../pages/login.vue'],resolve)
    },
    {
        path: '/', name: 'headernav', component: resolve => require(['../components/headerNav.vue'], resolve),

        children:[
            // {
            //     path:'talentinfo',
            //     name:'talentinfo',
            //     component: resolve => require(['../pages/info/info-poll.vue'], resolve),
            //     meta: {
            //         title: '人才信息管理',
            //         breadcrumbList: [{
            //         }]
            //     },
            // },
            {
                path: 'talentinfo/infopoll', name: 'infopoll', component: resolve => require(['../pages/info/info-poll.vue'], resolve),
                meta: {
                    title: '人才信息管理',
                    breadcrumbList: [{
                        name: "人才信息总库",
                        path: 'talentinfo/infopoll',
                    }]
                },
            },
            {
                path: 'talentinfo/infocruit', name: 'infocruit', component: resolve => require(['../pages/info/info-cruit.vue'], resolve),
                meta: {
                    title: '人才信息管理',
                    breadcrumbList: [{
                        name: "招聘发布 ",
                        path: 'talentinfo/infocruit'
                    }]
                }
            },
            {
                path: 'talentinfo/infodigital', name: 'infodigital', component: resolve => require(['../pages/info/info-digital.vue'], resolve),
                meta: {
                    title: '人才信息管理',
                    breadcrumbList: [{
                        name: "人才数字档案 ",
                        path: 'talentinfo/infodigital'
                    }]
                }
            },
            {
                path: 'talentinfo/inforecycle', name: 'inforecycle', component: resolve => require(['../pages/info/info-recycle.vue'], resolve),
                meta: {
                    title: '人才信息管理',
                    breadcrumbList: [{
                        name: "回收站 ",
                        path: 'talentinfo/inforecycle'
                    }]
                }
            },

            // 人事档案服务 -> 个人档案服务
            // {
            //     path:'record',
            //     name:'record',
            //     component: resolve => require(['../pages/record/personal-record/personal-receive.vue'], resolve),
            //     meta: {
            //         title: '人事档案管理',
            //         breadcrumbList: []
            //     }
            // },
            {
                path: 'record/personal-receive', name: 'personal-receive', component: resolve => require(['../pages/record/personal-record/personal-receive.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 个人档案服务',
                    breadcrumbList: [{
                        name: "档案接收",
                        path: 'personal-receive'
                    }]
                }
            },
            {
                path: 'record/personal-infochange', name: 'personal-infochange', component: resolve => require(['../pages/record/personal-record/personal-infochange.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 个人档案服务',
                    breadcrumbList: [{
                        name: "信息变更",
                        path: 'personal-infochange'
                    }]
                }
            },
            {
                path: 'record/personal-transferout', name: 'personal-transferout', component: resolve => require(['../pages/record/personal-record/personal-transferout.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 个人档案服务',
                    breadcrumbList: [{
                        name: "档案转出",
                        path: 'personal-transferout'
                    }]
                }
            },
            {
                path: 'record/personal-transferinner', name: 'personal-transferinner', component: resolve => require(['../pages/record/personal-record/personal-transferinner.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 个人档案服务',
                    breadcrumbList: [{
                        name: "内部调转",
                        path: 'personal-transferinner'
                    }]
                }
            },
            {
                path: 'record/personal-check', name: 'personal-check', component: resolve => require(['../pages/record/personal-record/personal-check.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 个人档案服务',
                    breadcrumbList: [{
                        name: "档案查阅",
                        path: 'personal-check'
                    }]
                }
            },
            {
                path: 'record/personal-materialcheck', name: 'personal-materialcheck', component: resolve => require(['../pages/record/personal-record/personal-materialcheck.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 个人档案服务',
                    breadcrumbList: [{
                        name: "档案材料查阅",
                        path: 'personal-materialcheck'
                    }]
                }
            },
            
            // 人事档案服务 -> 单位档案服务
            {
                path: 'record/departinfooperate', name: 'departinfooperate', component: resolve => require(['../pages/record/depart-record/depart-infoOperate.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 单位档案服务',
                    breadcrumbList: [{
                        name: "单位立户",
                        path: 'departinfooperate'
                    }]
                }
            },
            {
                path: 'record/departinfo', name: 'departinfo', component: resolve => require(['../pages/record/depart-record/depart-info.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 单位档案服务',
                    breadcrumbList: [{
                        name: "单位信息变更",
                        path: 'departinfo'
                    }]
                }
            },
            {
                path: 'record/departworkeroperate', name: 'departworkeroperate', component: resolve => require(['../pages/record/depart-record/depart-workOperate.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 单位档案服务',
                    breadcrumbList: [{
                        name: "单位职工录入",
                        path: 'departworkeroperate'
                    }]
                }
            },
            {
                path: 'record/departworker', name: 'departworker', component: resolve => require(['../pages/record/depart-record/depart-worker.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 单位档案服务',
                    breadcrumbList: [{
                        name: "单位职工信息变更",
                        path: 'departworker'
                    }]
                }
            },
            //人事档案管理-->档案交接服务
            {
                path: 'record/archive', name: 'archive', component: resolve => require(['../pages/record/record-transfer/record-transfer.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案交接服务',
                    breadcrumbList: [{
                        name: "档案交接",
                        path: 'archive'
                    }]
                }
            },
            {
                path: 'record/material', name: 'material', component: resolve => require(['../pages/record/record-transfer/material-transfer.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案交接服务',
                    breadcrumbList: [{
                        name: "材料交接",
                        path: 'material'
                    }]
                }
            },
            //人事档案管理--开具证明服务
            {
                path: 'record/prove', name: 'prove', component: resolve => require(['../pages/record/prove-service.vue'], resolve),
                meta: {
                    title: '人才信息管理',
                    breadcrumbList: [{
                        name: "开具证明服务 ",
                        path: 'record/prove'
                    }]
                }
            },
            //人事档案管理--开具商调函
            {
                path: 'record/business', name: 'business', component: resolve => require(['../pages/record/prove-businessletter.vue'], resolve),
                meta: {
                    title: '人才信息管理',
                    breadcrumbList: [{
                        name: "开具证明服务 ",
                        path: 'record/business'
                    }]
                }
            },
            //人事档案管理-->业务申请审核
            {
                path: 'record/saveapply', name: 'saveapply', component: resolve => require(['../pages/record/business-apply/save-apply.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 业务申请审核',
                    breadcrumbList: [{
                        name: "档案存档申请审核",
                        path: 'saveapply'
                    }]
                }
            },
            {
                path: 'record/rolloutapply', name: 'rolloutapply', component: resolve => require(['../pages/record/business-apply/rollout-apply.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 业务申请审核',
                    breadcrumbList: [{
                        name: "档案转出申请审核",
                        path: 'rolloutapply'
                    }]
                }
            },
            {
                path: 'record/lookapply', name: 'lookapply', component: resolve => require(['../pages/record/business-apply/look-apply.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 业务申请审核',
                    breadcrumbList: [{
                        name: "档案查阅申请审核",
                        path: 'lookapply'
                    }]
                }
            },
            {
                path: 'record/proveapply', name: 'proveapply', component: resolve => require(['../pages/record/business-apply/prove-apply.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 业务申请审核',
                    breadcrumbList: [{
                        name: "相关证明申请审核",
                        path: 'proveapply'
                    }]
                }
            },
            {
                path: 'record/accountapply', name: 'accountapply', component: resolve => require(['../pages/record/business-apply/account-apply.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 业务申请审核',
                    breadcrumbList: [{
                        name: "开户申请审核",
                        path: 'accountapply'
                    }]
                }
            },
            //人事档案管理-->综合查询统计服务
            {
                path: 'record/queryservice', name: 'queryservice', component: resolve => require(['../pages/record/integrated-query/query-service.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 综合查询统计服务',
                    breadcrumbList: [{
                        name: "查询服务",
                        path: 'queryservice'
                    }]
                }
            },
            {
                path: 'record/unitqueryservice', name: 'unitqueryservice', component: resolve => require(['../pages/record/integrated-query/unit-queryservice.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 综合查询统计服务',
                    breadcrumbList: [{
                        name: "单位查询服务",
                        path: 'unitqueryservice'
                    }]
                }
            },

            //人事档案管理-->档案统计分析
            {
                path: 'record/personinfo', name: 'personinfo', component: resolve => require(['../pages/record/record-statistical/person-statistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "人员信息统计分析",
                        path: 'personinfo'
                    }]
                }
            },
            {
                path: 'record/accept', name: 'accept', component: resolve => require(['../pages/record/record-statistical/record-acceptStatistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "档案接收统计分析",
                        path: 'accept'
                    }]
                }
            },
            {
                path: 'record/rollout', name: 'rollout', component: resolve => require(['../pages/record/record-statistical/record-rollOutStatistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "档案转出统计分析",
                        path: 'rollout'
                    }]
                }
            },
            {
                path: 'record/used', name: 'used', component: resolve => require(['../pages/record/record-statistical/record-useStatistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "档案利用统计分析",
                        path: 'used'
                    }]
                }
            },
            {
                path: 'record/proveanalysis', name: 'proveanalysis', component: resolve => require(['../pages/record/record-statistical/prove-statistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "证明出具统计分析",
                        path: 'proveanalysis'
                    }]
                }
            },
            {
                path: 'record/workload', name: 'workload', component: resolve => require(['../pages/record/record-statistical/workload-statistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "工作量统计分析",
                        path: 'workload'
                    }]
                }
            },
            {
                path: 'record/agentunit', name: 'agentunit', component: resolve => require(['../pages/record/record-statistical/agentunit-statistical.vue'], resolve),
                meta: {
                    title: '人事档案管理 / 档案统计分析',
                    breadcrumbList: [{
                        name: "代理单位统计分析",
                        path: 'agentunit'
                    }]
                }
            },
            // 大数据分析
            {
                path: 'analysis', name: 'analysis', component: resolve => require(['../pages/analysis/analysis.vue'], resolve),
                meta: {
                    title: '大数据分析',
                    breadcrumbList: [{
                        name: "大数据分析",
                        path: 'analysis',
                    }]
                },
            },

            // 流动人才报告
            {
                path: 'report', name: 'report', component: resolve => require(['../pages/report/report.vue'], resolve),
                meta: {
                    title: '流动人才报告',
                    breadcrumbList: [{
                        name: "流动人才报告",
                        path: 'report',
                    }]
                },
            },

            // 档案库房管理
            // 档案库房管理 -->  库房信息管理
            {
                path: 'room/roomInfo', name: 'roomInfo', component: resolve => require(['../pages/storeroom/room-info.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "库房信息管理",
                        path: 'room/roomInfo',
                    }]
                },
            },

            // 档案库房管理 -->  档案密集架管理
            {
                path: 'room/shelf', name: 'shelf', component: resolve => require(['../pages/storeroom/room-shelf.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "档案密集架管理",
                        path: 'room/shelf',
                    }]
                },
            },

            // 档案库房管理 -->  档案交接服务 / 档案交接
            {
                path: 'room/recordHandOver', name: 'recordHandOver', component: resolve => require(['../pages/storeroom/handover/record-handover.vue'], resolve),
                meta: {
                    title: '档案库房管理 / 档案交接服务',
                    breadcrumbList: [{
                        name: "档案交接",
                        path: 'room/recordHandOver'
                    }]
                }
            },  
            
             // 档案库房管理 -->  档案交接服务 / 材料交接
            {
                path: 'room/materialHandOver', name: 'materialHandOver', component: resolve => require(['../pages/storeroom/handover/material-handover.vue'], resolve),
                meta: {
                    title: '档案库房管理 / 档案交接服务',
                    breadcrumbList: [{
                        name: "材料交接",
                        path: 'room/materialHandOver'
                    }]
                }
            }, 

            // 档案库房管理 -->  档案入库登记
            {
                path: 'room/recordCheckIn', name: 'recordCheckIn', component: resolve => require(['../pages/storeroom/record-check-in.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "档案入库登记",
                        path: 'room/recordCheckIn',
                    }]
                },
            },

            // 档案库房管理 -->  档案入库登记查询
            {
                path: 'room/recordInSearch', name: 'recordInSearch', component: resolve => require(['../pages/storeroom/record-in-search.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "档案入库登记查询",
                        path: 'room/recordInSearch',
                    }]
                },
            },

            // 档案库房管理 -->  档案查阅服务
            {
                path: 'room/recordCheck', name: 'recordCheck', component: resolve => require(['../pages/storeroom/record-check.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "档案查阅服务",
                        path: 'room/recordCheck',
                    }]
                },
            },

            // 档案库房管理 -->  档案出库登记
            {
                path: 'room/recordCheckOut', name: 'recordCheckOut', component: resolve => require(['../pages/storeroom/record-check-out.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "档案出库登记",
                        path: 'room/recordCheckOut',
                    }]
                },
            }, 

             // 档案库房管理 -->  档案出库登记查询
            {
                path: 'room/recordOutSearch', name: 'recordOutSearch', component: resolve => require(['../pages/storeroom/record-out-search.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "档案出库登记查询",
                        path: 'room/recordOutSearch',
                    }]
                },
            },
            
            // 档案库房管理 -->  材料借出服务
            {
                path: 'room/materialLend', name: 'materialLend', component: resolve => require(['../pages/storeroom/material-lend.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "材料借出服务",
                        path: 'room/materialLend',
                    }]
                },
            }, 

            // 档案库房管理 -->  人员退休提醒
            {
                path: 'room/retirementRemind', name: 'retirementRemind', component: resolve => require(['../pages/storeroom/retirement-remind.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "人员退休提醒",
                        path: 'room/retirementRemind',
                    }]
                },
            },  

            // 档案库房管理 -->  个人电子档案预览
            {
                path: 'room/recordPreview', name: 'recordPreview', component: resolve => require(['../pages/storeroom/record-preview.vue'], resolve),
                meta: {
                    title: '档案库房管理',
                    breadcrumbList: [{
                        name: "个人电子档案预览",
                        path: 'room/recordPreview',
                    }]
                },
            },                   


            //系统维护
            // {
            //     path:'system',
            //     name:'system',
            //     component: resolve => require(['../pages/systemManager/organization/organ-manager.vue'], resolve),
            //     meta: {
            //         title: '系统维护',
            //         breadcrumbList: [{
            //         }]
            //     },
            // },
            //系统维护-->组织机构管理
            {
                path: 'system/organ', name: 'organ', component: resolve => require(['../pages/systemManager/organization/organ-manager.vue'], resolve),
                meta: {
                    title: '系统维护 / 组织机构管理',
                    breadcrumbList: [{
                        name: "机构管理",
                        path: 'organ'
                    }]
                }
            },
            //系统维护-->权限管理
            {
                path: 'system/user', name: 'user', component: resolve => require(['../pages/systemManager/permissions/user-manager.vue'], resolve),
                meta: {
                    title: '系统维护 / 权限管理',
                    breadcrumbList: [{
                        name: "用户管理",
                        path: 'user'
                    }]
                }
            },
            {
                path: 'system/permission', name: 'permission', component: resolve => require(['../pages/systemManager/permissions/permission-division.vue'], resolve),
                meta: {
                    title: '系统维护 / 权限管理',
                    breadcrumbList: [{
                        name: "权限分配",
                        path: 'permission'
                    }]
                }
            },
            {
                path: 'system/role', name: 'role', component: resolve => require(['../pages/systemManager/permissions/role-manager.vue'], resolve),
                meta: {
                    title: '系统维护 / 权限管理',
                    breadcrumbList: [{
                        name: "角色管理",
                        path: 'role'
                    }]
                }
            },
            //系统维护-->日志管理
            {
                path: 'system/recordanalysis', name: 'recordanalysis', component: resolve => require(['../pages/systemManager/daily-log/record-analysis.vue'], resolve),
                meta: {
                    title: '系统维护 / 日志管理',
                    breadcrumbList: [{
                        name: "档案人员分析",
                        path: 'recordanalysis'
                    }]
                }
            },
            {
                path: 'system/loganalysis', name: 'loganalysis', component: resolve => require(['../pages/systemManager/daily-log/log-analysis.vue'], resolve),
                meta: {
                    title: '系统维护 / 日志管理',
                    breadcrumbList: [{
                        name: "功能日志分析",
                        path: 'loganalysis'
                    }]
                }
            },
            {
                path: 'system/useranalysis', name: 'useranalysis', component: resolve => require(['../pages/systemManager/daily-log/user-analysis.vue'], resolve),
                meta: {
                    title: '系统维护 / 日志管理',
                    breadcrumbList: [{
                        name: "用户日志分析",
                        path: 'useranalysis'
                    }]
                }
            },
            {
                path: 'system/systemnotice', name: 'systemnotice', component: resolve => require(['../pages/systemManager/daily-log/system-notice.vue'], resolve),
                meta: {
                    title: '系统维护 / 日志管理',
                    breadcrumbList: [{
                        name: "系统通知",
                        path: 'systemnotice'
                    }]
                }
            },
            //系统维护-->字典
            {
                path: 'system/dictionary', name: 'dictionary', component: resolve => require(['../pages/systemManager/dictionary.vue'], resolve),
                meta: {
                    title: '系统维护',
                    breadcrumbList: [{
                        name: "字典",
                        path: 'system/dictionary',
                    }]
                },
            },

            //系统设置
            // {
            //     path:'systemset',
            //     name:'systemset',
            //     component: resolve => require(['../pages/system-set/password.vuee'], resolve),
            //     meta: {
            //         title: '系统设置',
            //         breadcrumbList: [{
            //         }]
            //     },
            // },
            
            //系统设置--修改密码
            {
                path: 'systemset/password', name: 'password', component: resolve => require(['../pages/system-set/password.vue'], resolve),
                meta: {
                    title: '系统设置',
                    breadcrumbList: [{
                        name: "修改密码",
                        path: 'systemset/password',
                    }]
                },
            },
            //系统设置--pad数据生成
            {
                path: 'systemset/paddata', name: 'paddata', component: resolve => require(['../pages/system-set/pad-data.vue'], resolve),
                meta: {
                    title: '系统设置',
                    breadcrumbList: [{
                        name: "Pad数据生成",
                        path: 'systemset/paddata',
                    }]
                },
            },
            //系统设置--模块管理
            {
                path: 'systemset/modulemanager', name: 'modulemanager', component: resolve => require(['../pages/system-set/module-manager.vue'], resolve),
                meta: {
                    title: '系统设置',
                    breadcrumbList: [{
                        name: "模块管理",
                        path: 'systemset/modulemanager',
                    }]
                },
            },
        ]
    }
];



let router = new vueRouter({ routes });

// 路由拦截
router.beforeEach((to,from,next)=>{
    if(to.path === '/' || to.matched.length <= 0){
        router.push({path:'/talentinfo/infopoll'});
    }else{
        next();
    }
});

// export default router;
export default router;