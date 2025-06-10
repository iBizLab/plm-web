import './style.css';
var ge = Object.defineProperty;
var we = (t, s, e) => s in t ? ge(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var x = (t, s, e) => (we(t, typeof s != "symbol" ? s + "" : s, e), e);
import { useUIStore as ye, useNamespace as $, useControlController as X, withInstall as Ce } from "@ibiz-template/vue3-util";
import { Srfuf as _, GridRowState as K, ControlVO as be, TreeGridController as ve, calcDeCodeNameById as Se, GridNotifyState as q, GridController as Ee, ScriptFactory as De, registerControlProvider as Re } from "@ibiz-template/runtime";
import { ref as M, computed as G, watch as A, nextTick as Pe, reactive as Ne, createVNode as y, resolveComponent as S, defineComponent as Ge, onMounted as xe, onUnmounted as Ie, createTextVNode as T, mergeProps as J, h as Le } from "vue";
import { toNumber as ke, isArray as W } from "lodash-es";
import { isElementSame as Te, RuntimeError as I, awaitTimeout as Me, mergeDefaultInLeft as Ae, RuntimeModelError as Fe } from "@ibiz-template/core";
import { createUUID as Y } from "qx-util";
import { computePosition as Oe } from "@floating-ui/dom";
class $e {
  constructor() {
    x(this, "component", "IBizNumberGridControl");
  }
}
function ze(t) {
  const s = M(), e = M([]), i = G(() => t.state.items.map((n) => (n._hasChildren = t.state.items.some(
    (f) => n[t.treeGridValueField] && n[t.treeGridValueField] === f[t.treeGridParentField]
  ), n._children = [], n))), o = G(() => {
    const n = t.state.items.map(
      (f) => f[t.treeGridValueField]
    );
    return i.value.filter(
      (f) => !f[t.treeGridParentField] || !n.includes(
        f[t.treeGridParentField]
      )
    );
  });
  async function c(n, f, g) {
    if (!(t.model.enableGroup && n.isGroupData) && n.srfuf !== _.CREATE)
      if (ibiz.config.grid.editShowMode === "row" && t.model.enableRowEdit) {
        const w = t.findRowState(n);
        w && w.showRowEdit !== !0 && await t.switchRowEdit(w, !0);
      } else
        t.onRowClick(n);
  }
  function l(n) {
    t.model.enableGroup && n.isGroupData || n.srfuf !== _.CREATE && t.onDbRowClick(n);
  }
  function d(n) {
    return !!e.value.find(
      (f) => n.tempsrfkey === f.tempsrfkey
    );
  }
  function p() {
    return t.model.enableGroup ? e.value.filter((n) => !n.isGroupData) : [...e.value];
  }
  A(
    [
      () => s.value,
      () => t.state.isLoaded,
      () => t.state.selectedData
    ],
    ([n, f, g]) => {
      !f || !n || (Te(g, p()) || (e.value = g), t.state.singleSelect && (g[0] ? s.value.setCurrentRow(g[0], !0) : s.value.setCurrentRow()));
    }
  );
  function a(n) {
    const { prop: f, order: g } = n, w = t.fieldColumns[f].model.appDEFieldId;
    let v;
    g === "ascending" ? v = "asc" : g === "descending" && (v = "desc"), "".concat(w, ",").concat(v) !== t.state.sortQuery && (t.setSort(w, v), t.load());
  }
  function u({ row: n }) {
    let f = "";
    e.value.length > 0 && e.value.forEach((w) => {
      w.tempsrfkey === n.tempsrfkey && (f = "current-row");
    });
    const g = t.findRowState(n);
    return g != null && g.showRowEdit && (f += " editing-row"), n.srfkey && (f += " id-".concat(n.srfkey)), f;
  }
  function h({
    _row: n,
    column: f,
    _rowIndex: g,
    _columnIndex: w
  }) {
    var R;
    const v = (R = t.model.degridColumns) == null ? void 0 : R.find((L) => L.codeName === f.property);
    return v && v.headerSysCss && v.headerSysCss.cssName ? v.headerSysCss.cssName : "";
  }
  return A(
    () => t.state.sortQuery,
    (n) => {
      if (n) {
        const f = t.state.sortQuery.split(",")[0], g = t.state.sortQuery.split(",")[1];
        if (f && g) {
          const w = g === "desc" ? "descending" : "ascending", v = () => {
            s.value ? Pe(() => {
              s.value.sort(f, w);
            }) : setTimeout(v, 500);
          };
          v();
        }
      }
    }
  ), {
    tableRef: s,
    treeGirdData: o,
    treeNodeData: i,
    curSelectedData: e,
    getSelection: p,
    onRowClick: c,
    onDbRowClick: l,
    isSelected: d,
    onSortChange: a,
    handleRowClassName: u,
    handleHeaderCellClassName: h
  };
}
function _e(t, s) {
  const { controlParam: e } = s.modelData, i = () => {
    s.data && (t.state.items = s.data, t.state.rows = s.data.map((a) => new K(new be(a), t)));
  }, o = G(() => {
    var u;
    const a = Object.values(t.fieldColumns).find(
      (h) => h.model.appDEFieldId === t.model.minorSortAppDEFieldId
    );
    return {
      prop: a == null ? void 0 : a.model.codeName,
      order: ((u = t.model.minorSortDir) == null ? void 0 : u.toLowerCase()) === "desc" ? "descending" : "ascending"
    };
  });
  t.evt.on("onCreated", async () => {
    s.isSimple && (i(), t.state.isLoaded = !0);
  }), A(
    () => s.data,
    () => {
      s.isSimple && i();
    },
    {
      deep: !0
    }
  );
  const c = G(() => {
    const { state: a } = t;
    let u = {
      appId: t.context.srfappid,
      cssClass: "cube-outline"
    };
    if (e && e.ctrlParams && e.ctrlParams.GROUPICON && (u.cssClass = e.ctrlParams.GROUPICON), t.model.enableGroup) {
      const h = [];
      return a.groups.forEach((n) => {
        if (!n.children.length)
          return;
        n.groupIcon && (u = n.groupIcon);
        const f = [...n.children], g = Y();
        h.push({
          tempsrfkey: g,
          srfkey: g,
          isGroupData: !0,
          caption: n.caption,
          _children: f,
          groupIcon: u
        });
      }), h;
    }
    return a.rows.map((h) => h.data);
  }), l = G(() => {
    if (t.isMultistageHeader)
      return t.model.degridColumns || [];
    const a = [];
    return t.state.columnStates.forEach((u) => {
      var n, f;
      if (u.hidden)
        return;
      const h = ((n = t.fieldColumns[u.key]) == null ? void 0 : n.model) || ((f = t.uaColumns[u.key]) == null ? void 0 : f.model);
      h && a.push(h);
    }), a;
  });
  return {
    tableData: c,
    renderColumns: l,
    defaultSort: o,
    summaryMethod: ({
      columns: a
    }) => a.map((u, h) => h === 0 ? t.aggTitle : t.state.aggResult[u.property]),
    headerDragend: (a, u, h) => {
      const { property: n } = h, f = t.columns[n], g = t.state.columnStates.find((w) => w.key === n);
      if (f.isAdaptiveColumn) {
        g && (g.adaptive = !1), f.isAdaptiveColumn = !1, f.model.width = a;
        const w = l.value.findIndex((v) => t.columns[v.codeName].isAdaptiveColumn);
        t.hasAdaptiveColumn = w !== -1;
      }
      g && (g.columnWidth = a, t.saveColumnStates());
    }
  };
}
function Be(t) {
  function s(o) {
    !o || o === t.state.curPage || (t.state.curPage = o, t.load());
  }
  function e(o) {
    !o || o === t.state.size || (t.state.size = o, t.state.curPage === 1 && t.load());
  }
  function i() {
    t.load();
  }
  return { onPageChange: s, onPageSizeChange: e, onPageRefresh: i };
}
function Ue(t, s) {
  let e;
  const i = M(!1), o = M(), c = Ne({}), l = (h) => {
    if (!t.value)
      throw new I("找不到表格组件引用");
    const n = t.value.$el;
    let f = ".editing-row";
    h.data.srfkey && (f += ".id-".concat(h.data.srfkey));
    const g = n.querySelector(f);
    if (!g)
      throw new I("找不到对应的表格行dom元素");
    return g;
  }, d = async (h) => {
    const n = l(h);
    if (!e)
      throw new I("拿不到pop组件的实例");
    const f = e.$el, {
      x: g,
      y: w
    } = await Oe(n, f, {
      placement: "bottom"
    });
    Object.assign(c, {
      top: "".concat(w, "px"),
      left: "".concat(g, "px")
    }), o.value = h, i.value = !0;
  }, p = async () => {
    o.value && s.switchRowEdit(o.value, !1, !0);
  }, a = async () => {
    o.value && s.switchRowEdit(o.value, !1, !1);
  }, u = () => {
    const h = i.value && s.state.rows[s.state.rows.length - 1].showRowEdit;
    return [y("div", {
      class: "row-edit-popover__placeholder",
      style: {
        display: h ? "block" : "none"
      }
    }, null), y(S("iBizRowEditPopover"), {
      ref: (n) => {
        e = n;
      },
      style: c,
      show: i.value,
      onConfirm: p,
      onCancel: a
    }, null)];
  };
  return s.evt.on("onRowEditChange", (h) => {
    h.row.showRowEdit ? setTimeout(() => {
      d(h.row);
    }, 0) : (o.value = void 0, i.value = !1, Object.assign(c, {
      top: void 0,
      left: void 0
    }));
  }), {
    renderPopover: u
  };
}
class Qe extends ve {
  constructor() {
    super(...arguments);
    /**
     * 是否默认展开所有
     *
     * @type {boolean}
     * @memberof NumberTreeGridController
     */
    x(this, "defaultExpandAll", !1);
    /**
     * 指定展开列下标
     *
     * @type {boolean}
     * @memberof NumberGridController
     */
    x(this, "expandColumnIndex");
  }
  get overflowMode() {
    return "ellipsis";
  }
  initState() {
    super.initState(), this.state.nodeLoadedMap = /* @__PURE__ */ new Map(), this.state.tableKey = "";
    const e = "SHOW_MODE_".concat(this.context.project, "_").concat(this.view.model.codeName), i = localStorage.getItem(e);
    i === "tree" ? this.state.showTreeGrid = !0 : i === "grid" && (this.state.showTreeGrid = !1);
  }
  /**
   * 设置排序
   */
  setSort(e, i) {
    if (!e && !i)
      return;
    let o;
    e && (o = this.fieldIdNameMap.get(e).toLowerCase()), o && i ? this.state.sortQuery = "".concat(o, ",").concat(i) : this.state.sortQuery = "", this.setSortCache();
  }
  /**
   * 设置排序缓存
   */
  setSortCache() {
    this.view && (this.state.sortQuery ? localStorage.setItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort"),
      this.state.sortQuery
    ) : localStorage.removeItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
    ));
  }
  /**
   * 获取请求过滤参数（整合了视图参数，各种过滤条件，排序，分页）
   */
  async getFetchParams(e) {
    const { curPage: i, size: o, sortQuery: c, noSort: l } = this.state, d = {
      ...this.params
    };
    if (o && (d.page = i - 1, d.size = o), !l)
      if (c)
        d.sort = c;
      else {
        const { minorSortAppDEFieldId: p, minorSortDir: a } = this.getSortModel();
        if (this.view && localStorage.getItem("".concat(this.view.model.id, ".").concat(this.model.name, ".sort")))
          this.state.sortQuery = localStorage.getItem(
            "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
          );
        else if (p && a) {
          const u = this.fieldIdNameMap.get(p);
          this.state.sortQuery = "".concat(u.toLowerCase(), ",").concat(a.toLowerCase());
        }
        d.sort = this.state.sortQuery, this.setSortCache();
      }
    return await this.evt.emit("onBeforeLoad", void 0), Object.assign(d, {
      ...this.state.searchParams
    }), e && Object.assign(d, e), d;
  }
  /**
   * 切换显示模式
   *
   * @param {IData} param
   * @memberof NumberTreeGridController
   */
  async switchShowMode(e) {
    const { showMode: i } = e;
    i && (i === "tree" ? this.state.showTreeGrid = !0 : i === "grid" && (this.state.showTreeGrid = !1), this.state.nodeLoadedMap.clear(), await this.load());
  }
  /**
   * 初始化方法
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async onCreated() {
    await super.onCreated();
    const { ctrlParams: e = {} } = this.model.controlParam;
    e.DEFAULTEXPANDALL && (this.defaultExpandAll = Object.is(e.DEFAULTEXPANDALL, "TRUE") || Object.is(e.DEFAULTEXPANDALL, "true")), e.GRIDROWACTIVEMODE && (this.state.mdctrlActiveMode = JSON.parse(e.GRIDROWACTIVEMODE)), e.EXPANDCOLUMNINDEX && (this.expandColumnIndex = e.EXPANDCOLUMNINDEX);
  }
  /**
   * 获取变化的数据
   *
   * @param {IData[]} originalArray
   * @param {IData[]} updatedArray
   * @return {*}  {{ added: IData[]; removed: IData[] }}
   * @memberof NumberTreeGridController
   */
  findChanges(e, i) {
    const o = [], c = [], l = [], d = /* @__PURE__ */ new Map();
    e.forEach((a) => d.set(a.srfkey, a)), i.forEach((a) => {
      d.has(a.srfkey) || o.push(a);
    });
    const p = /* @__PURE__ */ new Map();
    return i.forEach((a) => p.set(a.srfkey, a)), e.forEach((a) => {
      p.has(a.srfkey) || c.push(a);
    }), e.forEach((a) => {
      const u = i.find((h) => h.srfkey === a.srfkey);
      a && u && a[this.treeGridParentField] !== u[this.treeGridParentField] && (l.push(a), l.push(u));
    }), { added: o, removed: c, changed: l };
  }
  /**
   * 刷新
   *
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async refresh(e = !1) {
    const i = [...this.state.items];
    await this.load({ isInitialLoad: e });
    const { added: o, removed: c, changed: l } = this.findChanges(
      i,
      this.state.items
    );
    [...o, ...c, ...l].forEach((d) => {
      const p = this.state.items.find(
        (a) => d[this.treeGridParentField] && a[this.treeGridValueField] === d[this.treeGridParentField]
      );
      p && this.state.nodeLoadedMap.has(p.tempsrfkey) && this.evt.emit("onReloadParentNode", {
        node: d
      });
    });
  }
  /**
   * 部件加载数据行为
   *
   * @param {MDCtrlLoadParams} [args={}]
   * @return {*}  {Promise<IData[]>}
   * @memberof NumberTreeGridController
   */
  async load(e = {}) {
    if (this.state.isSimple)
      return [];
    const i = e.silent === !0;
    i || await this.startLoading();
    try {
      const o = e.isInitialLoad === !0, c = e.isLoadMore === !0;
      o ? this.state.curPage = 1 : c && (this.state.curPage += 1);
      const { context: l } = this.handlerAbilityParams(e), d = await this.getFetchParams(e == null ? void 0 : e.viewParam);
      d != null && d.hasOwnProperty("srfshowmode") || this.state.showTreeGrid && Object.assign(d, {
        srfshowmode: "tree"
      });
      const p = await this.service.fetch(l, d);
      typeof p.total == "number" && (this.state.total = p.total), typeof p.totalPages == "number" && (this.state.totalPages = p.totalPages), c ? this.state.items.push(...p.data) : this.state.items = p.data, await this.afterLoad(e, p.data), this.state.isLoaded = !0, await this.evt.emit("onLoadSuccess", {
        isInitialLoad: o
      });
    } catch (o) {
      throw await this.evt.emit("onLoadError", void 0), this.actionNotification("FETCHERROR", {
        error: o
      }), o;
    } finally {
      i || await this.endLoading();
    }
    return this.state.items.forEach((o, c) => {
      o.srfserialnum = c + 1;
    }), this.actionNotification("FETCHSUCCESS"), e.isInitialLoad === !0 && (this.state.tableKey = Y()), this.state.items;
  }
  /**
   * 部件加载后处理
   *
   * @param {MDCtrlLoadParams} args
   * @param {ControlVO[]} items
   * @return {*}  {Promise<ControlVO[]>}
   * @memberof NumberTreeGridController
   */
  async afterLoad(e, i) {
    if (await super.afterLoad(e, i), e.isInitialLoad === !0)
      this.state.selectedData = [];
    else {
      const c = this.state.selectedData.filter(
        (l) => this.state.items.find((d) => l.tempsrfkey === d.tempsrfkey)
      );
      this.state.selectedData = c;
    }
    return i;
  }
  /**
   * 保存
   *
   * @param {ControlVO} data
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async save(e) {
    if (this.state.isSimple)
      return;
    const i = e.srfuf === _.CREATE, o = this.findRowState(e);
    if (!o)
      throw new I("行数据不存在");
    if (!o.modified) {
      ibiz.log.debug("值没有发生改变");
      return;
    }
    if (o.processing) {
      await Me(500, this.save.bind(this), [e]);
      return;
    }
    if (!await this.validate(o))
      throw new I("行数据校验不通过，保存取消");
    let l;
    const d = Se(this.model.appDataEntityId), p = this.context.clone();
    p[d] = e.srfkey;
    try {
      l = i ? await this.service.create(p, e) : await this.service.update(p, e);
    } catch (u) {
      throw i && await this.remove({ data: [e], silent: !0 }), await this.evt.emit("onSaveError", void 0), this.actionNotification("".concat(i ? "CREATE" : "UPDATE", "ERROR"), {
        error: u,
        data: o.data
      }), u;
    }
    const a = this.findRowStateIndex(e);
    this.state.items.splice(a, 1, l.data), o.data = l.data, o.oldData = l.data.clone(), o.modified = !1, i && this.evt.emit("onReloadParentNode", { node: l.data }), this.gridStateNotify(o, q.SAVE), await this.updateRows(this.state.rows), await this.evt.emit("onSaveSuccess", void 0);
  }
  afterRemove(e) {
    const i = this.state.items.findIndex(
      (c) => c.srfkey === e.srfkey
    );
    i !== -1 && this.state.items.splice(i, 1);
    const o = this.findRowStateIndex(e);
    this.state.rows.splice(o, 1), this.state.groups.forEach((c) => {
      if (c.children.length) {
        const l = c.children.findIndex(
          (d) => d.srfkey === e.srfkey
        );
        l !== -1 && c.children.splice(l, 1);
      }
    }), this.evt.emit("onReloadParentNode", { node: e });
  }
  /**
   * 新建行
   *
   * @param {MDCtrlLoadParams} [args={}]
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async newRow(e = {}) {
    const { data: i } = e, { editShowMode: o } = ibiz.config.grid;
    let c = {};
    if (i && (c = Array.isArray(i) ? i[0] : i), o === "row" && this.state.rows.find((n) => n.showRowEdit))
      throw new I("请先完成当前行编辑中的行的操作");
    const l = { ...this.params }, d = this.calcDefaultValue(c || {}, !0);
    c.srfDefaultData && Object.assign(d, c.srfDefaultData), Object.assign(l, d);
    let p;
    try {
      p = await this.service.getDraft(this.context, l);
    } catch (h) {
      throw this.actionNotification("GETDRAFTERROR", {
        error: h
      }), h;
    }
    const a = p.data;
    Ae(a, d), a[this.treeGridParentField] = c[this.treeGridValueField], c.srfUserData && (a.srfUserData = c.srfUserData), this.state.items.push(a);
    const u = new K(a, this);
    this.state.rows.push(u), this.gridStateNotify(u, q.DRAFT), o === "row" && this.switchRowEdit(u, !0), this.evt.emit("onReloadParentNode", { node: a }), this.actionNotification("GETDRAFTSUCCESS", { data: a });
  }
  /**
   * 行单击事件
   *
   * @param {IData} data
   * @return {*}  {Promise<void>}
   * @memberof NumberTreeGridController
   */
  async onRowClick(e) {
    this.state.singleSelect && this.setSelection([e]), this.state.mdctrlActiveMode === 1 && await this.setActive(e);
  }
}
class je extends Ee {
  constructor() {
    super(...arguments);
    /**
     * 分组代码表数据项
     *
     * @type {readonly}
     * @memberof NumberGridController
     */
    x(this, "codeListItems");
    /**
     * 是否默认展开所有
     *
     * @type {boolean}
     * @memberof NumberGridController
     */
    x(this, "defaultExpandAll", !1);
  }
  initState() {
    super.initState(), this.state.tableKey = "";
  }
  /**
   * 初始化方法
   *
   * @memberof NumberGridController
   */
  async onCreated() {
    await super.onCreated();
    const { ctrlParams: e = {} } = this.model.controlParam;
    e.DEFAULTEXPANDALL && (this.defaultExpandAll = Object.is(e.DEFAULTEXPANDALL, "TRUE") || Object.is(e.DEFAULTEXPANDALL, "true"));
  }
  /**
   * 设置排序
   */
  setSort(e, i) {
    if (!e && !i)
      return;
    let o;
    e && (o = this.fieldIdNameMap.get(e).toLowerCase()), o && i ? this.state.sortQuery = "".concat(o, ",").concat(i) : this.state.sortQuery = "", this.setSortCache();
  }
  /**
   * 设置排序缓存
   */
  setSortCache() {
    this.view && (this.state.sortQuery ? localStorage.setItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort"),
      this.state.sortQuery
    ) : localStorage.removeItem(
      "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
    ));
  }
  /**
   * 获取请求过滤参数（整合了视图参数，各种过滤条件，排序，分页）
   */
  async getFetchParams(e) {
    const { curPage: i, size: o, sortQuery: c, noSort: l } = this.state, d = {
      ...this.params
    };
    if (o && (d.page = i - 1, d.size = o), !l)
      if (c)
        d.sort = c;
      else {
        const { minorSortAppDEFieldId: p, minorSortDir: a } = this.getSortModel();
        if (this.view && localStorage.getItem("".concat(this.view.model.id, ".").concat(this.model.name, ".sort")))
          this.state.sortQuery = localStorage.getItem(
            "".concat(this.view.model.id, ".").concat(this.model.name, ".sort")
          );
        else if (p && a) {
          const u = this.fieldIdNameMap.get(p);
          this.state.sortQuery = "".concat(u.toLowerCase(), ",").concat(a.toLowerCase());
        }
        d.sort = this.state.sortQuery, this.setSortCache();
      }
    return await this._evt.emit("onBeforeLoad", void 0), Object.assign(d, {
      ...this.state.searchParams
    }), e && Object.assign(d, e), d;
  }
  /**
   * 初始化表格分组
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof NumberGridController
   */
  async initGroup() {
    const { groupCodeListId: e, groupMode: i, enableGroup: o } = this.model;
    if (o && i === "CODELIST") {
      if (!e)
        throw new Fe(
          this.model,
          "代码表分组模式需要配置代码表"
        );
      const c = ibiz.hub.getApp(this.context.srfappid);
      this.codeListItems = await c.codeList.get(
        e,
        this.context,
        this.params
      );
    }
  }
  /**
   * 计算分组数据
   *
   * @protected
   * @param {IData[]} items
   * @memberof NumberGridController
   */
  calcGroupData(e) {
    const { enableGroup: i, groupMode: o, groupAppDEFieldId: c } = this.model;
    if (i && c) {
      const l = /* @__PURE__ */ new Map(), d = o === "CODELIST", p = c.toLowerCase();
      d && this.codeListItems.forEach((a) => {
        l.set(a.value, []);
      }), e.forEach((a) => {
        const u = a[p];
        !d && !l.has(u) && l.set(u, []), l.has(u) && l.get(u).push(a);
      }), this.state.groups = [], l.forEach((a, u) => {
        var n;
        const h = (n = this.codeListItems) == null ? void 0 : n.find(
          (f) => f.value === u
        );
        this.state.groups.push({
          caption: (h == null ? void 0 : h.text) || "".concat(u || "其他"),
          groupIcon: h == null ? void 0 : h.sysImage,
          key: u,
          children: a
        });
      });
    }
  }
  async afterLoad(e, i) {
    if (await super.afterLoad(e, i), e.isInitialLoad === !0)
      this.state.selectedData = [];
    else {
      const c = this.state.selectedData.filter(
        (l) => this.state.items.find((d) => l.tempsrfkey === d.tempsrfkey)
      );
      this.state.selectedData = c;
    }
    return i;
  }
  /**
   * 表格行单击
   *
   * @param {IData} data
   * @return {*}  {Promise<void>}
   * @memberof NumberGridController
   */
  async onRowClick(e) {
    this.state.singleSelect && this.setSelection([e]), this.state.mdctrlActiveMode === 1 && await this.setActive(e);
  }
}
function Ve(t, s) {
  var i;
  const e = {};
  return (i = t.controlAttributes) == null || i.forEach((o) => {
    o.attrName && o.attrValue && (e[o.attrName] = De.execSingleLine(o.attrValue, {
      ...s
    }));
  }), e;
}
function He(t, s, e, i) {
  var g;
  const {
    codeName: o
  } = s, c = t.columns[o], l = t.state.columnStates.find((w) => w.key === o), d = e.find((w) => t.columns[w.codeName].isAdaptiveColumn), a = c.isAdaptiveColumn || !d && i === e.length - 1 ? "min-width" : "width";
  let u = "default";
  t != null && t.expandColumnIndex && i < ke(t == null ? void 0 : t.expandColumnIndex) && (u = "");
  let {
    width: h
  } = s;
  const {
    hideHeader: n
  } = t.model;
  t.model.enableCustomized && !n && h && i === e.length - 1 && (h += 20);
  const f = (l == null ? void 0 : l.columnWidth) || h;
  return y(S("el-table-column"), J({
    label: s.caption,
    prop: o
  }, {
    [a]: f
  }, {
    fixed: l.fixed,
    sortable: s.enableSort ? "custom" : !1,
    align: ((g = s.align) == null ? void 0 : g.toLowerCase()) || "center",
    type: u
  }), {
    default: ({
      row: w
    }) => {
      const v = w;
      if (w.isGroupData)
        return i !== 0 ? null : y("div", {
          class: "group-column"
        }, [y(S("iBizIcon"), {
          class: "group-icon",
          icon: w.groupIcon
        }, null), w.caption]);
      const R = t.findRowState(v);
      if (R) {
        const L = S(t.providers[o].component);
        return Le(L, {
          controller: c,
          row: R,
          key: v.tempsrfkey + o,
          attrs: Ve(s, {
            ...t.getEventArgs(),
            data: R.data
          })
        });
      }
      return y("div", null, null);
    }
  });
}
function Z(t, s, e, i) {
  var o, c;
  if (s.columnType === "GROUPGRIDCOLUMN") {
    const l = ((o = s.degridColumns) == null ? void 0 : o.filter((a) => !a.hideDefault)) || [], {
      width: d
    } = s, p = ((c = s.align) == null ? void 0 : c.toLowerCase()) || "center";
    return y(S("el-table-column"), {
      prop: s.codeName,
      label: s.caption,
      "min-width": d,
      align: p
    }, {
      default: () => l.map((a, u) => Z(t, a, e, u))
    });
  }
  return He(t, s, e, i);
}
const z = /* @__PURE__ */ Ge({
  name: "IBizNumberGridControl",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    context: {
      type: Object,
      required: !0
    },
    params: {
      type: Object,
      default: () => ({})
    },
    provider: {
      type: Object
    },
    mdctrlActiveMode: {
      type: Number,
      default: void 0
    },
    singleSelect: {
      type: Boolean,
      default: void 0
    },
    rowEditOpen: {
      type: Boolean,
      default: void 0
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    data: {
      type: Array,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup(t) {
    let s;
    (() => {
      t.modelData.controlType === "TREEGRID" ? s = X((...r) => new Qe(...r)) : s = X((...r) => new je(...r));
    })();
    const {
      zIndex: i
    } = ye();
    s.state.zIndex = i.increment();
    const o = $("control-grid"), c = G(() => {
      if (t.modelData.controlType === "TREEGRID")
        return $("control-".concat(s.model.controlType.toLowerCase()));
    }), l = $("number-grid"), {
      tableData: d,
      renderColumns: p,
      defaultSort: a,
      summaryMethod: u,
      headerDragend: h
    } = _e(s, t), {
      tableRef: n,
      treeGirdData: f,
      treeNodeData: g,
      curSelectedData: w,
      onRowClick: v,
      onDbRowClick: R,
      onSortChange: L,
      isSelected: B,
      getSelection: U,
      handleRowClassName: ee,
      handleHeaderCellClassName: te
    } = ze(s), {
      onPageChange: se,
      onPageRefresh: oe,
      onPageSizeChange: ie
    } = Be(s), F = G(() => t.modelData.controlType === "TREEGRID" ? s.state.showTreeGrid : !1), Q = (r = 0) => {
      setTimeout(() => {
        if (n.value) {
          const m = n.value.$el.getElementsByClassName("el-table__row");
          let C = 0;
          m.forEach((b) => {
            const E = b.firstChild.getElementsByClassName("ibiz-number-grid__number--caption")[0];
            b.style.display !== "none" && E && (E.innerText = "".concat((s.state.curPage - 1) * s.state.size + (C + 1)), C++);
          });
        }
      }, r);
    }, ae = (r, m) => {
      Q();
    };
    xe(() => {
      const {
        controlType: r,
        enableGroup: m
      } = s.model;
      s.evt.on("onLoadSuccess", () => {
        (r === "TREEGRID" || r === "GRID" && m) && Q();
      });
    }), A(() => F.value, (r, m) => {
      r !== m && (w.value = [], s.setSelection([]));
    });
    const ne = () => {
      const r = [...f.value], m = (C) => {
        const b = s.state.items.filter((E) => E[s.treeGridParentField] && C[s.treeGridValueField] === E[s.treeGridParentField]);
        b.length > 0 && (r.push(...b), b.forEach((E) => {
          m(E);
        }));
      };
      return f.value.forEach((C) => {
        m(C);
      }), r;
    }, j = () => {
      let r = [];
      return F.value ? r = ne() : (r = [...d.value], s.model.enableGroup && d.value.forEach((m) => {
        r.push(...m._children);
      })), r;
    }, O = () => {
      const r = j();
      let m = !1;
      return r.length > 0 && (m = r.filter((b) => !B(b)).length === 0), m;
    }, re = () => {
      const r = j(), m = w.value.filter((C) => !r.find((b) => b.tempsrfkey === C.tempsrfkey));
      O() || m.push(...r), w.value = m, s.setSelection(U());
    }, le = (r, m) => {
      const {
        controlType: C,
        enableGroup: b
      } = s.model, E = r.findIndex((D) => D.tempsrfkey === m.tempsrfkey);
      E !== -1 ? (r.splice(E, 1), C === "GRID" && b && (W(m._children) ? m._children.forEach((D) => {
        const P = r.indexOf(D);
        P !== -1 && r.splice(P, 1);
      }) : d.value.forEach((D) => {
        const P = D._children.find((N) => !r.includes(N)), k = r.findIndex((N) => N.tempsrfkey === D.tempsrfkey);
        P && k !== -1 && r.splice(k, 1);
      }))) : (r.push(m), C === "GRID" && b && (W(m._children) ? m._children.forEach((D) => {
        r.indexOf(D) === -1 && r.push(D);
      }) : d.value.forEach((D) => {
        const P = D._children.find((N) => !r.includes(N)), k = r.findIndex((N) => N.tempsrfkey === D.tempsrfkey);
        !P && k === -1 && r.unshift(D);
      })));
    }, de = (r) => {
      le(w.value, r), s.setSelection(U());
    }, ce = (r) => {
      r.stopPropagation();
    }, V = (r, m, C) => {
      s.state.nodeLoadedMap.has(r.tempsrfkey) || s.state.nodeLoadedMap.set(r.tempsrfkey, {
        tree: r,
        treeNode: m,
        resolve: C
      });
      const b = g.value.filter((E) => r[s.treeGridValueField] === E[s.treeGridParentField]);
      r._children = b, C(b);
    }, ue = (r) => {
      if (s.state.nodeLoadedMap.has(r.tempsrfkey)) {
        const m = s.state.nodeLoadedMap.get(r.tempsrfkey);
        V(m.tree, m.treeNode, m.resolve);
      } else
        setTimeout(() => {
          n.value.store.loadOrToggle(r);
        }, 0);
    };
    s.evt.on("onReloadParentNode", (r) => {
      const m = g.value.find((C) => r.node[s.treeGridParentField] && C[s.treeGridValueField] === r.node[s.treeGridParentField]);
      if (m)
        if (m._hasChildren)
          ue(m);
        else {
          n.value.toggleRowExpansion(m, !1);
          const C = n.value.store.states.lazyTreeNodeMap.value;
          delete C[m.tempsrfkey];
        }
    });
    const he = () => {
      var m;
      const {
        isLoaded: r
      } = s.state;
      if (r) {
        const C = (m = s.model.controls) == null ? void 0 : m.find((b) => b.name === "".concat(s.model.name, "_quicktoolbar"));
        return C ? y(S("iBizToolbarControl"), {
          modelData: C,
          context: s.context,
          params: s.params,
          class: o.b("quick-toolbar")
        }, null) : y(S("iBizNoData"), {
          text: s.model.emptyText,
          emptyTextLanguageRes: s.model.emptyTextLanguageRes
        }, null);
      }
      return null;
    }, {
      renderPopover: fe
    } = Ue(n, s), me = () => {
      var m;
      const r = (m = s.model.controls) == null ? void 0 : m.find((C) => C.name === "".concat(s.model.name, "_batchtoolbar"));
      if (!(!r || s.state.singleSelect))
        return y("div", {
          class: [o.b("batch-toolbar"), l.b("batch-toolbar"), o.is("show", s.state.selectedData.length > 0)]
        }, [y("div", {
          class: o.b("batch-toolbar-content")
        }, [y("div", {
          class: o.b("batch-toolbar-text")
        }, [T("已选中"), s.state.selectedData.length, T("项")]), y("div", {
          class: o.b("batch-toolbar-separator")
        }, [T("|")]), y(S("iBizToolbarControl"), {
          modelData: r,
          context: s.context,
          params: s.params,
          class: o.b("batch-toolbar-items")
        }, null)])]);
    }, pe = () => {
      const r = p.value.length ? "width" : "min-width";
      return y(S("el-table-column"), J({
        "class-name": l.e("first-column")
      }, {
        [r]: 80
      }, {
        align: "center",
        fixed: "left",
        type: "index"
      }), {
        header: () => y("div", {
          class: l.e("number")
        }, [s.state.singleSelect ? y("span", null, [T("序号")]) : y(S("el-checkbox"), {
          size: "large",
          indeterminate: s.state.selectedData.length > 0 && !O(),
          modelValue: O(),
          onChange: () => re()
        }, null)]),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        default: ({
          row: m,
          column: C,
          $index: b
        }) => {
          const E = (s.state.curPage - 1) * s.state.size + (b + 1);
          return y("div", {
            class: [l.e("number"), l.is("multiple", !s.state.singleSelect), l.is("single", s.state.singleSelect)],
            onClick: (H) => ce(H)
          }, [y("span", {
            class: l.em("number", "caption")
          }, [E]), !s.state.singleSelect && y(S("el-checkbox"), {
            size: "large",
            class: l.em("number", "checkbox"),
            modelValue: B(m),
            onChange: () => de(m)
          }, null)]);
        }
      });
    };
    return Ie(() => {
      i.decrement();
    }), {
      c: s,
      ns: o,
      ns2: c,
      ns3: l,
      tableRef: n,
      tableData: d,
      treeGirdData: f,
      showTreeGrid: F,
      renderColumns: p,
      defaultSort: a,
      loadData: V,
      onDbRowClick: R,
      onRowClick: v,
      onExpandChange: ae,
      onSortChange: L,
      onPageChange: se,
      onPageSizeChange: ie,
      onPageRefresh: oe,
      handleRowClassName: ee,
      handleHeaderCellClassName: te,
      renderNoData: he,
      summaryMethod: u,
      headerDragend: h,
      renderPopover: fe,
      renderBatchToolBar: me,
      renderFirstColumn: pe
    };
  },
  render() {
    var i;
    if (!this.c.state.isCreated)
      return;
    const {
      state: t
    } = this.c, {
      hideHeader: s,
      enablePagingBar: e
    } = this.c.model;
    return y(S("iBizControlBase"), {
      class: [this.ns.b(), (i = this.ns2) == null ? void 0 : i.b(), this.ns3.b(), this.ns.is("show-header", !s), this.ns.is("enable-page", e), this.ns.is("enable-group", this.c.model.enableGroup), this.ns.is("single-select", t.singleSelect), this.ns.is("enable-customized", this.c.model.enableCustomized)],
      controller: this.c
    }, {
      default: () => [y(S("el-table"), {
        border: !0,
        ref: "tableRef",
        "row-key": "tempsrfkey",
        class: this.ns.e("table"),
        key: t.tableKey,
        "default-sort": this.defaultSort,
        "show-header": !s,
        "show-summary": this.c.enableAgg,
        "summary-method": this.summaryMethod,
        "highlight-current-row": t.singleSelect,
        "row-class-name": this.handleRowClassName,
        "header-cell-class-name": this.handleHeaderCellClassName,
        data: this.showTreeGrid ? this.treeGirdData : this.tableData,
        onRowClick: this.onRowClick,
        onRowDblclick: this.onDbRowClick,
        onSortChange: this.onSortChange,
        onExpandChange: this.onExpandChange,
        onHeaderDragend: this.headerDragend,
        "tooltip-effect": "light",
        "default-expand-all": this.c.defaultExpandAll,
        "tree-props": {
          children: "_children",
          hasChildren: "_hasChildren"
        },
        load: this.loadData,
        lazy: this.showTreeGrid
      }, {
        empty: this.renderNoData,
        default: () => [this.renderFirstColumn(), this.renderColumns.map((o, c) => Z(this.c, o, this.renderColumns, c))],
        append: () => this.renderPopover()
      }), e && y(S("iBizPagination"), {
        total: t.total,
        curPage: t.curPage,
        size: t.size,
        totalPages: t.totalPages,
        onChange: this.onPageChange,
        onPageSizeChange: this.onPageSizeChange,
        onPageRefresh: this.onPageRefresh
      }, null), this.c.model.enableCustomized && !s && y("div", {
        class: [this.ns.b("setting-box"), this.ns3.b("setting-box")]
      }, [y(S("iBizGridSetting"), {
        columnStates: t.columnStates,
        controller: this.c
      }, null)]), this.renderBatchToolBar()]
    });
  }
}), Xe = Ce(
  z,
  (t) => {
    t.component(z.name, z), Re(
      "GRID_RENDER_NUMBER_GRID",
      () => new $e()
    );
  }
), st = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(t) {
    t.use(Xe);
  }
};
export {
  Xe as IBizNumberGridControl,
  st as default
};
