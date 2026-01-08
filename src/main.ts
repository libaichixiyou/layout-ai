import {Application} from "uxmid-core";
import ApplicationContext from "./application/context";

// 获取应用上下文
const context = ApplicationContext.current;

// 启动应用程序
Application.start(context);
