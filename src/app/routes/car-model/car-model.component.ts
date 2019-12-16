import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NzModalService, NzMessageService,
  NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions
} from 'ng-zorro-antd';
import { OAuthService } from 'angular-oauth2-oidc';

import { FileHelper } from '../../common/helper/file-helper';
import { Utils, Lang, Status, Task } from '../../common/helper/util-helper';
import { CustomFormsComponent } from '../../components/custom-forms/custom-forms.component';
import { CustomDragComponent } from '../../components/custom-drag/custom-drag.component';
import { CarModelService } from '../../services/car-model/car-model.service';
import { CustomPageOperationComponent } from '../../components/custom-page-operation/custom-page-operation.component';


declare var Neon: any;
declare var CryptoJS: any;

@Component({
  selector: 'app-car-model',
  templateUrl: './car-model.component.html',
  styleUrls: ['./car-model.component.scss']
})

export class CarModelComponent extends CustomPageOperationComponent implements OnInit {
  @ViewChild('treeCom') public treeCom;
  @ViewChild('treeComAttr') public treeComAttr;
  @ViewChild('customForms') public customForms: CustomFormsComponent;
  @ViewChild('customFormsAttr') public customFormsAttr: CustomFormsComponent;
  @ViewChild('customDrag') public customDrag;
  @ViewChild('previewFrame') public previewFrame;

  public status = {
    // 模型地址
    modelPath: null, isShowModelUpload: false,
    // 分页对象
    pager: {
      // 当前页
      pageIndex: 1,
      // 每页显示记录数
      pageSize: 10,
      // 总记录数
      pageCountAll: 0
    },
    // 任务加载中
    taskLoading: '任务加载中...',
    // 任务加载完成
    taskLoaded: false,
    // 面板状态(key与rightMenu关联)
    panelStatus: {
      'icon-car': false, 'icon-chassis': false, 'icon-power': false
    },
    panelStatus1: false, panelStatus2: true, addModalStatus: false,
    attrModelStatus: false,
    // 编辑、添加属性弹窗标题
    attrModalTitle: '添加',
    // 编辑信息('active'.打开信息编辑面板)
    editInfo: null,
    // 默认展开项的key集合
    defaultExpandedKeys: [],
    // 默认选中项的key集合
    defaultCheckedKeys: [],
    // 默认选择项的key集合
    defaultSelectedKeys: [],
    menus: [
      // {text: '尺寸信息', active: true},
      // {text: '质量信息', active: false},
      // {text: '材料信息', active: false},
      // {text: '模态/刚度信息', active: false},
      // {text: '连接信息', active: false},
      // {text: '部件数信息', active: false},
      // {text: '轻量化评价信息', active: false},
      // {text: '制造信息', active: false},
      // {text: '应用情况', active: false}
    ],
    modelTools: [
      [
        { icon: 'icon-home', key: 'home', isActive: false, title: '还原', isAllowActive: false },
        { icon: 'icon-drag', key: 'pan', isActive: false, title: '移动' },
        { icon: 'icon-show', key: 'hidden', isActive: false, title: '隐藏' },
        { icon: 'icon-enlarge', key: 'magnify', isActive: false, title: '放大', isAllowActive: false },
        // {icon: 'icon-narrow', key: 'shrink', isActive: false, title: '缩小', isAllowActive: false },
        { icon: 'icon-clear', key: 'measure', isActive: false, title: '测距' },
        { icon: 'icon-stereoscopic', key: 'peel', isActive: false, title: '剥离', isAllowActive: false },
        { icon: 'icon-count', key: 'amplifier', isActive: false, title: '框选聚焦' },
        { icon: 'icon-select', key: 'region', isActive: false, title: '框选' },
        { icon: 'icon-unknown1', key: 'focus', isActive: false, title: '聚焦放大' },
        // {icon: 'icon-unknown2', key: 'partition', isActive: false, title: '部分' },
        // {icon: 'icon-reset', key: 'back', isActive: false, title: '撤销', isAllowActive: false }
      ],
      [
        { icon: 'icon-link', key: 'bind', title: '绑定', isActive: false, isAllowActive: false, method: false },
        { icon: 'icon-unlink', key: 'unbind', title: '解绑', isActive: false, isAllowActive: false, method: false },
        // {icon: '', type: 'plus', key: 'appendBind', isActive: false, title: '追加绑定' },
        // {icon: '', type: 'check', key: 'bind', isActive: false, title: '确定追加绑定' },
        // {icon: 'icon-unknown2', key: 'partition', isActive: false, title: '部分' }
      ]
    ],
    // 当前勾选的项
    peelAry: [],
    // 当前所有属性
    modelPropertys: {},
    selector: null,
    currentTool: null,
    // 绑定或解绑的数据(需要一个tree的节点和模型的一个构件)
    bindData: { tree: null, treeNode: [], element: null },
    propertyObjs: {
    },
    propertyArys: [],
    // 当前展开项
    currentProperty: null,
    // 左边菜单
    leftMenus: [
      { text: '车身', icon: 'icon-car', isActive: false, type: 'carbody' },
      { text: '底盘', icon: 'icon-chassis', isActive: false, type: 'chassis' }
      // {text: '动力', icon: 'icon-power', isActive: false}
    ],
    // 当前leftmenus选中项
    leftMenusActive: null,
    // 当前选中的uuid
    uuid: null,
    // 是否是属性
    // isAttr: false,
    // 新增属性
    newPropertyModel: [
      { value: null, text: '名称', key: 'name', require: true, maxlength: 15 }
    ],
    // 添加、编辑属性信息
    attrModel: [
      { value: null, text: '数据名称', key: 'name', require: true },
      {
        value: null, text: '数据类型', type: 'select', key: 'type', require: true,
        options: [
          // { value: 1, text: '数值' }, { value: 2, text: '数值+文件' }
          { value: 1, text: '数值' }, { value: 3, text: '文本' }, { value: 2, text: '数值+文件' }
        ]
      }
    ],
    // 数值
    valueModel: [
      {
        value: 1, type: 'group', text: '数值', key: 'value', require: true, group: [
          { value: null, text: '值', key: 'itemValue', require: true },
          {
            value: null, text: '单位', type: 'select', key: 'itemUnit', require: true,
            options: Status.attributeUnit
          }
        ]
      }
    ],
    // 文本模型
    textModel: [
      { value: null, text: '文本', type: 'textarea', key: 'text', require: true, maxlength: 500, rowType: 'static' }
    ],
    // 上传文件模型
    uploadModel: [
      {
        value: null, type: 'upload-file-progress', text: '文件', key: 'uploadFile', require: true, isCreate: false,
        // 指定上传文件类型，和上传文件大小限制（单位：兆(M)）
        limitFileType: 'pdf', limitFileSize: 1000
      }
    ],
    // 编辑属性时首次打开属性的类型（1.数值 2.数值+文件 3.文本）
    thisAttrType: null,
    // 模型ID
    modelId: null,
    // 重新渲染编辑弹出框
    isResetRender: null,
    // 预览属性文件
    preview: {
      isVisible: false,
      title: null,
      data: null,
      width: 1000,
      height: 500,
      url: null
    },
    clearUUIDThread: null,
    // 模型目录搜索关键字
    modelDirectorysKerWord: null,
    nodes: [],
    // 树形所有数据
    treeNodeAll: null,
    // 已绑定的构件与数据
    bindModelIdList: null, bindModelTreeList: null,
    // 模型类型
    modelType: 'carbody',
    // 当前页面所需要的权限
    pagePermissions: [
      'Ele.ModelPropertys.Create',
      'Ele.ModelPropertys.Delete',
      'Ele.ModelPropertys.Edit'
    ],
    // 当前页面权限
    pageAuthorty: { Create: null, Delete: null, Edit: null }
  };
  public nodes: NzTreeNodeOptions[];
  // add 唐华波
  // 判断点击类型（-1.整车 0.车身 1.总成 2.零件）
  public type: number = 1;

