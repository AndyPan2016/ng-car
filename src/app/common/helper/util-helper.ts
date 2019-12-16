

// 辅助工具
export const Utils = {
  // 重置数据，将数据组装成需要的结构和值
  resetData(data, callBack) {
    let tempData : any = [];
    if (data) {
      // let i = 0, len = data.length, item, cbResult;
      // for (; i < len; i++) {
      //   item = data[i];

      let item, cbResult;
      for (let key in data){
        item = data[key];
        if (callBack) {
          cbResult = callBack(item, key);
          if(cbResult == 'break'){
            tempData = 'break';
            break;
          }
          if (cbResult) {
            tempData.push(cbResult);
          }
        }
      }
    }
    return tempData;
  },
  forEach(data, callBack) {
    let tempData : any = [];
    if (data) {
      let item, cbResult;
      for (let key in data){
        item = data[key];
        if (callBack) {
          cbResult = callBack(item, key);
          if(cbResult == 'break'){
            tempData = 'break';
            break;
          }
          if (cbResult) {
            tempData.push(cbResult);
          }
        }
      }
    }
    return tempData;
  },
  // 渲染编号
  renderNumber(number: any){
    let length = (number+'').length;
    let result = '', template = '000';
    let tempLen = template.length;
    let len = tempLen - length;
    let i = 0;
    for(;i<len;i++){
      result += template.split('')[0]
    }

    return result + number;
  },
  // 设置本地存储
  setLocalStorage(key, val){
    window.localStorage.setItem(key, val);
  },
  // 获取本地存储
  getLocalStorage(key){
    return window.localStorage.getItem(key);
  },
  // 设置Cookie
  setCookie(name,value) { 
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toUTCString(); 
  },
  // 获取Cookie
  getCookie(name) { 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return unescape(arr[2]); 
    else 
      return null; 
  },
  //删除cookies 
  delCookie(name) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval = this.getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toUTCString(); 
  },
  // maxlength限制
  limitKeyUp(e){
    e = e || window.event;
    let target = e.target || e.srcElement;
    let value = target.value;
    let maxLength = target.getAttribute('maxlength');
    let result = {status: true, message: ''};
    if(maxLength){
      if(value.length >= maxLength){
        result = {status: false, message: '最大长度为'+maxLength};
      }
    }
    return result;
  },
  // keyup事件
  keyup(e, keyAry, fn) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    let keyCode = e.keyCode;
    if (typeof(keyAry) == 'function') {
      fn = keyAry;
      keyAry = undefined;
    }

    if (keyAry) {
      let i = 0, len = keyAry.length, keyItem;
      for (; i < len; i++) {
        keyItem = keyAry[i];
        if (keyItem == keyCode) {
          if (fn) {
            fn(e, keyCode, target);
          }
        }
      }
    }
    else {
      fn(e, keyCode, target);
    }
  },
  // 回车事件
  enter(e, fn) {
    Utils.keyup(e, [13], fn);
  },
  // 异步遍历数据
  asyncEach(data, cb, last?) {
    if (data) {
      let i = 0;
      let len = data.length;
      let item;
      let each = () => {
        item = data[i];
        if (cb) {
          cb(item, i);
        }
        i++;
        if (i < len) {
          setTimeout(each, 0);
        } else {
          if (last) {
            last();
          }
        }
      };
      if (len) {
        each();
      }
      else if (last) {
        last();
      }
    }
  },
  // 异步等待
  asyncWait(options) {
    let that = this;

    let tempWaitFn;
    if (typeof(options) == 'function') {
      tempWaitFn = options;
      options = {};
    }

    // 循环最大次数，当你的条件始终无法满足，在经过最大循环次数后，将停止继续等待，默认为50次
    let waitMaxCount = options.waitMaxCount || 50;
    // 达到最大循环次数时响应的函数
    let waitMaxCountFn = options.waitMaxCountFn;
    // 等待函数(当成功后，需要返回true，以终止轮循)
    let waitFn = options.waitFn || tempWaitFn;
    // 轮循间隔
    let loopInterval = options.loopInterval || 0;
    // 无限循环（默认：false）
    let infiniteLoop = options.infiniteLoop || false;

    // 状态
    that.status = {
      // 计数count
      maxCount: waitMaxCount,
      // 暂停
      suspend: false,
      // 停止
      stop: false
    };

    // 轮循函数
    let waitLoop = () => {
      let status = that.status;
      let result = null;
      if (waitFn) {
        // result返回true，则停止轮循
        result = waitFn(status.maxCount);
      }
      setTimeout(() => {
        if (result != true) {
          // 当计数次数用完时，停止轮循
          if (status.maxCount == 0) {
            // 达到最大循环次数时响应的函数
            if (waitMaxCountFn) {
              waitMaxCountFn(status.maxCount);
            }
            // 重置计数器
            status.maxCount = waitMaxCount;
            // 是否无限循环
            if (infiniteLoop && !status.stop) {
              waitLoop();
            }
          }
          else {
            if (!status.suspend) {
              waitLoop();
            }
          }
        }
      }, loopInterval);
      status.maxCount--;
    };
    waitLoop();

    // 暂停
    that.suspend = (time?) => {
      that.status.suspend = true;
      if (time) {
        // time毫秒后，自动继续
        setTimeout(that.continue, time);
      }
    };

    // (从暂停中)继续
    that.continue = () => {
      that.status.suspend = false;
      waitLoop();
    };

    // 停止
    that.stop = () => {
      that.status.maxCount = 0;
      that.status.stop = true;
    };

    // 重新开始
    that.restart = () => {
      that.status.maxCount = waitMaxCount;
      that.status.stop = false;
      waitLoop();
    };

    return that;
  },
  /**
   * 组装URL参数
   * @param options <any> 组装参数集合
   * @returns 组装后的URL
   */
  assembleUrlParams(options: any) {
    // 需要拼接参数的URL
    let url = options.url || window.location.href;
    // 被组装的参数对象
    let params = options.params || {};
    // 判断原url中是否已经存在参数
    let hasParams = url.indexOf('?');

    let i = 0;
    // 连接符
    let connector;
    // 参数字符串
    let paramsString = '';
    for (let key in params) {
      connector = (i == 0 ? (hasParams > -1 ? '&' : '?') : '&');
      paramsString += connector + key + '=' + params[key];
      i++;
    }

    return (url + paramsString);
  },
  // 重组treeNode,将获取到的数据组装成tree组件需要的数据
  renderTreeNode(treeNodeAll, firstLevelDirectoryId?) {
    firstLevelDirectoryId = firstLevelDirectoryId || Lang.rootDirectoryId;

    let getChild = (thisNode) => {
      let parentNode = treeNodeAll[thisNode.parentId];
      if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(thisNode);
        parentNode.isLeaf = undefined;
      }
    };
    let lastTreeNode = [];
    for (let key in treeNodeAll) {
      let tempItem = treeNodeAll[key];
      getChild(tempItem);
      if(tempItem.parentId == firstLevelDirectoryId){
        lastTreeNode.push(tempItem);
      }
    }

    return lastTreeNode;
  },
  getTreeNode(treeNode) {
    let resultNode = [];

    let renderChild = (thisNode) => {
      let i = 0, len = thisNode.length, treeItem;
      for(;i<len;i++){
        treeItem = thisNode[i];
        // if(treeItem.origin.code){
        if(treeItem.origin.modelId){
          resultNode.push(treeItem.key);
        }
        if(treeItem.children){
          renderChild(treeItem.children);
        }
      }
    };
    renderChild(treeNode);

    return resultNode;
  },
  // 映射值
  mappingKeyValue(from, to) {
    if(from && to){
      this.resetData(to, (item, idx) => {
        let key = item.key;
        let value = from[key];
        if(value != 'undefined' && value != undefined){
          item['value'] = value;
        }
      });
    }

    return to;
  },
  // 新标签打开路由
  openBlank(route) {
    // let path = 'http://'+window.location.host+'/'+route;
    window.open(route, "_blank");
    return this;
  },
  openPath(path: string) {
    let href = window.location.href;
    // 发布线上，需要添加/view目录,因为base-href=/view
    let view = href.indexOf('/view/') > -1 ? '/view' : '';
    let host = window.location.host;
    let url = 'http://' + host + view + path;
    setTimeout(() => {
      window.location.href = url;
    }, 0);
  },
  // 获取是否有指定权限
  getPermissions(str) {
    let grantedPermissions = eval('('+this.getLocalStorage(Status.grantedPermissions)+')');
    return grantedPermissions[str] ? true : false;
  },
  // 将属性从某个值设置为某个值
  setAttributeFromTo(model: any, options?: any) {
    if (model) {
      let from = options.from;
      let to = options.to;
      let key = options.key;
      if (from != undefined) {
        if (key) {
          model[key] = from;
        }
        else {
          model = from;
        }
      }
      setTimeout(() => {
        if (key) {
          model[key] = to;
        }
        else {
          model = to;
        }
      }, 100);
    }

    return this;
  },
  // 预览PDF
  previewPDF(options: any) {
    if (options) {
      let url = options.url;
      if (url) {
        let previewTarget = document.createElement('div');
        let previewTargetStyle = 'width:100%;height:100%;position:fixed;top:0;left:0;z-index:101;background:rgba(0,0,0,0.2);';
        previewTarget.setAttribute('style', previewTargetStyle);

        let closeTarget = document.createElement('a');
        let closeTargetStyle = 'width: 50px;height:50px;position:absolute;top:0;right:0;text-align:center;line-height:50px;font-size:30px;color:#F00;';
        closeTarget.setAttribute('style', closeTargetStyle);
        closeTarget.innerHTML = 'X';
        closeTarget.title = '关闭预览';
        closeTarget.onclick = () => {
          previewTarget.parentNode.removeChild(previewTarget);
        };

        let iframeTarget = document.createElement('iframe');
        let iframeTargetStyle = 'width:80%;height:100%;margin:0 auto;border:0;';
        iframeTarget.className = "zzj-scrollbar";
        iframeTarget.setAttribute('style', iframeTargetStyle);
        iframeTarget.setAttribute('src', url);

        previewTarget.appendChild(iframeTarget);
        previewTarget.appendChild(closeTarget);
        document.body.appendChild(previewTarget);
      }
    }
  },
  // 错误消息处理器
  errorMessageProcessor(res: any, defaultMessage?: any) {
    let result = defaultMessage || Lang.operateFail;
    let error = res.error;
    if (error) {
      // 错误消息
      result = error.message;
      // 验证错误消息
      let validationErrors = error.validationErrors;
      if (validationErrors) {
        let validationErrorsFirstItem = validationErrors[0];
        if (validationErrorsFirstItem) {
          result = validationErrorsFirstItem.message;
        }
      }
    }

    return result;
  },
  /**
   * 关键字匹配
   * @param options 参数选项
   * @results 匹配到的结果集合
   * @example let data = [{name: 'admin'}, {name: 'user'}, {name: 'test'}]; let matchResult = Utils.keywordMatch({data, key: 'name', keyword: 'e'});查询data集合中字段为'name'的值中，包含关键字'e'的集合
   */
  keywordMatch(options) {
    let result = [];
    if (options) {
      let data = options.data;
      let key = options.key || 'name';
      let keyWord = options.keyword;
      let callBack = options.callBack;
      // 是否全匹配，默认为关键字匹配
      let isFullMatch = options.isFullMatch;

      if (keyWord) {
        let i = 0;
        let len = data.length;
        let dataItem;
        let textWord;
        let temp = [];
        for (; i < len; i++) {
          dataItem = data[i];
          textWord = dataItem[key];
          let cbResult;
          if (callBack) {
            cbResult = callBack(dataItem, textWord, keyWord, i);
          }
          if ((isFullMatch ? textWord == keyWord : textWord.indexOf(keyWord) > -1) && cbResult != false) {
            temp.push(dataItem);
          }
        }
        if (temp.length) {
          result = temp;
        }
      }
      else {
        result = data;
      }
    }
    return result;
  }
};

