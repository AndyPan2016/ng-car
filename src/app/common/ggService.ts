//////////////////////////////////
/**
 * 核心
 */
export interface IShellAndCore {
    /**
     * 梁
     */
    IfcBeams: string[];
    /**
     * 柱
     */
    IfcColumn: string[];
    /**
     * 烟囱
     */
    IfcChimney: string[];
    /**
     * 坡道
     */
    IfcRamp: string[];
    /**
     * 楼梯
     */
    IfcStair: string[];
    /**
     * 屋顶
     */
    IfcRoof: string[];
    /**
     * 板
     */
    IfcSlab: string[];
    /**
     * 墙
     */
    IfcWall: string[]
}
/**
 * 终饰
 */
export interface IFinishing {
    /**
     * 覆盖面
     */
    IfcCovering: string[];
    /**
     * 栏杆、扶手
     */
    IfcRailing: string[];
    /**
     * 遮阳设备
     */
    IfcShadingDevice: string[];
}
/**
 * 开窗式
 */
export interface IFenestration {
    /**
     * 幕墙
     */
    IfcCurtainWall: string[];
    /**
     * 门
     */
    IfcDoor: string[];
    /**
     * 窗
     */
    IfcWindow: string[];
}
/**
 * 家具装饰
 */
export interface IFurnishing {
    /**
     * 家具
     */
    IfcFurniture: string[];
    /**
     * 系统家具单元
     */
    IfcSystemFurnitureElement: string[];
}
/**
 * 建筑
 */
export interface IArchitectural {
    /**
     * 核心
     */
    ShellAndCore: IShellAndCore;
    /**
     * 终饰
     */
    Finishing: IFinishing;
    /**
     * 开窗式
     */
    Fenestration: IFenestration;
    /**
     * 家具装饰
     */
    Furnishing: IFurnishing;
}
///////////////////////////////
//////////////////////////////
/**
 * 钢筋
 */
export interface IReinforcement {
    /**
     * 钢筋
     */
    IfcReinforcingBar: string[];
    /**
     * 钢筋网
     */
    IfcReinforcingMesh: string[];
    /**
     * 钢丝束锚具
     */
    IfcTendonAnchor: string[];
    /**
     * 钢丝束
     */
    IfcTendon: string[]
}
/**
 * 扣件配件
 */
export interface IFastenersAndAccessories {
    /**
     * 扣件、紧固件
     */
    IfcFastener: string[];
    /**
     * 机械紧固件
     */
    IfcMechanicalFastener: string[];
    /**
     * 建筑元素
     */
    IfcBuildingElementPart: string[];
    /**
     * 离散配件
     */
    IfcDiscreteAccessory: string[];
}
/**
 * 基础
 */
export interface IFoundation {
    /**
     * 基脚
     */
    IfcFooting: string[];
    /**
     * 桩
     */
    IfcPile: string[];
}
/**
 * 框架结构
 */
export interface IFrameStructure {
    /**
     * 构件
     */
    IfcMember: string[];
    /**
     * 板
     */
    IfcPlate: string[];
}
/**
 * 结构
 */
export interface IStructural {
    /**
     * 钢筋
     */
    Reinforcement: IReinforcement;
    /**
     * 扣件和配件
     */
    FastenersAndAccessories: IFastenersAndAccessories;
    /**
     * 基础
     */
    Foundation: IFoundation;
    /**
     * 框架结构
     */
    FrameStructure: IFrameStructure;
}
///////////////////////////////
///////////////////////////////
/**
 * 其他
 */
export interface IOthers {
    /**
     * 建筑元素代理
     */
    IfcBuildingElementProxy: string[];
    /**
     * 土木相关元素
     */
    IfcCivilElement: string[];
    /**
     * 检测分发系统及其元素
     */
    IfcDistributionChamberElement: string[];
    /**
     * 聚合元素
     */
    IfcElementAssembly: string[]
    /**
     * 地理相关元素
     */
    IfcGeographicElement: string[];
    /**
     * 运输相关元素
     */
    IfcTransportElement: string[]
    /**
     * 未知元素
     */
    IfcUnknown: string[]
}
//////////////////////////////
/////////////////////////////
/**
 * 建筑服务
 */
export interface IBuildingServices {s
    /**
     * 通用
    */
    General: IGeneral;
    /**
     * 冷热系统
    */
    HeatingCooling: IHeatingCooling;
    /**
     * 水暖防火
    */
    PlumbingFireProtection: IPlumbingFireProtection;
    /**
     * 通风
    */
    Ventilation: IVentilation;
    /**
     * 空调
    */
    AirConditioning: IAirConditioning;
    /**
     * 电气
    */
    Electrical: IElectrical;
    /**
     * 连通
    */
    Connectivity: IConnectivity;
    /**
     * 建筑自动化
    */
    BuildingAutomation: IBuildingAutomation;
}
/**
 * 通用
 */
export interface IGeneral {
    /**
     * 发动机
     */
    IfcEngine: string[];
    /**
     * 单一设备
     */
    IfcUnitaryEquipment: string[];
    /**
     * 流量计
     */
    IfcFlowMeter: string[];
    /**
     * 过滤器
     */
    IfcFilter: string[];
    /**
     * 医疗设备
     */
    IfcMedicalDevice: string[];
}
/**
 * 冷热系统
 */
export interface IHeatingCooling {
    /**
     * 锅炉
     */
    IfcBoiler: string[];
    /**
     * 烧嘴
     */
    IfcBurner: string[];
    /**
     * 盘管
     */
    IfcCoil: string[];
    /**
     * 局部供热装置
     */
    IfcSpaceHeater: string[];
    /**
     * 管束
     */
    IfcTubeBundle: string[];
    /**
     * 泵
     */
    IfcPump: string[];
    /**
     * 阀
     */
    IfcValve: string[];
}
/**
 * 水暖防火
 */
