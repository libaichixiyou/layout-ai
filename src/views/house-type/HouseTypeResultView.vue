<script setup lang="ts">
import {BroadcastManager, Broadcast} from "uxmid-core";
import {onActivated, onDeactivated, computed} from "vue";
import {useRouter} from "vue-router";
import {
  Icon,
  Button,
  Skeleton,
  SkeletonImage,
  SkeletonParagraph,
  showConfirmDialog,
  showDialog,
  showImagePreview
} from "vant";
import {houseType} from "@/stores/house-type";
import {BroadcastChannel} from "@/broadcasts";
import ApplicationContext from "@/application/context";

const $router = useRouter();

const houseTypeStore = houseType();
const rooms = computed(() => {
  return houseTypeStore.getRooms(true);
});
const priceList = computed(() => {
  const list: any[] = [];
  rooms.value.forEach((room) => {
    const priceItem: any = {
      name: room.name
    };
    if (room.appliances) {
      let price = 0;
      room.appliances.forEach((appliance: any) => {
        if (typeof appliance.price === "number") {
          price += appliance.price;
        }
      });
      if (price > 0) {
        priceItem.price = price;
      }
    }
    list.push(priceItem);
  });
  return list;
});
const priceTotal = computed(() => {
  let total = 0;
  priceList.value.forEach((item) => {
    if (typeof item.price === "number") {
      total += item.price;
    }
  });
  return total;
});
const themeTitle = computed(() => {
  return houseTypeStore.themeTitle;
});
const themeSubtitle = computed(() => {
  return houseTypeStore.themeSubtitle;
});
const summary = computed(() => {
  return houseTypeStore.summary;
});

onActivated(() => {
  // 组件激活时的逻辑
  ApplicationContext.current.defaultEvent.addListener("ON_NAVBAR_RIGHT_CLICK", onNavRightClick);
});
onDeactivated(() => {
  // 组件失活时的逻辑
  ApplicationContext.current.defaultEvent.removeListener("ON_NAVBAR_RIGHT_CLICK", onNavRightClick);
});

function onProductClick(item: any) {
  showConfirmDialog({
    title: "是否要跳转购买页"
  }).then(() => {
    // Open a new window/tab with the product's URL
    window.open(item.url, "_blank");
  });
}

function onNavRightClick() {
  $router.push({name: "HouseType_History"});
}

function resolveAmount(value: number) {
  return value.toFixed(0);
}

function onSave() {
  BroadcastManager.instance.send(new Broadcast(BroadcastChannel.SAVE_HOUSE_TYPE_ROOM));
  showDialog({
    title: "已保存方案"
  });
}

function onRedo() {
  $router.push({name: "HouseType_Home"});
}
</script>