let tempKeyCode = ''; let responseThread = null;
export const KeyCodeEvent = {

  keyevent: (e, keyAry, fn) => {
    e = e || window.event;
    let target = e.target || e.srcElement;
    let keyCode = e.keyCode;
    // console.info(keyCode);
    tempKeyCode = (tempKeyCode ? (tempKeyCode+'+') : '') + keyCode;
    
    window.clearTimeout(responseThread);
    if(typeof(keyAry) == 'function'){
      fn = keyAry;
      keyAry = undefined;
    }

    let responseFn = () => {
      if(fn){
        fn(e, keyCode, target);
      }
    };
    responseThread = setTimeout(() => {
      if(keyAry){
        let i = 0, len = keyAry.length, keyItem;
        for(;i<len;i++){
          keyItem = keyAry[i]+'';
          if(keyItem == tempKeyCode){
            responseFn();
          }
        }
      }
      else{
        responseFn();
      }
      tempKeyCode = '';
    }, 780);
  },
  entry: (target, fn) => {
    KeyCodeEvent.keyup(target, [13], fn);
  },
  keydown: (target, keyAry?, fn?) => {
    target.onkeydown = (e) => {
      KeyCodeEvent.keyevent(e, keyAry, fn);
      // return false;
    };
  },
  keyup: (target, keyAry?, fn?) => {
    target.onkeyup = (e) => {
      KeyCodeEvent.keyevent(e, keyAry, fn);
    };
  }
};