  public constructor(
    private routeInfo: ActivatedRoute,
    private router: Router,
    private oauthService: OAuthService,
    private carmodelService: CarModelService,
    public message: NzMessageService,
    public mzModal: NzModalService,
    public loadService: CarModelService
  ) {
    super();
  }

  public ngOnInit() {
    // 初始化权限匹配
    this.status.pageAuthorty = this.grantedPermissions(this.status.pagePermissions, this.status.pageAuthorty);
    this.bindEvent();
    this.install();
    // this.fetchFlow();
  }

  /**
   * 拖拽开始
   * @param result
   */
  public dragBeginEvent(result) {
    let className = result.target.className;
    let eventResult;
    if (className != 'property-item-title' && className != 'j-drag-child') {
      // 阻止其他元素的拖拽效果，让指定元素可拖拽
      eventResult = { state: false };
    }
    else if (className == 'j-drag-child') {
      // 重新指定目标元素
      eventResult = { target: result.target.parentNode };
    }
    return eventResult;
  }

  /**
   * 拖拽移动
   * @param result
   */
  public dragMoveEvent(result) {
    let className = result.target.className;
    let eventResult;
    if (className == 'property-item-title') {
      // 返回目标元素
      eventResult = { target: result.target };
    }
    else if (className == 'j-drag-child') {
      // 重新指定目标元素
      eventResult = { target: result.target.parentNode };
    }
    return eventResult;
  }

  /**
   * 拖拽结束
   * @param result
   */
  public dragEndEvent(result) {
    let moveTarget = result.moveTarget;
    let dragTarget = result.dragTarget;
    let target = result.target;
    if (moveTarget && dragTarget) {
      let propertyArys = this.status.propertyArys;
      let moveDataId = moveTarget.parentNode.getAttribute('id');
      let updateDataId = dragTarget.parentNode.getAttribute('id');
      let directoryId;
      if (moveDataId != updateDataId) {
        let updateSort; let temp = []; let moveIdx; let updateIdx; let moveData; let updateData;
        Utils.forEach(propertyArys, (item, idx) => {
          if (item.id == moveDataId) {
            moveIdx = idx;
          }
          directoryId = item.directoryId;
        });

        let params = {
          sort: parseInt(moveIdx) + 1,
          directoryId,
          id: updateDataId
        };
        this.loadService.modifySort(params, this.type).then((res: any) => {
          if (res.success) {
            // 重新加载数据(清空原缓存的数据)
            this.status.propertyObjs = {};
            let modelPropertys = this.status.modelPropertys;
            let bindData = this.status.bindData;
            let selectNode = bindData.tree;
            if (selectNode && selectNode.key) {
              if (modelPropertys[selectNode.key]) {
                modelPropertys[selectNode.key] = undefined;
              }
            }
            // 重新加载
            this.queryModelPropertysPagedList();
          }
          else {
            this.message.error(Utils.errorMessageProcessor(res));
          }
        });
      }
    }
  }

  /**
   * 绑定事件
   */
  private bindEvent() {
    // 任务启动事件
    Task.onStart(() => {
      this.status.taskLoaded = false;
    });
    // 任务改变事件
    Task.onChange((res) => {
      let changeTask = res.changeTask;
      this.status.taskLoading = changeTask.remark + res.taskStatus[changeTask.status] + '(' + (res.taskCountAll - res.taskCount) + '/' + res.taskCountAll + ')'
    });
    // 如果其中任意一个任务失败(跳过)
    Task.onFail(task => {
      // 跳过
      Task.skip(task);
    });
    // 所有任务完成事件
    Task.onComplate(() => {
      this.status.taskLoaded = true;
    });
  }

  /**
   * 初始装载
   */
  private install() {
    this.status.modelId = this.routeInfo.snapshot.queryParams[Status.carModelId];
    // 获取模型
    this.getCarModel();
    // 整车目录数据加载
    this.queryModelDirectorysPagedList();
    // 获取整车属性
    this.type = -1;
    this.queryModelPropertysPagedList();
  }

  /**
   * 查看属性文件
   * @param data
   */
  private lookFile(data) {
    // console.info(data);
    let dataValue = data.value || {};
    let preview = this.status.preview;
    preview.data = dataValue;
    preview.title = dataValue.fileName;
    preview.url = dataValue.filePath;
    preview.isVisible = true;
    setTimeout(() => {
      this.previewFrame.nativeElement.setAttribute('src', dataValue.filePath + FileHelper.createPwd());
    }, 0);
  }

  /**
   * 获取模型
   */
  private getCarModel() {
    // Task.add('car-model', '模型');
    // let params = {Id: '00000000-0000-0000-0000-000000000000'};
    // this.carmodelService.getCarModel(params).then(res => {
    // Task.add('model', '模型');
    // Task.complate('car-model');
    this.status.modelPath = 'http://' + window.location.host + "/assets/car/";
    // 渲染模型
    this.modelRender(this.status.modelPath);
    // if(res.success){
    // this.status.isShowModelUpload = true;
    // }
    // else{}
    // });
  }