export interface IPlumbingFireProtection {
    /**
     * 管道段
     */
    IfcPipeSegment: string[];
    /**
     * 管接头
     */
    IfcPipeFitting: string[];
    /**
     * 灭火器
     */
    IfcFireSuppressionTerminal: string[];
    /**
     * 截污器
     */
    IfcInterceptor: string[];
    /**
     * 卫生终端
     */
    IfcSanitaryTerminal: string[];
    /**
     * 堆积终端
     */
    IfcStackTerminal: string[];
    /**
     * 罐
     */
    IfcTank: string[];
    /**
     * 废物终端
     */
    IfcWasteTerminal: string[];
    /**
     * 流体管道段
     */
    IfcFlowSegment: string[];
    /**
     * 流体管接口
     */
    IfcFlowFitting: string[];
    /**
     * 流体控制器
     */
    IfcFlowController: string[];
}
/**
 * 通风
 */
export interface IVentilation {
    /**
     * 空气接线盒
     */
    IfcAirTerminalBox: string[];
    /**
     * 阻尼器
     */
    IfcDamper: string[];
    /**
     * 管道消音器
    */
    IfcDuctSilencer: string[];
    /**
     * 空气终端
    */
    IfcAirTerminal: string[]
    /**
     * 风扇
    */
    IfcFan: string[];
    /**
     * 风管段
    */
    IfcDuctSegment: string[];
    /**
     * 风管接头
    */
    IfcDuctFitting: string[];
}
/**
 * 空调
 */
export interface IAirConditioning {
    /**
     * 空气 - 空气热回收装置
    */
    IfcAirToAirHeatRecovery: string[];
    /**
     * 冷却器
    */
    IfcChiller: string[];
    /**
     * 冷凝器
    */
    IfcCondenser: string[];
    /**
     * 冷却梁
    */
    IfcCooledBeam: string[];
    /**
     * 冷却塔
    */
    IfcCoolingTower: string[];
    /**
     * 蒸发冷却器
    */
    IfcEvaporativeCooler: string[];
    /**
     * 蒸发器
    */
    IfcEvaporator: string[];
    /**
     * 热交换器
    */
    IfcHeatExchanger: string[];
    /**
     * 加湿器
    */
    IfcHumidifier: string[];
    /**
     * 压缩机
    */
    IfcCompressor: string[];
}
/**
 * 电气
 */
export interface IElectrical {
    /**
     * 发电机
    */
    IfcElectricGenerator: string[];
    /**
     * 电动机
    */
    IfcElectricMotor: string[];
    /**
     * 电动机查接线
    */
    IfcMotorConnection: string[];
    /**
     * 太阳能装置
    */
    IfcSolarDevice: string[];
    /**
     * 变压器
    */
    IfcTransformer: string[];
    /**
     * 配电板
    */
    IfcElectricDistributionBoard: string[];
    /**
     * 电子时间控制
    */
    IfcElectricTimeControl: string[];
    /**
     * 保护装置
    */
    IfcProtectiveDevice: string[];
    /**
     * 开关
    */
    IfcSwitchingDevice: string[];
    /**
     * 电缆载体配件
    */
    IfcCableCarrierFitting: string[];
    /**
     * 电缆配件
    */
    IfcCableFitting: string[];
    /**
     * 接线盒
    */
    IfcJunctionBox: string[];
    /**
     * 电缆载体段
    */
    IfcCableCarrierSegment: string[];
    /**
     * 电缆段
    */  
    IfcCableSegment: string[];
    /**
     * 蓄电装置
    */
    IfcElectricStorageDevice: string[];
    /**
     * 视听设备
    */
    IfcAudioVisualAppliance: string[];
    /**
     * 通讯设备
    */
    IfcCommunicationAppliance: string[];
    /**
     * 电器
    */
    IfcElectricAppliance: string[];
    /**
     * 灯
    */
    IfcLamp: string[];
    /**
     * 灯具
    */
    IfcLightFixture: string[];
}
/**
 * 连通
 */
export interface IConnectivity {
    /**
     * 分配端口
     */
    IfcDistributionPort: string[];
}
/**
 * 建筑自动化
 */
export interface IBuildingAutomation {
    /**
     * 驱动器
    */
    IfcActuator : string[];
    /**
     * 警报
    */
    IfcAlarm : string[];
    /**
     * 控制器
    */
    IfcController : string[];
    /**
     * 流量计
    */
    IfcFlowInstrument : string[];
    /**
     * 跳闸保护装置
    */
    IfcProtectiveDeviceTrippingUnit : string[];
    /**
     * 传感器
    */
    IfcSensor : string[];
    /**
     * 单一控制单元
    */
    IfcUnitaryControlElement : string[];
}
////////////////////////////////////
/**
 * 模型元素
 */
export interface IIfcModelElements {
    /**
     * 建筑
     */
    Architectural: IArchitectural;
    /**
     * 结构
     */
    Structural: IStructural;
    /**
     * 建筑服务
     */
    BuildingServices: IBuildingServices;
    /**
     * 其它
     */
    Others: IOthers;
}

export interface IMajor {}

export interface ISubMajor {}

export interface ICategory {}

export interface ISpatialStructure {
    ID: number;
    Name: string;
    Type: string;
    Elevation: number;
    ElementCount: number;
    Children: ISpatialStructure[];

    modelElements: IIfcModelElements;
}
