import {createRouter, createWebHashHistory} from "vue-router";
import HomeView from "@/views/house-type/HouseTypeView.vue";

import HouseType from "./modules/house-type";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "首页"
      }
    },
    ...HouseType
  ]
});

export default router;