// 任务
let taskStart = null;
let taskComplate = null;
let taskChange = null;
let taskFail = null;
export const Task = {
  // 任务列表
  taskList: {},
  // 当前未完成任务数
  taskCount: 0,
  // 所有任务数
  taskCountAll: 0,
  status: {
    0: '初始化',
    1: '已完成',
    '-1': '失败',
    '-2': '已跳过'
  },
  taskRun: false,
  // 是否终止
  isStop: false,
  onStart: (callBack) => {
    taskStart = callBack;
  },
  onChange: (callBack) => {
    taskChange = callBack;
  },
  onComplate: (callBack) => {
    taskComplate = callBack;
  },
  onFail: (callBack) => {
    taskFail = callBack;
  },
  taskChangeEvent(task) {
    if(task){
      if(taskChange){
        taskChange({
          taskCountAll: Task.taskCountAll,
          taskCount: Task.taskCount,
          taskList: Task.taskList,
          changeTask: task,
          taskStatus: Task.status
        });
      }
      if(task.status == -1){
        if(taskFail){
          taskFail(task);
        }
      }
      if(Task.taskCount == 0){
        setTimeout(()=>{
          // Task.taskRun = false;
          Task.clear();
          if(taskComplate){
            taskComplate();
          }
        }, 100);
      }
    }
  },
  add: (taskObj:any, remark?:any) => {
    if(Task.isStop){
      // 如果被终止
      Task.isStop = false;
      return;
    }
    if(!Task.taskRun){
      // 每组任务全部完成后，下一组任务第一次add时会触发
      if(taskStart){
        taskStart();
      }
      Task.taskRun = true;
    }
    if(typeof(taskObj) == 'string'){
      let temp = {name: taskObj, status: 0};
      taskObj = temp;
    }
    if(remark){
      // 任务描述
      taskObj.remark = remark;
    }
    Task.taskList[taskObj.name] = taskObj;
    Task.taskCount++;
    Task.taskCountAll++;
    Task.taskChangeEvent(taskObj);
    return Task;
  },
  update(name, status){
    let updateTask = Task.taskList[name];
    if(status == 1){
      if(updateTask){
        if(updateTask.status != 1){
          Task.taskCount--;
        }
        updateTask.status = status;
      }
    }
    else if(status == -2){
      if(updateTask){
        Task.taskCount--;
        updateTask.status = status;
      }
    }
    else{
      if(updateTask){
        if(updateTask.status == 1){
          Task.taskCount++;
        }
        updateTask.status = status;
      }
    }
    Task.taskChangeEvent(updateTask);

    return Task;
  },
  delete(name) {
    let updateTask = Task.taskList[name];
    if (updateTask) {
      Task.taskList[name] = undefined;
      delete Task.taskList[name];
      Task.taskCount--;
      Task.taskCountAll--;
    }
    Task.taskChangeEvent(updateTask);
    return Task;
  },
  // 跳过
  skip(task) {
    if (task) {
      Task.update(task.name, -2);
    }
    return Task;
  },
  clear() {
    // 任务列表
    Task.taskList = {};
    // 当前未完成任务数
    Task.taskCount = 0;
    // 所有任务数
    Task.taskCountAll = 0;
    // 任务是否运行完成
    Task.taskRun = false;
  },
  complate(name) {
    return Task.update(name, 1);
  },
  error(name) {
    Task.update(name, -1);
    // Task.isStop = true;
    // setTimeout(() => {
    //   Task.isStop = false;
    // }, 100);
    // Task.clear();
    return Task;
  }
};

