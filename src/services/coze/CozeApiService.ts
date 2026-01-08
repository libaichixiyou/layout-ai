import {Injectable} from "uxmid-core";
import Axios from "axios";
import BaseService from "../BaseService";

@Injectable()
export default class CozeApiService extends BaseService {
  public async fileUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await Axios.post("https://api.coze.cn/v1/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + this.cozeAccessToken
        }
      });
      return res;
    } catch (err: any) {
      console.log(err);
      let errMsg = "服务器异常，请联系管理员";
      switch (err.response.data.code) {
        case 700012006: {
          errMsg = "验证已过期，请重新获取Access Token";
          break;
        }
        default: {
          break;
        }
      }
      throw new Error(errMsg);
    }
  }

  public async workflowRun(workflowId: string, parameters: any) {
    const res = await Axios.post(
      "https://api.coze.cn/v1/workflow/run",
      {
        workflow_id: workflowId,
        parameters: parameters
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.cozeAccessToken
        }
      }
    );
  }

  public async getAccessToken(userId?: string) {
    const res = await Axios.post(
      "获取扣子token",
      {
        account: userId || this.applicationContext.credential.userId
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return res;
  }
}