  /**
   * 模型渲染
   * @param path <string> 模型地址
   */
  private modelRender(path?: string) {
    let that = this;
    that.status.selector = Neon.getSelector();
    let selector = that.status.selector;
    that.status.selector.on('_OnPropertyChanged', function (event) {
      that.onPropertyChanged(event, event.target.uuid);
    });
    let host = 'http://' + window.location.host;
    let modelPath = (path || (host + "/assets/car/")) + that.status.modelType + '/';

    let modelContainer = document.getElementById('j-model-container');
    // 设置容器
    Neon.initialize({ "container": modelContainer });
    // 加载模型
    Neon.load(modelPath, {
      target: this,
      fn: (res) => {
        // 模型任务完成
        // Task.complate('model');
      }
    });
    // 每次点击容器，清空当前选中的构件uid
    modelContainer.onclick = (e) => {
      this.status.clearUUIDThread = setTimeout(() => {
        that.status.uuid = null;
        // 清空绑定或解绑所选中的模型构件
        that.status.bindData.element = null;
        that.status.defaultCheckedKeys = null;
        that.status.defaultExpandedKeys = null;
      }, 500);
    };

    // 重置导航矩形位置
    let canvas = document.getElementsByTagName('canvas');
    if (canvas[2]) {
      canvas[2].style.top = 'initial';
      canvas[2].style.right = '30px';
      canvas[2].style.bottom = '30px';
    }
  }

  /**
   * 左边菜单点击事件
   * @param menu <any> 当前按钮项
   */
  private lmenuClick(menu: any) {
    let status = this.status;
    let panelStatus = status.panelStatus;
    let leftMenus = status.leftMenus;
    let i = 0; let len = leftMenus.length; let item; let itemStatus;
    for (; i < len; i++) {
      item = leftMenus[i];
      itemStatus = item.icon == menu.icon;
      item.isActive = itemStatus;
      panelStatus[item.icon] = itemStatus;
      if (itemStatus) {
        // 保存当前active项，以item的icon做标识；在关键字搜索时，可以通过判断该标识来发起对不同数据的搜索
        status.leftMenusActive = item.icon;
      }
    }
    if (status.leftMenusActive == 'icon-car') {
      this.status.bindData.tree = { key: status.modelId };
      this.type = 0;
      this.queryModelPropertysPagedList();

      let modelType = menu.type;
      if (modelType && this.status.modelType != modelType) {
        this.status.modelType = modelType;
        this.install();
        // 重置
        this.status.bindData = { tree: null, treeNode: [], element: null };
      }
    }
    else {
      let modelType = menu.type;
      if (modelType && this.status.modelType != modelType) {
        this.status.modelType = modelType;
        this.status.panelStatus1 = false;
        Utils.forEach(this.status.panelStatus, (item, key) => {
          this.status.panelStatus[key] = false;
        });
        this.status.editInfo = '';
        this.modelRender();
      }
    }
  }

  /**
   * 模型选择
   * @param event
   * @param uid 当前选中构件ID
   */
  private onPropertyChanged(event, uid) {
    if (uid) {
      window.clearTimeout(this.status.clearUUIDThread);
      setTimeout(() => {
        if (this.status.uuid != uid) {
          // 等待清空上次的，再设置当前uid
          this.status.uuid = uid;
          // 保存绑定或解绑所选中的模型构件
          this.status.bindData.element = this.status.bindData.element || [];
          this.status.bindData.element.push(uid);
          /********** 取消选中模型构件对树形结构的勾选功能(2019年3月4日10:33:04 AndyPan) */
          // this.toCheckTreeNodeById(uid);
          let thisModelData = (this.status.bindModelIdList || {})[uid] || {};
          // 点击模型，设置当前类型为零件
          this.type = 2;
          if (thisModelData.id) {
            // this.status.panelStatus1 = true;
            this.queryModelPropertysPagedList([thisModelData.id]);
          }
          /********** 取消选中模型构件对树形结构的勾选功能(2019年3月4日10:33:04 AndyPan) */
        }
      }, 10);
      let propertyObjs = this.status.propertyObjs;
      let property = propertyObjs[uid];
      if (property) {
        // console.info(property);
        this.status.currentProperty = property;
      }
    }
  }

  /**
   * 通过ID选中构件树节点
   * @param uid <any> 需要选中节点的id
   */
  private toCheckTreeNodeById(uid: any, isLoadPropertys?: any) {
    let thisModelData;
    if (typeof (uid) == 'string') {
      thisModelData = (this.status.bindModelIdList || {})[uid];
    }
    else {
      thisModelData = uid;
    }
    if (thisModelData) {
      // 保存当前选中节点(这里获取到的数据与点击树获取到的数据结构不一样，不是一个NzTreeNode类型，所以必须是先勾选树，再选择模型)
      // this.status.bindData.tree = thisModelData;
      this.status.bindData.treeNode = [thisModelData];

      // 设置默认选中项key
      this.status.defaultCheckedKeys = [thisModelData.id];
      // 设置默认选择项key
      this.status.defaultSelectedKeys = [thisModelData.id];
      // 获取并展示选择项节点的属性
      this.status.bindData.tree = thisModelData;
      this.status.bindData['selectNode'] = thisModelData;
      this.queryModelPropertysPagedList([thisModelData.id]);
      // 展开当前选中的父级
      this.status.defaultExpandedKeys = [];
      let renderExpandedKeys = (modelData) => {
        let modelParentId = modelData.parentId;
        if (modelParentId != Lang.rootDirectoryId) {
          this.status.defaultExpandedKeys.push(modelParentId);
          // 判断是否还有上级
          let parentNode = this.status.treeNodeAll[modelParentId];
          if (parentNode) {
            // 继续展开父级
            renderExpandedKeys(parentNode);
          }
        }
      };
      renderExpandedKeys(thisModelData);

      // 选中模型
      let modelIdList = thisModelData.modelId;
      if (modelIdList) {
        modelIdList = eval('(' + modelIdList + ')');
        if (modelIdList) {
          this.status.peelAry = modelIdList;
          Neon.peel(modelIdList);
        }
      }
    }
  }

  /**
   * 搜索节点关键字，并选中
   */
  private searchEvent() {
    let keywords = this.operationStatus.filter;
    let treeNodeAll = this.status.treeNodeAll;
    let searchItem;
    Utils.forEach(treeNodeAll, (item) => {
      if (item.name == keywords) {
        searchItem = item;
        return 'break';
      }
    });

    if (searchItem) {
      // console.info(searchItem);
      // 设置当前搜索项的类型
      this.type = searchItem.type;
      this.toCheckTreeNodeById(searchItem);
    }
  }
  /**
   * 搜索框回车事件
   * @param e <Event>
   */
  public keyupEvent(e: Event) {
    Utils.enter(e, this.searchEvent.bind(this));
  }