<template>
  <div class="px-4 pt-4">
    <div class="scheme-card-header relative rounded-t-2xl flex flex-col items-center justify-center">
      <Skeleton :loading="!Boolean(themeTitle)" :row="2" :animated="true" class="w-[220px] flex justify-center">
        <div class="flex flex-col items-center">
          <p class="text-[18px] leading-none text-white font-semibold !mt-5">方案主题："{{ themeTitle }}"</p>
          <p class="text-[12px] leading-none text-white !mt-2">（{{ themeSubtitle }}）</p>
        </div>
        <template #template>
          <div class="w-full flex flex-col justify-center items-center">
            <SkeletonParagraph row-width="60%" class="!h-[18px] !mt-5" />
            <SkeletonParagraph class="!h-[12px] !mt-[6px]" />
          </div>
        </template>
      </Skeleton>
      <p class="text-[12px] leading-none !mt-[6px] !mb-[18px]">详细产品清单及布局</p>
      <div class="absolute bottom-0 w-full h-2 bg-white rounded-t-lg"></div>
    </div>
    <div class="scheme-card-content pt-1 px-3 pb-3 bg-white rounded-b-2xl">
      <div class="!mb-6 last:!mb-0" v-for="(room, i) in rooms" :key="i">
        <div class="text-xs leading-none text-[#a0a3a9]">{{ room.name }}（{{ room.area }}㎡）</div>

        <template v-if="Array.isArray(room.appliances) && room.appliances.length > 0">
          <div class="py-1 flex gap-4" v-for="(item, j) in room.appliances" :key="j">
            <Skeleton :loading="!item.price" :row="2" :animated="true" class="w-full flex justify-center !p-0">
              <div class="w-[83px] h-[72px] flex-none rounded bg-gray-500">
                <img
                  :src="item.imgUrl"
                  class="w-full h-full object-cover rounded"
                  @click.stop="showImagePreview([item.imgUrl])"
                />
              </div>
              <div class="flex flex-col justify-between" @click="onProductClick(item)">
                <div class="">
                  <p class="text-xs leading-[15px] font-semibold !mb-1 text-[#111827]">{{ item.title }}</p>
                  <p class="text-[10px] leading-[14px] text-[#70747d]">{{ item.desc }}</p>
                </div>
                <div class="text-xs leading-[18px] font-semibold text-[#556FF1]">¥ {{ item.price }}</div>
              </div>
              <template #template>
                <div class="w-full flex">
                  <SkeletonImage class="!w-[83px] !h-[72px] flex-none rounded" />
                  <div class="flex flex-col justify-between w-full !pl-4">
                    <div>
                      <SkeletonParagraph row-width="60%" class="!h-[15px] !mb-1" />
                      <SkeletonParagraph row-width="80%" class="!h-[14px] !mt-0" />
                    </div>
                    <SkeletonParagraph row-width="30%" class="!h-[18px]" />
                  </div>
                </div>
              </template>
            </Skeleton>
          </div>
        </template>
        <div v-else class="py-1">
          <Skeleton :loading="true" :row="2" :animated="true" class="w-full flex justify-center !p-0">
            <template #template>
              <div class="w-full flex">
                <SkeletonImage class="!w-[83px] !h-[72px] flex-none rounded" />
                <div class="flex flex-col justify-between w-full !pl-4">
                  <div>
                    <SkeletonParagraph row-width="60%" class="!h-[15px] !mb-1" />
                    <SkeletonParagraph row-width="80%" class="!h-[14px] !mt-0" />
                  </div>
                  <SkeletonParagraph row-width="30%" class="!h-[18px]" />
                </div>
              </div>
            </template>
          </Skeleton>
        </div>
      </div>
    </div>
  </div>

  <div class="px-4 pt-4">
    <div class="relative rounded-2xl bg-white p-4">
      <div class="flex items-center !mb-[7px]">
        <img class="w-5 h-5 !mr-[10px]" src="@/assets/icons/icon-light.png" />
        <span class="text-sm leading-none">价格总览</span>
      </div>
      <div class="!mb-[7px] px-4 py-2 flex justify-between text-sm leading-[18px] bg-[#f3f3f4]">
        <span>区域</span>
        <span>金额</span>
      </div>
      <div class="px-4 py-2 flex justify-between text-sm leading-[18px]" v-for="(item, i) in priceList" :key="i">
        <Skeleton
          :loading="!(typeof item.price === 'number')"
          :row="1"
          :animated="true"
          class="w-full flex justify-center !p-0"
        >
          <div class="flex justify-between text-sm leading-[18px] w-full">
            <span>{{ item.name }}</span>
            <span>¥ {{ resolveAmount(item.price) }}</span>
          </div>
          <template #template>
            <div class="flex justify-between text-sm leading-[18px] w-full">
              <span>{{ item.name }}</span>
              <SkeletonParagraph row-width="15%" class="!h-[18px] !m-0" />
            </div>
          </template>
        </Skeleton>
      </div>
      <div class="px-4 py-2 flex justify-between text-sm leading-[18px]">
        <Skeleton
          :loading="!(typeof priceTotal === 'number')"
          :row="1"
          :animated="true"
          class="w-full flex justify-center !p-0"
        >
          <div class="flex justify-between text-sm leading-[18px] w-full">
            <span>总计</span>
            <span>¥ {{ resolveAmount(priceTotal) }}</span>
          </div>
          <template #template>
            <div class="flex justify-between text-sm leading-[18px] w-full">
              <span>总计</span>
              <SkeletonParagraph row-width="15%" class="!h-[18px] !m-0" />
            </div>
          </template>
        </Skeleton>
      </div>
    </div>
  </div>

  <div class="px-4 py-4">
    <div class="relative rounded-2xl bg-white p-4">
      <div class="flex items-center !mb-[7px]">
        <img class="w-5 h-5 !mr-[10px]" src="@/assets/icons/icon-light.png" />
        <span class="text-sm leading-none">方案核心优势</span>
      </div>

      <div class="text-xs leading-[19px] pl-[30px] pt-4 whitespace-pre-line">{{ summary }}</div>
    </div>
  </div>

  <div class="h-[81px] w-full"></div>
  <div class="fixed bottom-0 p-4 bg-white w-full border-t border-solid border-[#f3f4f6] flex gap-[10px]">
    <Button class="w-full px-6 py-2 text-white border rounded-lg" color="#556FF1" @click="onSave">
      <div class="flex items-center">
        <Icon size="16" color="#fff" name="star-o" />
        <span class="text-[16px] !ml-2">保存</span>
      </div>
    </Button>
    <Button class="w-full px-6 py-2 text-white border rounded-lg" color="#556FF1" @click="onRedo">
      <div class="flex items-center">
        <Icon size="16" color="#fff" name="replay" />
        <span class="text-[16px] !ml-2">重新生成</span>
      </div>
    </Button>
  </div>

  <!-- <Overlay :show="isShowMask">
    <div class="h-full flex items-center justify-center" @click.stop>
      <div class="w-[128px] h-[128px] bg-white flex items-center justify-center rounded flex-col">
        <Loading type="spinner" vertical size="32px">正在生成推荐电器...</Loading>
      </div>
    </div>
  </Overlay> -->
</template>

<style lang="scss" scoped>
.scheme-card-header {
  background: linear-gradient(180deg, #4563ff 0%, rgba(94, 120, 255, 0) 100%);
}
</style>
