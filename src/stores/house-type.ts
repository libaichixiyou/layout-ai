import {ref, computed} from "vue";
import {defineStore} from "pinia";

export const houseType = defineStore("Store_House_Type", () => {
  const prompt = ref("");
  function setPrompt(value: string) {
    prompt.value = value;
  }

  const houseTypeImage = ref("");
  function setHouseTypeImage(value: string) {
    houseTypeImage.value = value;
  }

  const rooms = ref<Array<{name: string; area: number; [key: string]: any}>>([]);
  function getRooms(isResult: boolean = false) {
    return isResult ? rooms.value.filter((room) => room["appliances"] && room["appliances"].length > 0) : rooms.value;
  }
  function setRooms(value: Array<{name: string; area: number; [key: string]: any}>) {
    rooms.value = value;
  }
  function setRoomAppliance(roomIndex: number, applianceIndex: number, appliance: any) {
    rooms.value[roomIndex].appliances[applianceIndex] = appliance;
  }

  const themeTitle = ref("");
  function setThemeTitle(value: string) {
    themeTitle.value = value;
  }
  const themeSubtitle = ref("");
  function setThemeSubtitle(value: string) {
    themeSubtitle.value = value;
  }
  const summary = ref("");
  function setSummary(value: string) {
    summary.value = value;
  }

  const loading = ref(false);
  function setLoading(value: boolean) {
    loading.value = value;
  }
  const loadedRecommend = ref(false);
  function setLoadedRecommend(value: boolean) {
    loadedRecommend.value = value;
  }

  return {
    prompt,
    setPrompt,
    houseTypeImage,
    setHouseTypeImage,
    rooms,
    setRooms,
    getRooms,
    setRoomAppliance,
    themeTitle,
    setThemeTitle,
    themeSubtitle,
    setThemeSubtitle,
    summary,
    setSummary,
    loading,
    setLoading,
    loadedRecommend,
    setLoadedRecommend
  };
});