  /**
   * 目录数据加载
   */
  public queryModelDirectorysPagedList() {
    let status = this.status;
    // 目录数据加载任务
    // Task.add('directory-data', '目录数据');
    let params = {
      // 每页记录数
      maxResultCount: 3000,
      // 当前页码
      skipCount: 0,
      // 模型ID(项目ID)
      ProjectId: this.status.modelId,
      // 关键字搜索
      keywords: this.status.modelDirectorysKerWord
    };
    this.carmodelService.queryModelDirectorysPagedList(params).then((res: any) => {
      // 如果是同一条线上的任务,一个任务结束才能开启另一个任务时，需先添加新任务，再结束已完成任务
      if (res.success) {
        let result = res.result;
        // 总记录数
        status.pager.pageCountAll = result.totalCount;

        // 用于保存所有节点对象，以节点id作为key，以便直接查找子节点
        let treeNodeAll = {}; let modelIdList = {};
        Utils.asyncEach(result.items, (dataItem) => {
          dataItem.isLeaf = true;
          dataItem.title = dataItem.name;
          dataItem.key = dataItem.id;
          treeNodeAll[dataItem.id] = dataItem;
          if (dataItem.modelId) {
            // 保存已绑定构件的数据，用于点击模型与构件数据交互
            let dataModelId = eval('(' + (dataItem.modelId) + ')') || [];
            Utils.forEach(dataModelId, (idItem) => {
              modelIdList[idItem] = dataItem;
            });
          }
        }, () => {
          this.status.treeNodeAll = treeNodeAll;
          // 保存已绑定构件的数据，用于点击模型与构件数据交互
          this.status.bindModelIdList = modelIdList;
          let nodes = Utils.renderTreeNode(treeNodeAll);
          if (!this.status.modelDirectorysKerWord) {
            this.status.nodes = nodes;
          }
          this.reckonStatistics(treeNodeAll);
          this.reckonStatisticsFirstDir(this.status.nodes);
          this.nodes = nodes;
        });
      }
      else {
        this.message.warning('目录数据加载失败');
      }
    });
  }

  /**
   * 计算统计绑定/未绑定数量
   */
  private reckonStatistics(nodes: any) {
    Utils.forEach(nodes, (item) => {
      let children = item.children || [];
      item['childrenCounts'] = (children ? children.length : 0);
      item['bindCounts'] = 0;
      Utils.forEach(children, (child) => {
        let childModelId = child.modelId;
        if (childModelId && childModelId != '[]') {
          // 如果已经绑定
          childModelId = eval('(' + (childModelId) + ')');
          item['bindCounts'] += 1; // childModelId.length;
          child['icon'] = 'paper-clip';
        }
      });
      if (item['childrenCounts'] && item['parentId'] != Lang.rootDirectoryId) {
        item.title = item.title + '(' + (item['bindCounts']) + '/' + (item['childrenCounts']) + ')';
      }
    });
  }

  private reckonStatisticsFirstDir(nodes: any) {
    let getChildBind = (childs, counts) => {
      let childNode = childs.children || [];
      counts['childrenCounts'] += childNode.length;
      Utils.forEach(childNode, (item) => {
        let childModelId = item.modelId;
        if (childModelId && childModelId != '[]') {
          // 如果已经绑定
          childModelId = eval('(' + (childModelId) + ')') || [];
          counts['bindCounts'] += 1;
        }
        getChildBind(item, counts);
      });
      return counts;
    };
    Utils.forEach(nodes, (item) => {
      let counts = { childrenCounts: 0, bindCounts: 0 };
      getChildBind(item, counts);
      if (counts['childrenCounts']) {
        item.title = item.title + '(' + (counts['bindCounts']) + '/' + (counts['childrenCounts']) + ')';
      }
    });

    return nodes;
  }

  public entryQueryDirectorys(e: any) {
    Utils.enter(e, () => {
      this.queryModelDirectorysPagedList();
    });
  }

  /**
   * 属性数据
   * @param directoryIdList 需要获取属性的目录ID集合
   */
  public queryModelPropertysPagedList(directoryIdList?: Array<string>) {
    if ((!directoryIdList || !directoryIdList.length || directoryIdList[0] === null)) {
      if (this.type == -1) {
        directoryIdList = ['first'];
      }
      else if (this.type == 0) {
        directoryIdList = [this.status.modelId];
      }
      else {
        let bindData = this.status.bindData;
        let selectNode = bindData.tree;
        if (selectNode) {
          directoryIdList = [selectNode.key];
        }
        else {
          return;
        }
      }
    }
    this.operationStatus.isLoading = true;

    // 缓存当前勾选的项
    // this.status.peelAry = directoryIdList;

    let status = this.status;
    // 查找是否已经存在缓存，如果存在，就不进行查询
    let modelPropertys = status.modelPropertys;
    let tempDirectoryIdList = [];
    directoryIdList.forEach((item: any) => {
      if (!modelPropertys[item]) {
        tempDirectoryIdList.push(item);
      }
    });
    if (tempDirectoryIdList.length) {
      // 属性数据加载任务
      let params = {
        // 目录ID
        directoryIdList: directoryIdList || [],
        // 每页记录数
        maxResultCount: 3000,
        // 当前页码
        skipCount: 0,
        ProjectId: this.status.modelId
      };
      this.carmodelService.queryModelPropertysPagedList(params, this.type).then((res: any) => {
        if (res.success) {
          let items = res.result.items || res.result;
          items.forEach((item) => {
            // 缓存数据
            if (this.type == -1 || this.type == 0) {
              let directoryId = directoryIdList[0];
              status.modelPropertys[directoryId] = status.modelPropertys[directoryId] || [];
              status.modelPropertys[directoryId].push(item);
            }
            else {
              let directoryId = item.directoryId;
              status.modelPropertys[directoryId] = status.modelPropertys[directoryId] || [];
              status.modelPropertys[directoryId].push(item);
            }
          });

          // 将获取到的属性数据组装成显示需要的对象
          this.renderModelPropertys(directoryIdList);
          // 渲染属性面板
          this.renderPropertysPanel();
          if (!items.length) {
            // 没有数据时隐藏
            this.status.propertyArys = [];
            if (this.type == -1) {
              this.status.panelStatus1 = true;
            }
          }
        }
        this.operationStatus.isLoading = false;
      });
    } else {
      // 渲染属性面板
      this.renderPropertysPanel();
      setTimeout(() => {
        this.operationStatus.isLoading = false;
      }, 10);
    }
  }

