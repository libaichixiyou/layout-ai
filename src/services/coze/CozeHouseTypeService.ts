import {Injectable} from "uxmid-core";
import Axios from "axios";
import BaseService from "../BaseService";
import {houseType} from "@/stores/house-type";

import recomandJson from "@mock/recomand.json";

@Injectable()
export default class CozeHouseTypeService extends BaseService {
  public async identifyHouseTypeImage(fileId: string | number): Promise<void> {
    const res = await Axios.post(
      "https://api.coze.cn/v1/workflow/run",
      {
        workflow_id: "7546151269870764047",
        parameters: {
          houseTypeImage: {
            file_id: fileId
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.cozeAccessToken
        }
      }
    );
    const houseTypeStore = houseType();
    houseTypeStore.setRooms(JSON.parse(res.data.data).rooms);
    houseTypeStore.setLoadedRecommend(false);
  }

  public async getHouseTypeRecommandAppliances(
    prompt: string,
    rooms: Array<{
      name: string;
      area: number;
    }>
  ): Promise<void> {
    const res = await Axios.post(
      "https://api.coze.cn/v1/workflow/run",
      {
        workflow_id: "7546151206843301928",
        parameters: {
          prompt: prompt,
          rooms
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.cozeAccessToken
        }
      }
    );
    const houseTypeStore = houseType();
    const data = JSON.parse(res.data.data);
    houseTypeStore.setRooms(data.rooms);
    houseTypeStore.setThemeTitle(data.themeTitle);
    houseTypeStore.setThemeSubtitle(data.themeSubtitle);
    houseTypeStore.setSummary(data.summary);
  }

  public async getTargetAppliance(name: string, area: number, prompt: string, keyword: string, budget: number) {
    const res = await Axios.post(
      "https://api.coze.cn/v1/workflow/run",
      {
        workflow_id: "7546152264965750799",
        parameters: {
          prompt: prompt,
          keyword,
          name,
          area,
          budget
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.cozeAccessToken
        }
      }
    );
    return res;
  }
}
