<script setup lang="ts">
import {ref, onActivated, onDeactivated} from "vue";
import {useRouter} from "vue-router";
import {Swipe, SwipeItem, Field, Uploader, Button, Overlay, showToast, type UploaderFileListItem} from "vant";
import ApplicationContext from "@/application/context";
import {CozeApiService, CozeHouseTypeService} from "@/services";
import {houseType} from "@/stores/house-type";

const $router = useRouter();

const cozeApiService = ApplicationContext.current.serviceFactory.default.resolve<CozeApiService>(CozeApiService);
const cozeHouseTypeService =
  ApplicationContext.current.serviceFactory.default.resolve<CozeHouseTypeService>(CozeHouseTypeService);
const houseTypeStore = houseType();

const fileList = ref([]);
const fileId = ref("");
const demand = ref("");
const isShowMask = ref(false);
const isNextDisabled = ref(true);

onActivated(() => {
  // 组件激活时的逻辑
  isShowMask.value = false;
  ApplicationContext.current.defaultEvent.addListener("ON_NAVBAR_RIGHT_CLICK", onNavRightClick);
});
onDeactivated(() => {
  // 组件失活时的逻辑
  isShowMask.value = false;
  ApplicationContext.current.defaultEvent.removeListener("ON_NAVBAR_RIGHT_CLICK", onNavRightClick);
});

function onNavRightClick() {
  $router.push({name: "HouseType_History"});
}

function onFileAfterRead(
  items: UploaderFileListItem | UploaderFileListItem[],
  detail: {
    name: number | string;
    index: number;
  }
) {
  if (Array.isArray(items)) {
    throw new Error("应该是单张图片");
  }
  if (!items.file) {
    throw new Error("图片不能为空");
  }

  // 将图片转换为Base64并存储到Pinia
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target && e.target.result) {
      // 保存图片数据到Pinia
      houseTypeStore.setHouseTypeImage(e.target.result as string);
    }
  };
  reader.readAsDataURL(items.file);

  cozeApiService
    .fileUpload(items.file)
    .then((res) => {
      fileId.value = res.data.data.id;
      isNextDisabled.value = false;
    })
    .catch((err) => {
      showToast(err.message);
    });
}

function navExample() {
  $router.push({name: "HouseType_Example"});
}

function onNavResult() {
  $router.push({name: "HouseType_Analysis"});
}

function onStart() {
  if (!fileId.value) {
    showToast("请先上传户型图");
    return;
  }

  isShowMask.value = true;
  houseTypeStore.setPrompt(demand.value);
  cozeHouseTypeService.identifyHouseTypeImage(fileId.value).then(() => {
    isShowMask.value = false;
    setTimeout(() => {
      onNavResult();
    }, 800);
  });
}
</script>

<template>
  <div class="bg-header absolute top-0 w-full h-[196px]"></div>

  <div class="relative z-10 px-4 pt-4">
    <Swipe :autoplay="3000">
      <!-- <SwipeItem>
        <img src="@/assets/imgs/banner1.png" class="w-full" />
      </SwipeItem> -->
      <SwipeItem>
        <img src="@/assets/imgs/banner2.png" class="w-full" />
      </SwipeItem>
    </Swipe>
  </div>

  <div class="relative z-10 px-4 pt-4">
    <div class="input-card bg-white rounded-2xl p-4">
      <div class="flex items-center justify-between">
        <span class="text-[16px] leading-none font-semibold">提交房型需求</span>
        <!-- <span class="text-sm leading-none text-[#556FF1]" @click="navExample">示例</span> -->
      </div>

      <div class="w-full h-[160px] bg-[#f5f7fe] flex items-center justify-center !mt-[10px]">
        <Uploader v-model="fileList" preview-size="160" max-count="1" :after-read="onFileAfterRead">
          <template #default>
            <div class="w-full h-full bg-[#f5f7fe] flex items-center justify-center">
              <img src="@/assets/icons/upload-icon.png" class="w-[46px] h-[46px]" />
              <span class="text-sm leading-none text-[#556FF1] !ml-[10px]">上传户型图</span>
            </div>
          </template>
        </Uploader>
      </div>

      <div class="require-input-container !mt-[10px] border border-solid border-[#cfd1d4] rounded-lg">
        <Field
          class="rounded-lg !p-2 leading-[18px]"
          label=""
          v-model="demand"
          type="textarea"
          placeholder="请输入您的要求，例如注重智能互联、节能环保、高性价比"
          maxlength="80"
          rows="3"
        />
      </div>

      <div class="w-full !mt-[10px]">
        <Button
          class="w-full px-6 py-2 text-white border rounded-lg"
          color="#556FF1"
          :disabled="isNextDisabled"
          @click="onStart"
        >
          <span class="text-[16px]">生成方案</span>
        </Button>
      </div>
    </div>
  </div>

  <Overlay :show="isShowMask" z-index="1000">
    <div class="h-full flex items-center justify-center" @click.stop>
      <div class="w-[260px] h-[194px] bg-white flex items-center justify-center rounded-2xl flex-col">
        <img src="@/assets/imgs/loading.gif" class="w-[80px] h-[80px]" />
        <p class="text-sm leading-none text-[#a0a3a9] !mt-[15px]">正在分析需求...</p>
      </div>
    </div>
  </Overlay>
</template>

<style lang="scss" scoped>
.bg-header {
  background: linear-gradient(180deg, #e1e6ff 0%, rgba(223, 229, 255, 0) 100%);
}
.input-card {
  background: linear-gradient(180deg, #e2efff 0%, rgba(229, 252, 255, 0) 7%), #ffffff;
  box-shadow: 0px 0px 6px 0px rgba(18, 23, 46, 0.06);
}
:deep(.van-uploader__upload) {
  margin: 0;
}
.require-input-container {
  :deep(textarea) {
    line-height: 18px;
  }
}
</style>
