<script setup lang="ts">
import {ref, watchEffect} from "vue";
import {NavBar} from "vant";
import ApplicationContext from "@/application/context";

const props = defineProps<{
  /**
   * 导航标题
   */
  title?: string;
  /**
   * 是否显示左侧箭头
   */
  leftArrow?: boolean;
  /**
   * 是否显示左侧按钮文字
   */
  leftText?: string;
  /**
   * 右侧文字
   */
  rightText?: string;
  /**
   * 右侧图标
   */
  rightIcon?: string;
}>();

const rightIconSrc = ref("");

watchEffect(async () => {
  if (props.rightIcon) {
    rightIconSrc.value = new URL(`../assets/icons/${props.rightIcon}`, import.meta.url).href;
  }
});

function onClickLeft() {
  history.back();
}

function onClickRight() {
  ApplicationContext.current.defaultEvent.dispatchEvent("ON_NAVBAR_RIGHT_CLICK");
}
</script>

<template>
  <NavBar
    :title="props.title"
    z-index="1000"
    fixed
    placeholder
    :left-arrow="leftArrow"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #right v-if="props.rightText">
      <div class="flex items-center">
        <img v-if="props.rightIcon" :src="rightIconSrc" class="w-4 h-4" />
        <span class="!ml-[2px] text-sm leading-none text-[#111827]">{{ props.rightText }}</span>
      </div>
    </template>
  </NavBar>
</template>

<style lang="scss" scoped>
.van-nav-bar__placeholder {
  box-shadow: 0px 5px 16px 2px rgba(18, 23, 46, 0.06);
}
:deep(.van-nav-bar__left) {
  i {
    color: #000;
  }
}
</style>
