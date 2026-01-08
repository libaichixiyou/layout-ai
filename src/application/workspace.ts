import type {IWorkbench} from "uxmid-core";
import {EventProviderFactory} from "uxmid-core";
import {createApp} from "vue";
import {createPinia} from "pinia";
import {ConfigProvider} from "vant";
import * as Sentry from "@sentry/vue";

import "@/assets/main.css";
import "vant/lib/index.css";

import App from "@/App.vue";
import router from "@/router";

import ApplicationContext from "./context";
import "@/services";

export default class Workspace {
  private _workbench!: IWorkbench;

  /**
   * 工作空间构造函数
   * @param workbench
   * @param context
   */
  public constructor(workbench: IWorkbench, context: ApplicationContext) {
    this._workbench = workbench;

    const app = createApp(App);

    Sentry.init({
      app,
      dsn: "https://d0e571decaf4f7fb32a976f33edcf1e8@sentry.deepfish.win/2"
    });

    app.use(createPinia());
    app.use(router);
    app.use(ConfigProvider);

    app.mount("#app");

    context.defaultEvent = EventProviderFactory.instance.getProvider("default");
  }
}
