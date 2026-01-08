export default [
  {
    path: "/house-type",
    children: [
      {
        path: "home",
        name: "HouseType_Home",
        component: () => import("@/views/house-type/HouseTypeView.vue"),
        meta: {
          leftArrow: true,
          title: "全屋家电方案",
          rightText: "历史方案",
          rightIcon: "icon-history.png"
        }
      },
      {
        path: "analysis",
        name: "HouseType_Analysis",
        component: () => import("@/views/house-type/HouseTypeAnalysisView.vue"),
        meta: {
          leftArrow: true,
          title: "方案分析"
        }
      },
      {
        path: "adapt",
        name: "HouseType_Adapt",
        component: () => import("@/views/house-type/HouseTypeAdaptView.vue"),
        meta: {
          leftArrow: true,
          title: "智能适配"
        }
      },
      {
        path: "result",
        name: "HouseType_Result",
        component: () => import("@/views/house-type/HouseTypeResultView.vue"),
        meta: {
          leftArrow: true,
          title: "场景演练",
          rightText: "历史方案",
          rightIcon: "icon-history.png"
        }
      },
      {
        path: "example",
        name: "HouseType_Example",
        component: () => import("@/views/house-type/HouseTypeExampleView.vue"),
        meta: {
          leftArrow: true,
          title: "示例"
        }
      },
      {
        path: "history",
        name: "HouseType_History",
        component: () => import("@/views/house-type/HouseTypeHistoryView.vue"),
        meta: {
          leftArrow: true,
          title: "历史方案"
        }
      }
    ]
  }
];
