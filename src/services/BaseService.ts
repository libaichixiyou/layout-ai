import ApplicationContext from "@/application/context";

export default class BaseService {
  protected get applicationContext() {
    return ApplicationContext.current;
  }

  protected get cozeAccessToken(): string {
    return this.applicationContext.credential.credentialId;
  }
}
