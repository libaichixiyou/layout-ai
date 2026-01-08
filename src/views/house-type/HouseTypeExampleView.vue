<script setup lang="ts">
import {ref} from "vue";
import {Field, showImagePreview} from "vant";

const defaultPrompt = ref("年轻夫妻和1个小孩，注重智能互联、节能环保、高性价比，预算3万");
const exampleImg = new URL("../../assets/imgs/example.jpg", import.meta.url).href;
</script>

<template>
  <p class="px-4 pt-4 text-base leading-none text-[#111827] font-semibold">上传的户型图样式示例:</p>
  <p class="px-4 pt-2 text-xs leading-none text-[#6d717a]">要求图片需有标注区域名称和面积(如客餐厅:21.55㎡)</p>
  <div class="px-4 pt-3">
    <div class="bg-[#eef0f7] rounded-lg h-[270px] flex justify-center overflow-hidden p-2">
      <img src="@/assets/imgs/example.jpg" class="h-full rounded-md" @click="showImagePreview([exampleImg])" />
    </div>
  </div>
  <p class="px-4 pt-4 text-base leading-none text-[#111827] font-semibold">要求填写示例：</p>
  <div class="px-4 pt-3 pb-4">
    <Field
      class="custom-input border border-solid border-[#cfd1d4] rounded-lg !p-2"
      type="textarea"
      disabled
      v-model="defaultPrompt"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-input {
  :deep(textarea) {
    line-height: 18px;
    color: #111827;
    -webkit-text-fill-color: #111827;
  }
}
</style>