  /**
   * 将获取到的属性数据组装成显示需要的对象
   * @param directoryIdList Array<string> 当前选中的目录ID
   * @remark 最终组装输出对象this.status.propertyObjs：{ '左边选中项ID(便于直接查找)': [{'一级目录数据'..., data: [{text: '属性', value: '值'}]}] }
   */
  private renderModelPropertys(directoryIdList?: Array<string>) {
    directoryIdList = directoryIdList || this.status.peelAry;

    let modelPropertys = this.status.modelPropertys;
    let propertyObjs = this.status.propertyObjs;
    let i = 0, len = directoryIdList.length, directoryIdItem;
    for (; i < len; i++) {
      directoryIdItem = directoryIdList[i];
      // 查找当前选中项是否存在属性
      let directoryItems = modelPropertys[directoryIdItem];
      // console.info(directoryItems);
      if (directoryItems) {
        // 将属性的一级目录、属性和值分离出来
        let i = 0, len = directoryItems.length, directoryItem;
        let temp = {};
        for (; i < len; i++) {
          directoryItem = directoryItems[i];

          if (directoryItem.parentId == Lang.rootDirectoryId) {
            // 根目录（一级目录）
            if (temp[directoryItem.id]) {
              let tempData = temp[directoryItem.id].data;
              if (tempData) {
                if (directoryItem.data) {
                  tempData.forEach((item) => {
                    directoryItem.data.push(item);
                  });
                }
                else {
                  directoryItem.data = tempData;
                }
              }
            }
            else {
              temp[directoryItem.id] = directoryItem;
            }
            propertyObjs[directoryIdItem] = propertyObjs[directoryIdItem] || [];
            propertyObjs[directoryIdItem].push(directoryItem);
          }
          else {
            // 找到父级，添加data（属性和值分）
            if (!temp[directoryItem.parentId]) {
              temp[directoryItem.parentId] = {};
            }
            let parentItem = temp[directoryItem.parentId] || {};
            if (parentItem) {
              parentItem.data = parentItem.data || [];
              // parentItem.data.push({name: directoryItem.name, value: directoryItem.name});
              parentItem.data.push(directoryItem);
            }
          }
        }
      }
    }
    // console.info(this.status.propertyObjs);
  }

  /**
   * 渲染属性面板
   */
  private renderPropertysPanel(flag?) {
    let tree = this.type == -1 || this.type == 0 ? {key: this.type == -1 ? 'first' : this.status.modelId} : (this.status.bindData.tree || flag);
    if (tree) {
      let propertyObjs = this.status.propertyObjs;
      let propertyObj = propertyObjs[tree.key] || (tree.origin ? propertyObjs[tree.origin.projectId] : null) || propertyObjs['first'];
      if (propertyObj) {
        Utils.resetData(propertyObj, (item, idx) => {
          if (idx == 0) {
            // 默认第一个展开
            item.isActive = true;
            this.status.currentProperty = item;
          }
          else {
            item.isActive = false;
          }
          if (item.data) {
            Utils.resetData(item.data, (dataItem) => {
              if (dataItem.value) {
                if (typeof (dataItem.value) == 'string') {
                  dataItem.value = eval('(' + dataItem.value + ')');
                }
              }
            });
          }
        });
        // 当前显示的属性
        this.status.propertyArys = propertyObj;
        // 如果有数据就自动显示，没有就自动隐藏面板
        this.status.panelStatus1 = propertyObj.length ? true : false;
      }
      else {
        this.status.panelStatus1 = false;
      }
    }
  }

  /**
   * 底部工具栏点击事件
   * @param tool
   * @param i
   * @param j
   */
  private toolsItemClick(tool, i, j) {
    let selector = this.status.selector;
    let modelTools = this.status.modelTools;

    // 还原上一个
    let thisCurrentTool = this.status.currentTool;
    if (thisCurrentTool) {
      if (tool.key != thisCurrentTool.key) {
        thisCurrentTool.isActive = false;
        if (thisCurrentTool.method != false) {
          selector.setMethod(thisCurrentTool.key, false);
        }
      }
    }
    else {
      // modelTools[0][0].isActive = false;
      // selector.setMethod(modelTools[0][0].key, false);
    }

    // 选中当前
    let currentTool = modelTools[i][j];
    // 如果没有选中的构件，不做隐藏操作（不做key='hidden'的操作）
    // if(!this.status.uuid && currentTool.key == 'hidden'){ return; }
    this.status.currentTool = currentTool;
    let toolKey = currentTool.key;
    if (toolKey == 'bind' || toolKey == 'unbind') {
      // 绑定
      let bindData = this.status.bindData;
      let treeNode = bindData.treeNode; let element = bindData.element;
      if (((!treeNode || !treeNode.length) || !element) && toolKey == 'bind') {
        this.message.warning('请选择需要' + (toolKey == 'bind' ? '绑定' : '解绑') + '的数据');
      }
      else {
        if (treeNode.length > 1) {
          this.message.warning('绑定只能勾选一个');
          return;
        }
        let tree = treeNode[0];
        let isCount = !tree.origin.modelId ? true : false;
        let params = {
          "directoryId": tree.key,
          // 获取当前选中的模型构件ID集合
          "modelIdList": selector.get(),
          ProjectId: this.status.modelId
        };
        if (toolKey == 'bind') {
          this.carmodelService.bindComponent(params).then((res: any) => {
            if (res.success) {
              // 设置绑定的modelId到节点数据上
              tree.origin['modelId'] = element;
              let parentNodeOrigin = tree.parentNode.origin;
              if (parentNodeOrigin) {
                if (isCount) {
                  parentNodeOrigin['bindCounts'] += 1;
                }
                // 修改文本
                parentNodeOrigin['title'] = parentNodeOrigin['name'] + '(' + (parentNodeOrigin['bindCounts']) + '/' + (parentNodeOrigin['childrenCounts']) + ')';
                tree.parentNode['title'] = parentNodeOrigin['title'];
                // 向指定子集添加已绑定图标
                tree.origin['icon'] = 'paper-clip';
              }
              // console.info(element)
              this.message.success('绑定成功');
              Neon.peel(selector.get());
              // 刷新树
              // this.queryModelDirectorysPagedList();
            }
            else {
              this.message.warning(res.error.message);
            }
          });
        }
        else if (toolKey == 'unbind') {
          // params['modelId'] = element[0];
          let modelId = ((tree.origin || {}).modelId || []);
          modelId = typeof(modelId) == 'string' ? eval('(' + modelId + ')') : modelId;
          params['modelId'] = modelId;
          params['modelIdList'] = modelId;
          this.carmodelService.unBindComponent(params).then((res: any) => {
            if (res.success) {
              // 当前已绑定的所有节点的key
              let modelIdAry = this.getAllModelId([tree]);
              // 删除节点绑定的modelId数据
              tree.origin['modelId'] = null;
              let parentNodeOrigin = tree.parentNode.origin;
              if (parentNodeOrigin) {
                parentNodeOrigin['bindCounts'] -= 1;
                if(parentNodeOrigin['bindCounts'] < 1) parentNodeOrigin['bindCounts'] = 0;
                // 修改文本
                parentNodeOrigin['title'] = parentNodeOrigin['name'] + '(' + (parentNodeOrigin['bindCounts']) + '/' + (parentNodeOrigin['childrenCounts']) + ')';
                tree.parentNode['title'] = parentNodeOrigin['title'];
                // 向指定子集删除已绑定图标
                tree.origin['icon'] = null;
                // 取消数据勾选
                tree.origin['checked'] = false;
                tree['isChecked'] = false;
                tree['isAllChecked'] = false;
                // 清空勾选时保存的节点
                let tempBindNode = [];
                this.status.bindData.treeNode.forEach((item) => {
                  if (item.key != tree.key) {
                    tempBindNode.push(item);
                  }
                });
                this.status.bindData.treeNode = tempBindNode;

                // 删除当前取消勾选的项
                let temp = [];
                this.status.peelAry.forEach((item, idx) => {
                  let flag = false;
                  modelIdAry.forEach((idItem) => {
                    if (idItem == item) {
                      flag = true;
                    }
                  });
                  if (!flag) {
                    temp.push(item);
                  }
                });
                this.status.peelAry = temp;
              }
              // 回到模型主页
              this.status.selector.setMethod('home', false);
              this.message.success('解绑成功');
              // 刷新树
              // this.queryModelDirectorysPagedList();
            }
            else {
              this.message.warning(res.error.message);
            }
          });
        }
      }
    }
    else if (toolKey === 'appendBind' || toolKey === 'appendBindSure') {
      if (toolKey === 'appendBind') {
        selector.setMethod('home', true);
      }
    }
    else {
      if (currentTool.isActive) {
        currentTool.isActive = false;
        if (currentTool['method'] != false) {
          selector.setMethod(toolKey, false);
        }
      }
      else {
        // 是否允许选中
        if (currentTool.isAllowActive != false) {
          currentTool.isActive = true;
        }
        if (currentTool['method'] != false) {
          selector.setMethod(toolKey, true);
          // if (toolKey == 'home') {
          //   this.status.uuid = null;
          //   // 清空绑定或解绑所选中的模型构件
          //   this.status.bindData.element = null;
          //   this.status.defaultCheckedKeys = null;
          //   this.status.defaultExpandedKeys = null;
          // }
        }
      }
    }
  }

