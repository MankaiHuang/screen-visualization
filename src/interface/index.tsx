export interface IAllNodeConfig {
  component: object;
  dataHandler: object;
  interActive: object;
  judge: object;
}
export interface INodeData {
  edges: object;
  nodes: object;
}
export interface IBluePrintConfig {
  nodeData: INodeData;
  exportIdList: object;
  allNodeConfig: IAllNodeConfig;
}
export interface IZoomModeOption {
  label: string;
  value: string;
}
export interface IZoomMode {
  default: string;
  option: IZoomModeOption;
}
export interface IExtend {
  background: string;
  bluePrintConfig: IBluePrintConfig;
  data: Array<object>;
  height: number;
  templateId: number;
  width: number;
  window: number[];
  zoomMode: IZoomMode;
  preview: string;
  previewId: Number;
}
export interface ITemplateList {
  backgroundId: number;
  componentList: Array<any>;
  createTime: string;
  extend: IExtend;
  id: number;
  name: string;
  preview: string;
  previewId: number;
  source: number;
  type: number;
  site?:string
}
export interface IProperty {
  SSEDataConversionFunction: string;
  SSEDataPath: Array<string>;
  SSEResponseData: object;
  animate: object;
  background: string;
  backgroundColor: string;
  componentsType: string;
  dataBindType: object;
  dataConversionFunction: string
  dataIsAdd: string;
  dataMaxLength: number
  dataOrigin: object;
  dataOriginConfig: string;
  dataPath: object;
  debug: string;
  elementId: string;
  excelData: object;
  excelUpload: object;
  height: number;
  isOpenAdvanced: boolean;
  left: number;
  method: object;
  option: object;
  params: string;
  refresh: number;
  responseData: object;
  rotate: number;
  secondType: string;
  shareList: object;
  staticJson: object;
  title: string;
  top: number;
  type: string;
  typeName: string;
  url: string;
  width: number;
  zIndex: number;
}
