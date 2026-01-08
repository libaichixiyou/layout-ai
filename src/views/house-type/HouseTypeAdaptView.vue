<script setup lang="ts">
import {computed} from "vue";
import {useRouter} from "vue-router";
import {Button} from "vant";
import {houseType} from "@/stores/house-type";

const $router = useRouter();

const houseTypeStore = houseType();
const rooms = computed(() => houseTypeStore.rooms);
const isFailed = computed(() => rooms.value.length === 0);

function onNext() {
  $router.push({name: "HouseType_Result"});
}
function onRedo() {
  $router.push({name: "HouseType_Home"});
}
</script>

<template>
  <div class="p-4">
    <div class="bg-white rounded-2xl p-4">
      <p class="text-base leading-none text-[#111827] font-semibold">正在为您的房间智能适配家电</p>

      <div class="!mt-[10px]" v-for="(room, i) in rooms" :key="i">
        <p class="flex justify-between text-sm leading-[18px]">
          <span>{{ room.name }}</span>
          <span>{{ room.area }}㎡</span>
        </p>
        <template v-if="room.appliances">
          <p class="!mt-[10px] pl-2 text-sm leading-[18px]" v-for="(appliance, j) in room.appliances" :key="j">
            <span class="text-[#70747d]">{{ appliance.keyword }}</span>
          </p>
        </template>
        <p class="!mt-[10px] text-sm leading-[18px]" v-else>
          <span class="text-[#70747d]">无推荐电器</span>
        </p>
      </div>
    </div>
  </div>

  <div class="h-[81px] w-full"></div>
  <div class="fixed bottom-0 p-4 bg-white w-full border-t border-solid border-[#f3f4f6]">
    <Button v-if="isFailed" class="w-full px-6 py-2 text-white border rounded-lg" color="#556FF1" @click="onRedo">
      <span class="text-[16px]">重新生成</span>
    </Button>
    <Button v-else class="w-full px-6 py-2 text-white border rounded-lg" color="#556FF1" @click="onNext">
      <span class="text-[16px]">下一步</span>
    </Button>
  </div>
</template>
