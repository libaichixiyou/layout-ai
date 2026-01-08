<script setup lang="ts">
import {ref, onActivated} from "vue";
import {useRouter} from "vue-router";
import {DcloudHouseTypeService} from "@/services";
import ApplicationContext from "@/application/context";
import {houseType} from "@/stores/house-type";

const $router = useRouter();
const dcloudHouseTypeService =
  ApplicationContext.current.serviceFactory.default.resolve<DcloudHouseTypeService>(DcloudHouseTypeService);
const houseTypeStore = houseType();
const localRooms = ref<any[]>([]);

onActivated(() => {
  dcloudHouseTypeService
    .getHouseTypeRoomsHistory()
    .then((res) => {
      localRooms.value = res;
    })
    .catch((error) => {
      console.error("Error fetching house type rooms history:", error);
    });
});

function navHome() {
  $router.push({
    name: "HouseType_Home"
  });
}

function navResult(item: any) {
  houseTypeStore.setRooms(item.rooms);
  houseTypeStore.setThemeTitle(item.themeTitle);
  houseTypeStore.setThemeSubtitle(item.themeSubtitle);
  houseTypeStore.setSummary(item.summary);
  houseTypeStore.setPrompt(item.prompt);
  houseTypeStore.setHouseTypeImage(item.imageData);

  $router.push({
    name: "HouseType_Result"
  });
}

function formatedTime(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
</script>

<template>
  <div class="!mt-[160px] flex flex-col justify-center items-center" v-if="localRooms.length === 0">
    <img src="@/assets/imgs/no-data.png" class="w-[188px] h-[150px]" />
    <p class="text-sm leading-none font-semibold text-[#111827] !mt-1">还没有生成过产品方案</p>
    <p class="text-xs leading-[14px] text-[#9c9fa6] !mt-[6px]">去生成你的方案吧</p>
    <div
      class="h-8 w-[120px] rounded-[334px] bg-[#556FF1] flex items-center justify-center !mt-[19px]"
      @click="navHome"
    >
      <span class="plan-btn text-base leading-none text-white">去生成方案</span>
    </div>
  </div>

  <div class="px-4 py-5">
    <div class="rounded-2xl bg-white">
      <div class="p-2 flex" v-for="(item, i) in localRooms" :key="i">
        <img :src="item.imageData" class="w-[85px] h-[80px] rounded-lg border border-solid border-[#E2EFFF]" />
        <div class="pl-2 py-1 flex flex-col justify-between" @click="navResult(item)">
          <p class="text-xs leading-[18px] text-[#111827]">{{ item.prompt }}</p>
          <p class="text-xs leading-none text-[#a0a3a9]">{{ formatedTime(item.timestamp) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.plan-btn {
  box-shadow: 0px 8px 30px 0px rgba(85, 111, 241, 0.6);
}
</style>
