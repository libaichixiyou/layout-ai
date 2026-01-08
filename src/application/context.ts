import {ApplicationContextBase, type IEventProvider, type IWorkbench} from "uxmid-core";

import Workbench from "./workbench";

export default class ApplicationContext extends ApplicationContextBase {
  /**
   * 单例化上下文
   * @static
   * @readonly
   * @return {ApplicationContext}
   */
  public static readonly current: ApplicationContext = new ApplicationContext();

  /**
   * 事件提供者
   */
  public defaultEvent!: IEventProvider;

  /**
   * 私有构造函数避免多次实例化
   * @constructor
   */
  protected constructor() {
    super("ogeve");
  }

  /**
   * 创建工作台
   * @param args
   * @returns
   */

  protected createWorkbench(args: Array<string>): IWorkbench {
    return new Workbench(this);
  }
}