  /**
   * 获取当前选中构件的数据
   */
  private renderPropertys() {
    let peelAry = this.status.peelAry;
    let propertyObjs = this.status.propertyObjs;
    let i = 0, len = peelAry.length, item, property;
    let tempAry = [];
    for (; i < len; i++) {
      item = peelAry[i];
      property = propertyObjs[item];
      if (property) {
        property.isActive = false;
        tempAry.push(property);
      }
    }
    // 默认第一个展开
    if (tempAry.length) {
      tempAry[0].isActive = true;
      this.status.currentProperty = tempAry[0];
    }

    this.status.propertyArys = tempAry;
    // 如果有数据就自动显示，没有就自动隐藏面板
    this.status.panelStatus1 = tempAry.length ? true : false;
  }

  /**
   * 当前已绑定的所有节点的key
   * @param node
   */
  private getAllModelId(node) {
    let tempModelIdAry = [];
    let renderNode = (thisNode) => {
      thisNode.forEach((item) => {
        let modelId = item.origin.modelId;
        if (modelId) {
          let temp = typeof (modelId) == 'string' ? eval('(' + modelId + ')') : modelId;
          tempModelIdAry = tempModelIdAry.concat(temp);
          // tempModelIdAry.push(modelId);
        }
        // 检查是否存在子集
        let children = item.children;
        if (children && children.length) {
          renderNode(children);
        }
      });
    };
    renderNode(node);

    return tempModelIdAry;
  }

  /**
   * 树形菜单复选框选择事件，选中显示模型
   * @param event
   */
  private nzTreeCheck(event: NzFormatEmitEvent): void {
    let status = this.status;
    let node = event.node;
    let selector = this.status.selector;
    // console.info(node);
    // 当前已绑定的所有节点的key
    let modelIdAry = this.getAllModelId([node]);
    if (node.isChecked) {
      // 选中
      status.peelAry = status.peelAry.concat(modelIdAry);
      if (status.peelAry.length) {
        // console.info(status.peelAry);
        Neon.peel(status.peelAry);
      }
      // 保存当前选中节点
      this.status.bindData.tree = node;
      status.bindData.treeNode.push(node);
    }
    else {
      // 取消选中
      let peelAry = status.peelAry;
      // 删除当前取消勾选的项
      let temp = [];
      peelAry.forEach((item, idx) => {
        let flag = false;
        modelIdAry.forEach((idItem) => {
          if (idItem == item) {
            flag = true;
          }
        });
        if (!flag) {
          temp.push(item);
        }
      });
      status.peelAry = temp;

      let tempBindNode = [];
      status.bindData.treeNode.forEach((item) => {
        if (item.key != node.key) {
          tempBindNode.push(item);
        }
      });
      status.bindData.treeNode = tempBindNode;

      let tempElement = [];
      let modelIdList = (node.origin || {}).modelId || [];
      let itemFlag;
      (status.bindData.element || []).forEach((item) => {
        itemFlag = false;
        modelIdList.forEach((listItem) => {
          if (item == listItem) {
            itemFlag = true;
          }
        });
        if (!itemFlag) {
          tempElement.push(item);
        }
      });
      status.bindData.element = tempElement;
      // console.info(status.bindData.element);

      if (status.peelAry.length) {
        Neon.peel(status.peelAry);
      }
      else {
        // 清空当前选中节点
        this.status.bindData.tree = null;
        this.status.uuid = null;
        // 清空绑定或解绑所选中的模型构件
        this.status.bindData.element = null;
        this.status.defaultCheckedKeys = null;
        this.status.defaultExpandedKeys = null;
        selector.setMethod('home', true);
      }
    }
    // console.info(status.peelAry);
  }

  /**
   * 选择树节点，显示节点数据
   * @param event
   */
  private nzTreeClick(event: NzFormatEmitEvent): void {
    let status = this.status;
    let node = event.node;
    this.type = node.origin.type;
    if (node.isSelected) {
      this.status.bindData.tree = node;
      this.status.bindData['selectNode'] = node;
      this.queryModelPropertysPagedList([node.key]);
    }
    else {
      // 清空当前选中节点
      this.status.bindData.tree = null;
      this.status.bindData['selectNode'] = null;
      this.type = 0;
      this.queryModelPropertysPagedList();
    }
  }