// 语言
let LangModel = function(type?) {

  let state = {
    zh: {
      loading: '加载中...',
      loadError: '加载失败',
      loadFail: '获取数据失败',
      createSuccess: '创建成功',
      createFail: '创建失败',
      modifySuccess: '修改成功',
      modifyFail: '修改失败',
      deleteSuccess: '删除成功',
      deleteFail: '删除失败',
      operateSuccess: '操作成功',
      operateFail: '操作失败',
      deleteTip: {
        title: '删除？',
        tip: '确认要删除吗？'
      }
    },
    ch: {
      loading: 'loading...',
      loadError: 'load error',
      loadFail: 'load failure',
      createSuccess: 'create success',
      createFail: 'create failure',
      modifySuccess: 'update success',
      modifyFail: 'update failure',
      deleteSuccess: 'delete success',
      deleteFail: 'delete failure',
      operateSuccess: 'operation success',
      operateFail: 'operation failure',
      deleteTip: {
        title: 'Delete?',
        tip: 'Are you sure you want to delete it?'
      }
    }
  };
  let thisType = type || 'zh';

  this.getState = (key?, type?) => {
    type = type || thisType;
    let model = state[type];

    return key ? model[key] : model;
  }
};
let lModel = new LangModel();

export const Lang = {
  // 加载中
  loading: lModel.getState('loading'),
  // 加载失败
  loadError: lModel.getState('loadError'),
  // 获取数据失败
  loadFail: lModel.getState('loadFail'),
  // 创建成功
  createSuccess: lModel.getState('createSuccess'),
  // 创建失败
  createFail: lModel.getState('createFail'),
  // 操作成功
  operateSuccess: lModel.getState('operateSuccess'),
  // 操作失败
  operateFail: lModel.getState('operateFail'),
  // 修改成功
  modifySuccess: lModel.getState('modifySuccess'),
  // 修改失败
  modifyFail: lModel.getState('modifyFail'),
  // 删除成功
  deleteSuccess: lModel.getState('deleteSuccess'),
  // 删除失败
  deleteFail: lModel.getState('deleteFail'),
  // 删除confirm提示
  deleteTip: lModel.getState('deleteTip'),
  // 根目录ID
  rootDirectoryId: '00000000-0000-0000-0000-000000000000'
};

