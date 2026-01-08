<script setup lang="ts">
import {BroadcastManager, Broadcast} from "uxmid-core";
import {computed, ref, onActivated, onDeactivated} from "vue";
import {useRouter} from "vue-router";
import {Button, Overlay} from "vant";
import {houseType} from "@/stores/house-type";
import {BroadcastChannel} from "@/broadcasts";

const $router = useRouter();

const houseTypeStore = houseType();
const rooms = computed(() => houseTypeStore.rooms);
const prompt = computed(() => houseTypeStore.prompt);
const imageData = houseTypeStore.houseTypeImage;
const isShowMask = ref(false);
const loadedRecommend = computed(() => {
  return houseTypeStore.loadedRecommend;
});

onActivated(() => {
  isShowMask.value = false;
  BroadcastManager.instance.send(new Broadcast(BroadcastChannel.UPDATE_HOUSE_TYPE_ROOM));
});

onDeactivated(() => {
  isShowMask.value = false;
});

function onNext() {
  isShowMask.value = true;
  const intervalId = setInterval(() => {
    if (loadedRecommend.value) {
      clearInterval(intervalId);
      isShowMask.value = false;
      setTimeout(() => {
        $router.push({name: "HouseType_Adapt"});
      }, 750);
    }
  }, 1000);
}
</script>

<template>
  <div class="p-4">
    <div class="bg-white rounded-2xl p-4">
      <p class="text-base leading-none text-[#111827] font-semibold">正在为您的房间智能适配家电</p>

      <div class="p-2 rounded-lg bg-[#f5f7fe] !mt-[10px] flex items-center justify-center">
        <img :src="imageData" />
      </div>

      <div class="px-2 py-1 bg-[#f5f7fe] rounded !mt-[10px]">
        <span class="text-xs leading-[18px] text-[#6c717d]">您房间的情况如下</span>
      </div>
      <p class="text-sm leading-[18px] text-[#111827] !mt-[10px]">共有{{ rooms.length }}个房间：</p>
      <p
        class="text-sm leading-[18px] text-[#111827] !mt-[10px] flex justify-between"
        v-for="(room, i) in rooms"
        :key="i"
      >
        <span>{{ room.name }}</span>
        <span>{{ room.area }}㎡</span>
      </p>

      <div class="px-2 py-1 bg-[#f5f7fe] rounded !mt-[10px]">
        <span class="text-xs leading-[18px] text-[#6c717d]">您的要求如下</span>
      </div>
      <p class="text-sm leading-[18px] text-[#111827] !mt-[10px]">{{ prompt }}</p>
    </div>
  </div>

  <div class="h-[81px] w-full"></div>
  <div class="fixed bottom-0 p-4 bg-white w-full border-t border-solid border-[#f3f4f6]">
    <Button class="w-full px-6 py-2 text-white border rounded-lg" color="#556FF1" @click="onNext">
      <span class="text-[16px]">下一步</span>
    </Button>
  </div>

  <Overlay :show="isShowMask" z-index="1000">
    <div class="h-full flex items-center justify-center" @click.stop>
      <div class="w-[260px] h-[194px] bg-white flex items-center justify-center rounded-2xl flex-col">
        <img src="@/assets/imgs/loading.gif" class="w-[80px] h-[80px]" />
        <p class="text-sm leading-none text-[#a0a3a9] !mt-[15px]">正在适配家电...</p>
      </div>
    </div>
  </Overlay>
</template>
