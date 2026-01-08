<script setup lang="ts">
import {watch, ref} from "vue";
import {RouterView, useRoute, useRouter} from "vue-router";
import NavBar from "./components/NavBar.vue";

const $route = useRoute();
const $router = useRouter();

const navigationHistory = ref<string[]>([]);
const navTitle = ref("");
const navLeftArrow = ref(false);
const navLeftText = ref("");
const rightText = ref("");
const rightIcon = ref("");

watch(
  () => $route.fullPath,
  (newPath) => {
    navigationHistory.value.push(newPath);
  }
);

watch(
  () => $route.meta,
  (meta) => {
    navTitle.value = String(meta.title);
    navLeftArrow.value = Boolean(meta.leftArrow);
    navLeftText.value = navLeftArrow.value ? "返回" : "";
    rightText.value = meta.rightText ? String(meta.rightText) : "";
    rightIcon.value = meta.rightIcon ? String(meta.rightIcon) : "";
  }
);

function onClickLeft() {
  if (navigationHistory.value.length > 1) {
    navigationHistory.value.pop(); // Remove current route
    const previousRoute = navigationHistory.value.pop(); // Get previous route
    $router.push(previousRoute || "/");
  } else {
    $router.push("/");
  }
}
</script>

<template>
  <NavBar
    :title="navTitle"
    :left-arrow="navLeftArrow"
    :left-text="navLeftText"
    :right-text="rightText"
    :right-icon="rightIcon"
    @click-left="onClickLeft"
  />

  <RouterView v-slot="{Component}">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>

<style lang="scss" scoped></style>