// 状态
export const Status = {
  // 占位符
  placeholder: '-',
  // Cookie名称
  abpTenantId: 'Abp.TenantId', abpAuthToken: 'Abp.AuthToken', encAuthToken: 'enc_auth_token',
  userId: 'userId', roleName: 'roleName', userName: 'userName',
  grantedPermissions: 'Abp.grantedPermissions',
  allPermissions: 'Abp.allPermissions',
  platform: 'Abp.platform', carModelId: 'carModelId', carModelName: 'carModelName',
  // 车辆（燃油）类型
  carCategory: [
    {value: 1, text: '汽油'},
    {value: 2, text: '柴油'},
    {value: 3, text: '充电'},
    {value: 4, text: '油电混合'}
  ],
  // 车型级别
  carLevel: [
    {
      text: '轿车', options: [
        {value: 1, text: '微型车'},
        {value: 2, text: '小型车'},
        {value: 3, text: '紧凑型车'},
        {value: 4, text: '中型车'},
        {value: 5, text: '中大型车'},
        {value: 6, text: '大型车'}
      ]
    },
    {
      text: 'SUV', options: [
        {value: 7, text: '小型SUV'},
        {value: 8, text: '紧凑型SUV'},
        {value: 9, text: '中型SUV'},
        {value: 10, text: '中大型SUV'},
        {value: 11, text: '大型SUV'}
      ]
    },
    {
      text: 'MVP', options: [
        {value: 12, text: 'MVP'}
      ]
    },
    {
      text: '跑车', options: [
        {value: 13, text: '跑车'}
      ]
    }
  ],
  // 属性单位
  attributeUnit: [
    { value: 'g/cm3', text: 'g/cm3' },
    { value: '℃', text: '℃' },
    { value: 'm', text: 'm' },
    { value: 'W/(m·℃)', text: 'W/(m·℃)' },
    { value: '1/℃', text: '1/℃' },
    { value: 'J /(kg·℃)', text: 'J /(kg·℃)' },
    { value: 'S/m', text: 'S/m' },
    { value: 'Ω·m', text: 'Ω·m' },
    { value: 'ppm/℃', text: 'ppm/℃' },
    { value: 'T', text: 'T' },
    { value: 'A/m', text: 'A/m' },
    { value: 'Oe', text: 'Oe' },
    { value: 'W/kg', text: 'W/kg' }
  ],
  // 添加项目成员可用类型
  memberType: [
    {value: 2, text: '项目管理员'},
    {value: 4, text: '查阅人员'}
  ]
};
