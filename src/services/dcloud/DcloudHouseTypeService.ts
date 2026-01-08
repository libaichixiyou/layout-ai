import {Injectable} from "uxmid-core";
import Axios from "axios";
import BaseService from "../BaseService";
import {houseType} from "@/stores/house-type";
import crypto from "crypto-js";

@Injectable()
export default class DcloudHouseTypeService extends BaseService {
  public async saveHouseTypeRooms() {
    const houseTypeStore = houseType();
    const rooms = houseTypeStore.rooms;
    const themeTitle = houseTypeStore.themeTitle;
    const themeSubtitle = houseTypeStore.themeSubtitle;
    const summary = houseTypeStore.summary;
    const obj = {rooms, themeTitle, themeSubtitle, summary};
    const savePayload = JSON.stringify(obj);
    const prompt = houseTypeStore.prompt;
    const imageData = houseTypeStore.houseTypeImage;
    const id = crypto.MD5(savePayload).toString();
    const userId = this.applicationContext.credential.userId;
    // Open or create the IndexedDB database
    const dbName = "houseTypeDB";
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // Create an object store if it doesn't exist
      if (!db.objectStoreNames.contains("houseTypes")) {
        db.createObjectStore("houseTypes", {keyPath: "id"});
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["houseTypes"], "readwrite");
      const store = transaction.objectStore("houseTypes");

      // 先检查记录是否存在
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const existingRecord = getRequest.result;
        if (existingRecord && existingRecord.userId === userId) {
          console.log("Record already exists for this user");
          return;
        }

        // Create the record to store
        const record = {
          id,
          userId,
          themeTitle,
          themeSubtitle,
          summary,
          prompt,
          imageData,
          rooms: JSON.stringify(rooms),
          timestamp: new Date().getTime()
        };

        // Store the data
        const storeRequest = store.put(record);

        storeRequest.onsuccess = () => {
          console.log("House type data stored successfully in IndexedDB");
        };

        storeRequest.onerror = (error) => {
          console.error("Error storing house type data in IndexedDB:", error);
        };
      };

      getRequest.onerror = (error) => {
        console.error("Error checking existing record:", error);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
    };
  }

  public async getHouseTypeRoomsHistory(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const userId = this.applicationContext.credential.userId;
      const dbName = "houseTypeDB";
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("houseTypes")) {
          db.createObjectStore("houseTypes", {keyPath: "id"});
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(["houseTypes"], "readonly");
        const store = transaction.objectStore("houseTypes");
        const results: any[] = [];

        store.openCursor().onsuccess = (e) => {
          const cursor = (e.target as IDBRequest).result;
          if (cursor) {
            if (cursor.value.userId === userId) {
              // Parse stored rooms back to object
              const record = {...cursor.value};
              record.rooms = JSON.parse(record.rooms);
              results.push(record);
            }
            cursor.continue();
          } else {
            // Sort by timestamp in descending order (newest first)
            results.sort((a, b) => b.timestamp - a.timestamp);
            resolve(results);
          }
        };

        transaction.oncomplete = () => {
          db.close();
        };
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }
}
