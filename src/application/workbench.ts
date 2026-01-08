import {ApplicationContextBase, WorkbenchBase, BroadcastManager} from "uxmid-core";
import ApplicationContext from "./context";

import Workspace from "./workspace";
import {CozeApiService} from "@/services";

export default class Workbench extends WorkbenchBase {
  private _workspace!: Workspace;

  /**
   * 获取工作空间实例
   * @public
   * @getter
   * @property
   * @return {Workspace} 工作空间实例
   */
  public get workspace(): Workspace {
    return this._workspace;
  }

  /**
   * 初始化工作台新实例
   * @public
   * @param context 应用上下文
   */
  public constructor(context: ApplicationContextBase) {
    super(context);
  }

  /**
   * 当工作台打开时
   * @protected
   * @async
   * @param args
   */
  protected async onOpen(args: Array<string>): Promise<void> {
    const context = this.applicationContext as ApplicationContext;

    await this.initToken(context);

    this._workspace = this.createWorkspace(context);
  }

  /**
   * 创建工作空间
   * @protected
   * @param context
   * @return {Workspace}
   */
  protected createWorkspace(context: ApplicationContext): Workspace {
    return new Workspace(this, context);
  }

  /**
   * 初始化coze的token
   * @protected
   * @async
   * @param context
   * @returns
   */
  protected async initToken(context: ApplicationContext) {
    let userId: string = "";
    let credentialId: string = "czs_h3lKXp68Zu111I9QRoHozNw8atYhlJKCEHkRpnC8INTORvve1UFFA4CKkeKSCrONI";
    let expires: Date | undefined = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (context.credential) {
      if (context.credential.expires) {
        const expiresTime = new Date(context.credential.expires + "").getTime();
        const nowTime = new Date().getTime();
        if (expiresTime > nowTime) {
          console.log("token未过期，继续使用旧token");
          return;
        }
      }

      if (context.credential.userId) {
        userId = context.credential.userId;
      } else {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
        userId = uniqueId;
      }
    } else {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
      userId = uniqueId;
    }

    // const cozeApiService = context.serviceFactory.default.resolve<CozeApiService>(CozeApiService);
    // const res = await cozeApiService.getAccessToken(userId);
    // if (res.status === 200) {
    //   credentialId = String(res.data.data.accessToken);
    //   expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    // }

    context.credential = {
      userId: userId,
      credentialId: credentialId,
      expires: expires
    };
  }
}