  private openHandler(item, idx) {
    let propertyArys = this.status.propertyArys;
    let currentProperty = this.status.currentProperty || propertyArys[0];
    currentProperty.isActive = false;

    propertyArys[idx].isActive = true;
    this.status.currentProperty = propertyArys[idx];
  }

  private closePanelEvent(type) {
    this.status[type] = false;
    if (type == 'panelStatus2') {
      this.status.leftMenus[0].isActive = false;
    }
  }

  private closeStatusPanelEvent(type) {
    let panelStatus = this.status.panelStatus;
    panelStatus[type] = false;
    let leftMenus = this.status.leftMenus;
    Utils.resetData(leftMenus, (item) => {
      if (item.icon == type) {
        item.isActive = false;
        this.type = -1;
        this.queryModelPropertysPagedList();
        return 'break';
      }
    });
  }

  /**
   * 编辑信息(打开编辑框)
   * @param item
   */
  private editInfo(item) {
    if (item) {
      item['expanded'] = true;
    }
    this.status.editInfo = 'active';
  }

  /**
   * 关闭信息编辑
   * @param e
   */
  public closeInfoEdit(e) {
    this.status.editInfo = null;
  }

  /**
   * 删除属性单个属性对象
   * @param data 删除属性数据
   * @param idx 删除属性数据在当前目录集合中的索引
   */
  private deleteAttributeItem(parent, child, idx) {
    this.deleteOperation().submit(() => {
      let params = {
        id: child.id
      };
      // 类型type：-1.整车 0.车身 1.总成 2.零件
      this.loadService.removeModelProperty(params, this.type).then((res) => {
        if (res.success) {
          this.message.success(Lang.deleteSuccess);
          parent.data.splice(idx, 1);
        }
        else {
          this.message.error(Utils.errorMessageProcessor(res));
        }
      });
    });
  }

  /**
   * 删除属性目录
   */
  private deleteAttribute(delItem) {
    let propertyArys = this.status.propertyArys;
    let tempAry = [];

    this.deleteOperation(() => {
      Utils.resetData(propertyArys, (item) => {
        if (item.id != delItem.id) {
          // 不需要删除项
          tempAry.push(item);
        }
      });
    }).submit(() => {
      let params = {
        id: delItem.id
      };
      this.loadService.removeModelProperty(params, this.type).then(res => {
        if (res.success) {
          this.message.success(Lang.deleteSuccess);
          this.status.propertyArys = tempAry;
        }
        else {
          this.message.error(Utils.errorMessageProcessor(res));
        }
      });
    });
  }

  /**
   * 增加属性目录
   */
  public addAttributeDirectory() {
    let tree = this.status.bindData.tree;
    if (!tree && this.type != -1) {
      return;
    }
    let propertyAry = this.status.propertyArys;
    let sort = propertyAry ? (propertyAry.length ? (propertyAry[propertyAry.length - 1].sort + 1) : 1) : 1;

    this.operationOpenModal({
      operationModalTitle: '新增属性目录',
      infoModel: this.status.newPropertyModel,
      customForms: this.customForms
    }).submit(() => {
      let params = this.customForms.merge({
        // 当前模型ID(2019年3月11日15:24:28新增 for AndyPan)
        projectId: this.status.modelId,
        // 这里是添加属性目录，所以parentId是rootDirectoryId
        parentId: Lang.rootDirectoryId,
        // 左侧(选中)构件(目录)ID
        directoryId: tree ? tree.key : null,
        code: null,
        // 排序，当前目录最后一项的sort+1
        sort: sort,
        // 这里是添加属性目录，所以level是1，目录下的属性为2
        level: 1,
        // 子属性，默认为[]
        data: [],
        // 类型 -1.整车 0.车身 1.总成 2.零件
        modelType: this.type
      }, this.customForms.getModelJson());

      this.formSubmit({
        customForms: this.customForms,
        params: params,
        loadServiceFn: 'createModelProperty'
      }).then((res: any) => {
        if (res.success) {
          this.message.success(Lang.createSuccess);
          params['id'] = res.result;
          // 将新增属性目录更新到页面
          this.status.propertyArys.push(params);
        }
        else {
          this.message.error(Utils.errorMessageProcessor(res));
        }
      });
    });
  }

  /**
   * 添加属性
   * @param attributeDirectory 当前属性目录
   * @param attribute 当前属性对象
   */
  private addAttribute(attributeDirectory, attribute) {
    // 删除编辑状态添加的数据模型，保持原始状态
    this.customForms.deleteModelByKey(['value', 'text', 'uploadFile']);
    // 设置上传文件的key
    this.status.uploadModel[0]['fileKey'] = attributeDirectory.directoryId;
    this.operationOpenModal({
      operationModalTitle: '新增属性',
      infoModel: this.status.attrModel,
      customForms: this.customForms
    }).rendered(() => {
      this.customForms.updateModel({ uploadFile: { isCreate: true } });
    }).close(() => {
      // this.customForms.clear();
      this.status.attrModel[1].value = null;
      this.customForms.restoreAddModel().restoreUpdateModel().clear();
      this.enableModel();
      // this.status.thisAttrType = null;
    }).submit(() => {
      let datas = attributeDirectory.data || [];
      let lastSort = datas[datas.length - 1];
      let params = this.customForms.merge({
        // 当前模型ID(2019年3月11日15:24:28新增 for AndyPan)
        projectId: this.status.modelId,
        // 添加属性，parentId是属性目录ID
        parentId: attributeDirectory.id,
        // 左侧(选中)构件(目录)ID
        directoryId: attributeDirectory.directoryId,
        code: null,
        // 排序，与当前目录sort相同
        // sort: attributeDirectory.sort,
        sort: lastSort ? ((lastSort.sort || 0) + 1) : 0,
        // 添加属性，为2
        level: 2,
        // 类型 -1.整车 0.车身 1.总成 2.零件
        modelType: this.type
      }, this.customForms.getModelJson(this.renderValueType.bind(this)));
      if (params['text']) {
        params['value'] = params['text'];
      }

      this.formSubmit({
        customForms: this.customForms,
        params: params,
        loadServiceFn: 'createModelProperty'
      }).then(res => {
        if (res.success) {
          this.customForms.restoreAddModel().restoreUpdateModel().clear();
          this.message.success(Lang.createSuccess);
          // 将新增属性目录更新到页面
          attributeDirectory.data = attributeDirectory.data || [];
          params.id = res.result;
          params.value = eval('(' + params.value + ')');
          attributeDirectory.data.push(params);
          // console.info(attributeDirectory)
          // this.queryListById(true);
        }
        else {
          this.message.error(Utils.errorMessageProcessor(res));
        }
      });
    });
  }

