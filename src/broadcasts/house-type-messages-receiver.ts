import {type IBroadcastReceiver, BroadcastContext, Receivable, Map} from "uxmid-core";
import {computed} from "vue";
import ApplicationContext from "@/application/context";
import BroadcastChannel from "./channels";
import {CozeHouseTypeService, DcloudHouseTypeService} from "@/services";
import {houseType} from "@/stores/house-type";

@Receivable(BroadcastChannel.UPDATE_HOUSE_TYPE_ROOM)
@Receivable(BroadcastChannel.SAVE_HOUSE_TYPE_ROOM)
export default class HouseTypeMessagesReceiver implements IBroadcastReceiver {
  public async receive(context: BroadcastContext): Promise<void> {
    switch (context.uri) {
      case BroadcastChannel.UPDATE_HOUSE_TYPE_ROOM: {
        const cozeHouseTypeService =
          ApplicationContext.current.serviceFactory.default.resolve<CozeHouseTypeService>(CozeHouseTypeService);
        const houseTypeStore = houseType();
        const rooms = computed(() => houseTypeStore.rooms);
        const prompt = computed(() => houseTypeStore.prompt);

        if (houseTypeStore.loading) {
          console.info("有正在进行中的请求");
          return;
        }

        const reqRooms = rooms.value.map((item) => {
          return {
            name: item.name,
            area: item.area
          };
        });
        houseTypeStore.setLoadedRecommend(false);
        houseTypeStore.setLoading(true);
        cozeHouseTypeService.getHouseTypeRecommandAppliances(prompt.value, reqRooms).then(() => {
          houseTypeStore.setLoadedRecommend(true);
          const roomIndexList: Array<number> = [];
          const applianceIndexList: Array<number> = [];
          const reqs: Array<any> = [];
          rooms.value.forEach((room: any, roomIndex: number) => {
            const name = room.name;
            const area = room.area;
            room.appliances.forEach((appliance: any, applianceIndex: number) => {
              roomIndexList.push(roomIndex);
              applianceIndexList.push(applianceIndex);
              reqs.push(
                cozeHouseTypeService.getTargetAppliance(name, area, prompt.value, appliance.keyword, appliance.budget)
              );
            });
          });

          Promise.allSettled(reqs).then((results) => {
            houseTypeStore.setLoading(false); // 释放请求锁
            results.forEach((result, index) => {
              if (result.status === "fulfilled") {
                const data = JSON.parse(result.value.data.data);
                data.appliance.keyword = data.keyword;
                const appliance = data.appliance;
                houseTypeStore.setRoomAppliance(roomIndexList[index], applianceIndexList[index], appliance);
              } else {
                console.error("请求失败", result);
              }
            });
          });
        });
        break;
      }
      case BroadcastChannel.SAVE_HOUSE_TYPE_ROOM: {
        const houseTypeStore = houseType();
        const loadedRecommend = houseTypeStore.loadedRecommend;
        if (!loadedRecommend) {
          return;
        }
        const dcloudHouseTypeService =
          ApplicationContext.current.serviceFactory.default.resolve<DcloudHouseTypeService>(DcloudHouseTypeService);
        dcloudHouseTypeService.saveHouseTypeRooms();
        break;
      }
      default: {
        break;
      }
    }
  }
}
