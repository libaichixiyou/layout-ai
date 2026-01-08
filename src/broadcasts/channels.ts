/**
 * 广播通道
 */
export default class BroadcastChannel {
  /**
   * 更新房型电器列表信息
   */
  public static readonly UPDATE_HOUSE_TYPE_ROOM = "channel://house-type/rooms/update";

  /**
   * 保存房型电器列表信息
   */
  public static readonly SAVE_HOUSE_TYPE_ROOM = "channel://house-type/rooms/save";
}
