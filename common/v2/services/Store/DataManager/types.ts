export interface IDataCache {
  [identifier: string]: {
    [entry: string]: any;
  };
}

export interface DataEntry {
  [key: string]: any;
}
