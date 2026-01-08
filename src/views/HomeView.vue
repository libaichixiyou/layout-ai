<script setup lang="ts">
import {useRouter} from "vue-router";
import {Button} from "vant";
const $router = useRouter();

function onNavHouseType() {
  $router.push({name: "HouseType_Home"});
}

function onTestSentry() {
  throw new Error("测试sentry");
}
</script>

<template>
  <main>
    <ul class="!p-4">
      <li @click="onNavHouseType">户型图推荐家电</li>
    </ul>

    <Button @click="onTestSentry">测试sentry</Button>
  </main>
</template>