  /**
   * 渲染数值类型
   * @param item
   * @param idx
   * @param result
   */
  private renderValueType(item, idx, result) {
    // console.info(item);
    if (item.key == 'value') {
      let resultJSON = {
        value: item.group[0].value,
        unit: item.group[1].value
      };
      if (result.type == 2) {
        let uploadFileModel = this.customForms.getModelByKey('uploadFile');
        uploadFileModel = uploadFileModel ? uploadFileModel[0] : {};
        let files = uploadFileModel.file || {};
        // 如果是数值+文件
        resultJSON['fileId'] = files.id;
        resultJSON['fileName'] = uploadFileModel.value;
        resultJSON['filePath'] = files.url;
      }
      return JSON.stringify(resultJSON);
    }
    else if (item.key == 'text') {
      return '{value: "' + item.value + '"}';
    }
  }

  /**
   * 修改属性
   * @param e <Event> Event对象
   * @param attributeDirectory <JSON> 当前属性目录
   * @param attribute <JSON> 当前属性
   */
  private editAttribute(e, attributeDirectory, attribute) {
    let target = e.target || e.srcElement;
    if (target.className.indexOf('del-btn') > -1) {
      return;
    }
    // console.info(attribute);
    // 设置上传文件的key
    this.status.uploadModel[0]['fileKey'] = attributeDirectory.directoryId;
    this.operationOpenModal({
      operationModalTitle: '编辑属性',
      infoModel: this.status.attrModel,
      customForms: this.customForms,
      formData: attribute,
      formRenderCallBack: (modelItem, idx, isExist) => {
        if (modelItem.key == 'type') {
          this.status.thisAttrType = attribute.type;
          return isExist || 'null';
        }
      }
    }).rendered(() => {
      let attrValue = attribute.value;
      if (attrValue) {
        // 绑定文件信息
        if (attrValue.fileId) {
          // 数值
          let valueModel = this.status.valueModel;
          let valueGroup = valueModel[0].group;
          if (attrValue) {
            valueGroup[0].value = attrValue.value;
            valueGroup[1].value = attrValue.unit;
          }
          this.customForms.addModel(valueModel);
          // 文件
          this.status.uploadModel[0]['progress'] = 100;
          this.status.uploadModel[0]['file'] = {
            id: attrValue.fileId,
            url: attrValue.filePath
          };
          this.customForms.addModel(this.status.uploadModel);
          this.customForms.renderToModel({ uploadFile: attrValue.fileName });
        }
        else {
          // 否则，清空
          this.status.uploadModel[0]['progress'] = 0;
          this.status.uploadModel[0]['file'] = {};
          this.status.uploadModel[0]['value'] = null;
          if (attrValue.unit) {
            // 数值
            let valueModel = this.status.valueModel;
            let valueGroup = valueModel[0].group;
            if (attrValue) {
              valueGroup[0].value = attrValue.value;
              valueGroup[1].value = attrValue.unit;
            }
            this.customForms.addModel(valueModel);
          }
          else {
            // 文本
            let textModel = this.status.textModel;
            if (attrValue) {
              setTimeout(() => {
                textModel[0]['value'] = attrValue.value;
              }, 50);
            }
            this.customForms.addModel(textModel);
          }
        }
      }
      else {
        // 否则，清空
        this.status.uploadModel[0]['progress'] = 0;
        this.status.uploadModel[0]['file'] = {};
        this.status.uploadModel[0]['value'] = null;
      }
      this.customForms.updateModel({ uploadFile: { isCreate: true } });
    }).close(() => {
      this.customForms.restoreAddModel().restoreUpdateModel().clear();
      this.enableModel();
      this.status.thisAttrType = null;
    }).submit(() => {
      let params = this.customForms.merge(this.customForms.getModelJson(this.renderValueType.bind(this)), attribute);
      if (params['text']) {
        params['value'] = params['text'];
      }
      // 类型 -1.整车 0.车身 1.总成 2.零件
      params['modelType'] = this.type;
      this.formSubmit({
        customForms: this.customForms,
        params: params,
        loadServiceFn: 'modifyModelProperty'
      }).then(res => {
        if (res.success) {
          this.customForms.restoreAddModel().restoreUpdateModel().clear();
          attribute.value = eval('(' + attribute.value + ')');
          this.message.success(Lang.modifySuccess);
        }
        else {
          this.message.error(Utils.errorMessageProcessor(res));
        }
      });
    });
  }

  /**
   * 文件上传开始
   * @param uploadStatus 返回数据
   */
  private uploadFileChange(uploadStatus) {
    // console.info(uploadStatus);
    // 开始上传时，禁用表单模型，防止做其他操作
    this.disabledModel(1);
  }

  /**
   * 文件上传成功
   * @param uploadStatus  返回数据
   */
  private uploadFileSuccess(uploadStatus) {
    // 完成后，重新启用表单模型
    this.enableModel();
  }

  /**
   * 在上传中删除正在上传的文件
   * @param data 当前数据模型
   */
  private uploadFileRemove(data) {
    // 重新启用表单模型
    this.enableModel();
  }

  // 属性图标的展开、收起
  private propertyFolder(item) {
    item.expanded = !item.expanded;
  }

  private selectChange(res) {
    let data = res.data;
    if (data.key == 'type') {
      let thisAttrType = this.status.thisAttrType;
      if (data.value == 1) {
        // 数值
        this.customForms
          // 删除文本框和文件上传
          .deleteModelByKey(['text', 'value', 'uploadFile'])
          // 添加数值
          .addModel(this.status.valueModel);
      }
      else if (data.value == 2) {
        // 数值+文件
        this.customForms
          // 删除文本框和数值框
          .deleteModelByKey(['text', 'value'])
          // 添加数值
          .addModel(this.status.valueModel)
          // 添加文件上传
          .addModel(this.status.uploadModel)
          // 修改文件上传属性
          .updateModel({ uploadFile: { isCreate: true } });
      }
      else if (data.value == 3) {
        // 文本
        this.customForms
          // 删除数值框和文件上传
          .deleteModelByKey(['value', 'uploadFile'])
          // 添加文本
          .addModel(this.status.textModel);
      }
      // 在切换类型时，保持当前类型的数值不被清除
      let attrTypeKey = {
        1: ['text', 'uploadFile'],
        2: ['text'],
        3: ['value', 'uploadFile']
      };
      if (thisAttrType) {
        this.customForms.clearValueByKey(attrTypeKey[thisAttrType]);
      }
    }
  }

  // add 唐华波
  public uploadRouter(){
    let modelId = this.routeInfo.snapshot.queryParams['carModelId'];
    this.router.navigate(['setting/model-manage'], {
      queryParams: {carModelId : modelId}
    });
  }

}
