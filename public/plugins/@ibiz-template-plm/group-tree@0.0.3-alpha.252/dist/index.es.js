import './style.css';
var _e = Object.defineProperty;
var ge = (e, m, n) => m in e ? _e(e, m, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[m] = n;
var R = (e, m, n) => (ge(e, typeof m != "symbol" ? m + "" : m, n), n);
import { TreeController as De, getChildNodeRSs as Ie, calcDeCodeNameById as U, handleAllSettled as ve, Srfuf as Ee, getControlPanel as we, registerControlProvider as xe } from "@ibiz-template/runtime";
import { useControlController as be, useNamespace as ne, withInstall as Ce } from "@ibiz-template/vue3-util";
import { ref as B, defineComponent as Te, computed as oe, reactive as Me, watch as ie, nextTick as ke, resolveComponent as I, onMounted as Re, onUnmounted as Se, withDirectives as Ae, createVNode as h, resolveDirective as Oe, isVNode as Be, createTextVNode as ae } from "vue";
import { createUUID as se } from "qx-util";
import { debounce as de } from "lodash-es";
import { RuntimeError as P, RuntimeModelError as re, recursiveIterate as Ke } from "@ibiz-template/core";
import { isNil as le } from "ramda";
function E(e, m) {
  const n = m.state.items.find((o) => o._id === e);
  return n || m.state.items.find((o) => o._uuid === e);
}
function Fe(e, m) {
  const n = () => {
    const s = e.value;
    if (!s)
      throw new P("找不到el-tree实例对象");
    return s;
  }, o = () => {
    var f;
    const s = e.value;
    if (!s) {
      setTimeout(() => {
        o();
      }, 200);
      return;
    }
    Object.values(s.store.nodesMap).forEach((l) => {
      const y = m.state.expandedKeys.includes(l.data._id);
      y !== l.expanded && (y ? l.expand() : l.collapse());
    }), m.state.singleSelect ? e.value.setCurrentKey(((f = m.state.selectedData[0]) == null ? void 0 : f._id) || void 0) : s.setCheckedKeys(m.state.selectedData.map((l) => l._id));
  }, d = de(o, 500);
  return { getTreeInstance: n, updateUI: d, triggerNodeExpand: (s) => {
    const f = n(), l = f == null ? void 0 : f.store.nodesMap[s];
    if (l)
      return l.expanded ? (l.collapse(), !1) : (l.expand(), !0);
  } };
}
function Pe(e) {
  switch (e) {
    case "inner":
      return "inner";
    case "before":
      return "prev";
    case "after":
      return "next";
    default:
      throw new P("暂不支持dropType:".concat(e));
  }
}
class ze extends De {
  constructor() {
    super(...arguments);
    /**
     * 底部工具栏
     *
     * @type {(IControl | undefined)}
     * @memberof GroupTreeController
     */
    R(this, "bottomToolbar");
    /**
     * 隐藏节点id
     *
     * @type {string}
     * @memberof GroupTreeController
     */
    R(this, "hiddenNodeId", "");
    /**
     * 绘制模式
     *
     * @type {('tree' | 'listTree')}
     * @memberof GroupTreeController
     */
    R(this, "renderMode", "tree");
    /**
     * 是否正在过滤
     *
     * @memberof GroupTreeController
     */
    R(this, "isFilter", B(!1));
  }
  /**
   * 重新初始化
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof GroupTreeController
   */
  async onCreated() {
    var d;
    await super.onCreated();
    const n = ((d = this.view.model.viewLayoutPanel) == null ? void 0 : d.controls) || [];
    this.bottomToolbar = n.find((a) => a.name === "toolbar");
    const { ctrlParams: o = {} } = this.model.controlParam;
    o.HIDDENNODEID && (this.hiddenNodeId = o.HIDDENNODEID), o.RENDERMODE && (this.renderMode = o.RENDERMODE);
  }
  initState() {
    super.initState(), this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null, this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   *  初始化节点拖入关系处理
   */
  initDropNodeRss() {
    var n;
    (n = this.model.detreeNodes) == null || n.forEach((o) => {
      if (!o.allowDrop)
        return;
      const d = [];
      Ie(this.model, {
        parentId: o.id,
        hasQuery: !1
      }).forEach((s) => {
        var f;
        if ((f = s.parentDER1N) != null && f.pickupDEFName) {
          const l = this.getNodeModel(s.childDETreeNodeId);
          (l == null ? void 0 : l.treeNodeType) === "DE" && l.appDataEntityId && d.push({
            minorEntityId: l.appDataEntityId,
            pickupDEFName: s.parentDER1N.pickupDEFName.toLowerCase(),
            childDETreeNodeId: s.childDETreeNodeId,
            detreeNodeRSParams: s.detreeNodeRSParams
          });
        }
      }), d.length > 0 && this.dropNodeRss.set(o.id, d);
    });
  }
  /**
   * 编辑指定节点的文本
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  updateTreeNode({
    nodeKey: n,
    defaultValue: o
  }) {
    const d = this.context.srfreadonly === !0 || this.context.srfreadonly === "true";
    if (!n || n === this.state.editingNodeKey || d)
      return;
    const a = E(n, this), s = this.getNodeModel(a._nodeId);
    s != null && s.allowEditText && (this.state.editingNodeKey = a._id, this.state.editingNodeText = a._text, this.state.editingNodeDefault = o, this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null);
  }
  /**
   * 删除指定节点
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  removeTreeNode(n) {
    if (!n || n === this.state.editingNodeKey)
      return;
    const o = E(n, this), d = {
      context: this.context || {},
      params: this.params || {},
      data: [o]
    };
    this.onRemoveTreeNode(d);
  }
  /**
   * 新建树节点
   * @author ljx
   * @date 2023-12-27 05:46:02
   * @return {*}  {void}
   */
  newTreeNode({
    nodeType: n,
    defaultValue: o = {}
  }) {
    const d = this.getNodeModel(n);
    this.state.newingNodeModel = d, this.state.newingNodeDefault = o, this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   * 创建实体节点数据
   * @author ljx
   * @date 2023-12-27 04:19:36
   * @protected
   * @param {ITreeNodeData[]} nodeDatas 节点数据集合
   * @return {*}  {Promise<void>}
   */
  async createDeNodeData(n) {
    const o = ibiz.hub.getApp(this.context.srfappid);
    await Promise.all(
      n.map(async (d) => {
        const a = this.getNodeModel(d._nodeId), s = d._deData, f = this.context.clone(), l = await o.deService.exec(
          a.appDataEntityId,
          "create",
          f,
          s
        );
        this.emitDEDataChange("create", l.data), l.data && this.refresh();
      })
    );
  }
  /**
   * 创建树节点
   * @author ljx
   * @date 2023-12-27 04:32:52
   * @return {*}  {Promise<void>}
   */
  async onCreateTreeNode() {
    const { textAppDEFieldId: n, id: o } = this.state.newingNodeModel, d = this.state.newingNodeText, a = { _deData: {} };
    Object.assign(a, { _nodeId: o, _text: d }), Object.assign(a._deData, { [n]: d }), this.state.newingNodeDefault && Object.assign(a._deData, this.state.newingNodeDefault), Object.assign(a._deData, { [n]: d }), await this.createDeNodeData([a]), this.state.newingNodeModel = null, this.state.newingNodeText = null, this.state.newingNodeDefault = null;
  }
  /**
   * 修改节点文本
   * @param nodeData 节点数据
   * @param _text 节点文本
   */
  async onModifyTreeNode(n, o) {
    const d = this.getNodeModel(n._nodeId);
    if (!d.allowEditText)
      throw new re(d, "树节点没有配置编辑模式：名称");
    if (n._nodeType !== "DE")
      throw new P("不是实体树节点数据");
    if (n._text !== o) {
      if (n._text = o, this.state.editingNodeDefault) {
        const a = Object.keys(this.state.editingNodeDefault);
        a && a.length > 0 && a.forEach((s) => {
          le(n._deData[s]) && (n._deData[s] = this.state.editingNodeDefault[s]);
        });
      }
      await this.updateDeNodeData([n]);
    }
    this.state.editingNodeKey = null, this.state.editingNodeText = null, this.state.editingNodeDefault = null;
  }
  /**
   * 删除树节点
   * @param args 参数
   * @returns
   */
  async onRemoveTreeNode(n) {
    const { context: o, params: d, data: a } = this.handlerAbilityParams(n), s = this.getNodeModel(a[0]._nodeId);
    if ((n == null ? void 0 : n.silent) !== !0 && !await ibiz.confirm.error({
      title: "数据删除",
      desc: "确认删除数据？"
    }))
      return;
    await this._evt.emit("onBeforeRemove", void 0), await this.startLoading();
    let f = !1;
    try {
      const l = U(
        s.appDataEntityId
      );
      await ve(
        a.map(async (y) => {
          if (y.srfuf !== Ee.CREATE) {
            const g = o.clone();
            g[l] = y.srfkey, await ibiz.hub.getApp(s.appId).deService.exec(
              s.appDataEntityId,
              "remove",
              g,
              d
            ), f = !0;
          }
          this.afterRemove(y);
        })
      ), (n == null ? void 0 : n.silent) !== !0 && this.actionNotification("REMOVESUCCESS", {
        data: a,
        default: "数据[".concat(a.map((y) => y.srfmajortext).join("、"), "]删除成功!")
      }), f && !(n != null && n.notRefresh) && await this.refresh();
    } catch (l) {
      throw await this._evt.emit("onRemoveError", void 0), this.actionNotification("REMOVEERROR", {
        error: l,
        data: a
      }), l;
    } finally {
      await this.endLoading();
    }
    this.state.selectedData = [], await this._evt.emit("onRemoveSuccess", void 0), a.forEach((l) => {
      this.emitDEDataChange("remove", l._deData);
    });
  }
  /**
   * 计算是否允许拖入
   * @param draggingNode
   * @param dropNode
   * @param type
   * @returns
   */
  calcAllowDrop(n, o, d) {
    var l, y;
    let a = !0;
    if (Ke(
      { _children: [n] },
      (g) => {
        if (g._id === o._id)
          return a = !1, !0;
      },
      { childrenFields: ["_children"] }
    ), !a)
      return !1;
    const s = this.getNodeModel(n._nodeId), f = this.getNodeModel(o._nodeId);
    if (d === "inner")
      return !!this.findDropNodeRS(
        o._nodeId,
        s.appDataEntityId
      );
    if (s.appDataEntityId !== f.appDataEntityId)
      return !1;
    if (((l = n._parent) == null ? void 0 : l._id) === ((y = o._parent) == null ? void 0 : y._id)) {
      const g = this.getNodeModel(o._nodeId);
      return (g == null ? void 0 : g.allowOrder) === !0;
    }
    return o._parent ? o._parent && o._parent._id && this.getNodeModel(o._parent._nodeId).rootNode ? !0 : !!this.findDropNodeRS(
      o._parent._nodeId,
      s.appDataEntityId
    ) : !1;
  }
  /**
   * 处理节点拖入事件
   * @param draggingNode
   * @param dropNode
   * @param dropType
   */
  async onNodeDrop(n, o, d) {
    var K, S;
    d === "inner" && !o._leaf && o._children === void 0 && await this.expandNodeByKey([o._id]);
    const a = this.getNodeModel(n._nodeId), s = d === "inner" ? o : o._parent, f = d === "inner" || ((K = o._parent) == null ? void 0 : K._id) !== ((S = n._parent) == null ? void 0 : S._id);
    let l = this.getNodeModel(o._nodeId);
    const y = a.appDataEntityId !== l.appDataEntityId;
    let g = !1;
    if (this.getNodeModel(s._nodeId).rootNode && (g = !0), f || g) {
      const v = [];
      for (const D of this.dropNodeRss.values())
        v.push(
          ...D.filter((_) => (
            // 修复子关系情况，根上也存在当前实体数据
            _.minorEntityId === a.appDataEntityId
          ))
        );
      if (g && f)
        v && (v.forEach((D) => {
          n._deData[D.pickupDEFName] = null;
        }), l = this.getNodeModel(a.id));
      else {
        const D = this.findDropNodeRS(
          s._nodeId,
          a.appDataEntityId
        );
        D && (v && v.forEach((_) => {
          n._deData[_.pickupDEFName] = null;
        }), n._deData[D.pickupDEFName] = s._value, D.detreeNodeRSParams && D.detreeNodeRSParams.forEach((_) => {
          var M, C;
          _.name && _.value && ((M = n._deData) != null && M.hasOwnProperty(
            _.name.toLowerCase()
          )) && ((C = s._deData) != null && C.hasOwnProperty(_.value.toLowerCase())) && (n._deData[_.name.toLowerCase()] = s._deData[_.value.toLowerCase()]);
        }), l = this.getNodeModel(D.childDETreeNodeId));
      }
      this.state.expandedKeys = this.calcExpandedKeys([s]), await this.updateDeNodeData([n]);
    }
    if (d === "inner" || y)
      f && await this.refreshNodeChildren(n, !0), await this.refreshNodeChildren(s, !0);
    else {
      const { moveAppDEActionId: v, appDataEntityId: D, allowOrder: _ } = l;
      if (_) {
        if (!v)
          throw new re(
            this.model,
            ibiz.i18n.t("runtime.controller.common.md.noMoveDataCconfig")
          );
        const M = {
          srftargetkey: o.srfkey,
          srfmovetype: d === "prev" ? "MOVEBEFORE" : "MOVEAFTER"
        }, C = ibiz.hub.getApp(this.context.srfappid), F = U(D), A = this.context.clone();
        A[F] = n.srfkey, (await C.deService.exec(
          D,
          v,
          A,
          M
        )).ok && (this.emitDEDataChange("update", n._deData), f && await this.refreshNodeChildren(n, !0), await this.refreshNodeChildren(s));
      }
    }
    this.state.selectedData = [];
  }
  /**
   * 检测实体数据变更
   *
   * @author tony001
   * @date 2024-03-29 11:03:30
   * @protected
   * @param {IPortalMessage} msg
   * @return {*}  {void}
   */
  onDEDataChange(n) {
    var a;
    if (n.triggerKey === this.triggerKey)
      return;
    const o = n.data;
    if (n.subtype === "OBJECTCREATED") {
      ((a = this.model.detreeNodes) == null ? void 0 : a.find((f) => {
        if (f.appDataEntityId) {
          const l = U(f.appDataEntityId);
          if (o.srfdecodename === l)
            return !0;
        }
        return !1;
      })) && this.refresh();
      return;
    }
    const d = this.state.items.find(
      (s) => s._nodeType === "DE" && s._deData && s._deData.srfdecodename === o.srfdecodename && s._deData.srfkey === o.srfkey
    );
    d && this.doNextActive(() => this.refreshNodeChildren(d, !0), {
      key: "refresh".concat(d._id)
    });
  }
  async afterLoad(n, o) {
    return super.afterLoad(n, o);
  }
  /**
   * 重写节点点击事件
   *
   * @param {ITreeNodeData} nodeData
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof GroupTreeController
   */
  async onTreeNodeClick(n, o) {
    var a;
    const d = (a = this.contextMenuInfos[n._nodeId]) == null ? void 0 : a.clickTBUIActionItem;
    if (d)
      return this.doUIAction(
        d.uiactionId,
        n,
        o,
        d.appId
      );
    if (this.state.navigational) {
      const s = this.getNodeModel(n._nodeId);
      if (!(s != null && s.navAppViewId))
        return;
    }
    this.state.singleSelect && !n._disableSelect && this.setSelection([n]), this.state.mdctrlActiveMode === 1 && await this.setActive(n);
  }
  /**
   * 过滤节点
   *
   * @param {string} nodeTag
   * @memberof GroupTreeController
   */
  async changeTreeState(n) {
    n && n === "draft" ? (this.isFilter.value = !0, this.evt.emit("onFilterNode", { nodeTag: n })) : this.resetTreeState();
  }
  /**
   *  重置过滤状态
   *
   * @author tony001
   * @date 2024-04-12 15:04:44
   * @param {boolean} state
   */
  resetTreeState() {
    this.isFilter.value && (this.evt.emit("onResetSate", {}), this.isFilter.value = !1);
  }
  /**
   * 重写刷新
   *
   * @author tony001
   * @date 2024-04-12 15:04:53
   * @return {*}  {Promise<void>}
   */
  async refresh() {
    super.refresh(), this.resetTreeState();
  }
}
function Le(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !Be(e);
}
const V = /* @__PURE__ */ Te({
  name: "IBizGroupTreeControl",
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
    navigational: {
      type: Boolean,
      default: void 0
    },
    defaultExpandedKeys: {
      type: Array
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup() {
    const e = be((...t) => new ze(...t)), m = oe(() => e.context.srfreadonly === !0 || e.context.srfreadonly === "true"), n = Me({});
    e.evt.on("onCreated", () => {
      e.counter && e.counter.onChange((t) => {
        Object.assign(n, t);
      }, !0);
    });
    const o = ne("control-group-tree"), d = ne("control-".concat(e.model.controlType.toLowerCase())), a = B(null), s = B(null), f = B(""), l = B(null);
    ie(() => l.value, (t) => {
      t && t.$el.getElementsByTagName("input")[0].focus();
    });
    const y = async () => {
      if (e.state.editingNodeKey)
        if (e.state.editingNodeText) {
          const t = E(e.state.editingNodeKey, e);
          await e.onModifyTreeNode(t, e.state.editingNodeText);
        } else
          e.state.editingNodeKey = null;
      e.state.newingNodeText ? e.onCreateTreeNode() : e.state.newingNodeModel = null;
    }, g = async () => {
      e.state.editingNodeKey && (e.state.editingNodeKey = null), e.state.newingNodeModel && (e.state.newingNodeModel = null, e.state.newingNodeText = "");
    }, {
      updateUI: z,
      triggerNodeExpand: K
    } = Fe(a, e), S = (t) => t.map((i) => ({
      _id: i._id,
      _uuid: i._uuid,
      _leaf: i._leaf,
      _text: i._text
    }));
    e.evt.on("onAfterRefreshParent", (t) => {
      if (a.value) {
        const {
          parentNode: i,
          children: r
        } = t, u = S(r);
        a.value.updateKeyChildren(i._id, u), z();
      }
    }), e.evt.on("onAfterNodeDrop", (t) => {
      t.isChangedParent && (f.value = se());
    });
    const v = oe(() => e.state.isLoaded ? e.model.rootVisible ? e.state.rootNodes : e.state.rootNodes.reduce((t, i) => i._children ? t.concat(i._children) : t, []) : []);
    ie(v, (t, i) => {
      t !== i && (f.value = se());
    });
    const D = async (t, i) => {
      let r;
      if (t.level === 0)
        r = v.value, ibiz.log.debug("初始加载");
      else {
        const u = E(t.data._uuid, e);
        u._children ? (ibiz.log.debug("节点展开加载-本地", u), r = u._children) : (ibiz.log.debug("节点展开加载-远程", u), r = await e.loadNodes(u));
      }
      ibiz.log.debug("给树返回值", r), i(S(r)), z();
    };
    let _ = !1;
    e.evt.on("onLoadSuccess", () => {
      _ = !0, setTimeout(() => {
        _ = !1;
      }, 200);
    }), e.evt.on("onSelectionChange", async () => {
      var t;
      _ && await ke(), e.state.singleSelect ? a.value.setCurrentKey(((t = e.state.selectedData[0]) == null ? void 0 : t._id) || void 0) : a.value.setCheckedKeys(e.state.selectedData.map((i) => i._id));
    });
    const M = (t, i) => {
      const {
        checkedNodes: r
      } = i;
      e.setSelection(r);
    };
    let C = !1;
    const F = (t, i) => {
      var r, u, p;
      if (i.stopPropagation(), !t._disableSelect && !C) {
        if (((r = a.value) == null ? void 0 : r.getCurrentKey()) === t._id && !m.value) {
          const c = (u = a.value) == null ? void 0 : u.getCurrentKey();
          e.updateTreeNode({
            nodeKey: c,
            defaultValue: {}
          });
        }
        if (e.state.singleSelect || (p = a.value) == null || p.setCurrentKey(t._id), e.state.navigational) {
          const c = e.getNodeModel(t._nodeId);
          if (!(c != null && c.navAppViewId)) {
            const w = K(t._id);
            e.onExpandChange(t, w);
          }
        }
        e.onTreeNodeClick(t, i), C = !0, setTimeout(() => {
          C = !1;
        }, 200);
      }
    }, A = (t, i) => {
      i.stopPropagation(), !t._disableSelect && e.onDbTreeNodeClick(t);
    };
    let T;
    e.evt.on("onMounted", () => {
      Object.values(e.contextMenus).length > 0 && (() => import("@imengyu/vue3-context-menu"))().then((i) => {
        T = i.default, T.default && !T.showContextMenu && (T = T.default);
      });
    });
    const ce = I("IBizRawItem"), O = I("IBizIcon"), G = (t, i, r, u) => {
      const p = [];
      return t.forEach((c) => {
        var Z, ee;
        if (c.itemType === "SEPERATOR") {
          p.push({
            divided: "self"
          });
          return;
        }
        const w = u[c.id];
        if (w && !w.visible || c.actionLevel > 100)
          return;
        let N = {};
        if (c.showCaption && c.caption && (N.label = c.caption), c.sysImage && c.showIcon && (N.icon = h(O, {
          icon: c.sysImage
        }, null)), c.itemType === "DEUIACTION") {
          N.disabled = w.disabled, N.clickClose = !0;
          const {
            uiactionId: x
          } = c;
          x && (N.onClick = () => {
            e.doUIAction(x, i, r, c.appId);
          });
        } else if (c.itemType === "RAWITEM") {
          const {
            rawItem: x
          } = c;
          x && (N.label = h(ce, {
            rawItem: c
          }, null));
        } else if (c.itemType === "ITEMS") {
          (Z = c.detoolbarItems) != null && Z.length && (N.children = G(c.detoolbarItems, i, r, u));
          const x = c;
          if (x.uiactionGroup && x.groupExtractMode) {
            const k = (ee = x.uiactionGroup.uiactionGroupDetails) == null ? void 0 : ee.filter((b) => u[b.id].visible).map((b) => {
              const te = u[b.id], {
                sysImage: ye
              } = b;
              return {
                label: b.showCaption ? b.caption : void 0,
                icon: b.showIcon ? h(O, {
                  icon: ye
                }, null) : void 0,
                disabled: te.disabled,
                clickableWhenHasChildren: !0,
                onClick: () => {
                  T.closeContextMenu(), e.doUIAction(b.uiactionId, i, r, b.appId);
                }
              };
            });
            switch (x.groupExtractMode) {
              case "ITEMS":
                N.children = k;
                break;
              case "ITEMX":
                k && (N = k[0], N.children = k.slice(1));
                break;
              case "ITEM":
              default:
                N = void 0, k && p.push(...k);
                break;
            }
          }
        }
        N && p.push(N);
      }), p;
    }, $ = async (t, i) => {
      i.preventDefault(), i.stopPropagation();
      const r = e.getNodeModel(t._nodeId);
      if (!(r != null && r.decontextMenu))
        return;
      const u = e.contextMenus[r.decontextMenu.id];
      if (!u.model.detoolbarItems)
        return;
      await u.calcButtonState(t._deData || (t.srfkey ? t : void 0), r.appDataEntityId);
      const p = u.state.buttonsState, c = G(u.model.detoolbarItems, t, i, p);
      c.length && T.showContextMenu({
        x: i.x,
        y: i.y,
        customClass: o.b("context-menu"),
        items: c
      });
    }, H = (t, i) => {
      var u, p;
      if (!((p = (u = t == null ? void 0 : t.decontextMenu) == null ? void 0 : u.detoolbarItems) != null && p.length))
        return;
      const r = e.contextMenuInfos[t.id];
      return r.clickTBUIActionItem && r.onlyOneActionItem ? null : h(I("iBizContextMenuControl"), {
        modelData: t.decontextMenu,
        groupLevelKeys: [50, 100],
        nodeModel: t,
        nodeData: i,
        context: e.context,
        onActionClick: (c, w) => e.doUIAction(c.uiactionId, i, w, c.appId)
      }, null);
    }, L = (t, i) => {
      const r = E(t._uuid, e);
      if (!r)
        throw new P("没有找到_uuid为".concat(t._uuid, "的节点"));
      e.onExpandChange(r, i);
    }, ue = de(() => {
      e.load();
    }, 500), fe = (t) => {
      e.state.query = t, ue();
    }, q = (t, i, r) => {
      const u = E(t.data._uuid, e), p = E(i.data._uuid, e);
      return e.calcAllowDrop(u, p, r);
    }, W = (t) => {
      const i = E(t.data._uuid, e);
      return e.calcAllowDrag(i);
    }, Q = (t, i, r) => {
      const u = Pe(r), p = E(t.data._uuid, e), c = E(i.data._uuid, e);
      e.onNodeDrop(p, c, u);
    }, j = (t) => {
      (t.key === "Enter" || t.keyCode === 13) && (t.stopPropagation(), y()), (t.key === "Escape" || t.keyCode === 27) && (t.stopPropagation(), g());
    }, J = (t) => {
      var i;
      if (t.code === "F2" || t.code === "Enter") {
        const r = (i = a.value) == null ? void 0 : i.getCurrentKey();
        e.updateTreeNode(r);
      }
    }, he = async () => {
      e.evt.emit("onBack", {}), e.isFilter.value = !1, a.value && a.value.filter("");
    };
    Re(() => {
      var t;
      (t = s.value) == null || t.$el.addEventListener("keydown", J), e.evt.on("onFilterNode", async (i) => {
        const {
          nodeTag: r
        } = i;
        r && (e.isFilter.value = !0), a.value && a.value.filter("".concat(r, "@"));
      }), e.evt.on("onResetSate", async () => {
        e.evt.emit("onBack", {}), e.isFilter.value = !1, a.value && a.value.filter("");
      }), e.evt.on("onLoadSuccess", () => {
        e.isFilter.value ? e.evt.emit("onFilterNode", {
          nodeTag: "draft"
        }) : e.evt.emit("onResetSate", {});
      });
    }), Se(() => {
      var t;
      (t = s.value) == null || t.$el.removeEventListener("keydown", J);
    });
    const pe = (t, i) => (i._id || "").includes(t), Ne = (t) => t._id === "root:draft_parent" ? "draft_parent" : null, X = (t) => {
      if (t.counterId) {
        const i = n[t.counterId];
        return le(i) || t.counterMode === 1 && i === 0 ? null : h("div", {
          class: o.em("counter", "box")
        }, [h("span", {
          class: o.e("dot")
        }, [ae("·")]), h(I("iBizBadge"), {
          class: o.e("counter"),
          value: i
        }, null)]);
      }
    }, me = () => e.isFilter.value ? h("div", {
      class: o.b("filter")
    }, [h("div", {
      class: o.be("filter", "header"),
      onClick: he
    }, [h(I("ion-icon"), {
      name: "arrow-back-outline"
    }, null), ae("返回")])]) : null, Y = (t) => {
      var r, u;
      if (!e.state.newingNodeModel)
        return null;
      const {
        parent_id: i
      } = e.state.newingNodeDefault || {};
      if (i) {
        if (!t)
          return null;
        const {
          _value: p
        } = t || {};
        if (p !== i)
          return null;
      }
      return !i && t ? null : h("div", {
        class: [o.be("node", "newing")]
      }, [(r = e.state.newingNodeModel) != null && r.sysImage ? h(O, {
        class: o.be("node", "icon"),
        icon: (u = e.state.newingNodeModel) == null ? void 0 : u.sysImage
      }, null) : null, h(I("el-input"), {
        modelValue: e.state.newingNodeText,
        "onUpdate:modelValue": (p) => e.state.newingNodeText = p,
        ref: "treeNodeTextInputRef",
        class: o.b("editing-node"),
        onBlur: y,
        onKeydown: (p) => {
          j(p);
        }
      }, null)]);
    };
    return {
      c: e,
      ns: o,
      treeRef: a,
      treeviewRef: s,
      treeNodeTextInputRef: l,
      treeData: v,
      treeRefreshKey: f,
      findNodeData: E,
      handleEditKeyDown: j,
      onCheck: M,
      onNodeClick: F,
      onNodeDbClick: A,
      onNodeContextmenu: $,
      loadData: D,
      renderContextMenu: H,
      renderCounter: X,
      updateNodeExpand: L,
      onInput: fe,
      allowDrop: q,
      allowDrag: W,
      handleDrop: Q,
      onNodeTextEditBlur: y,
      renderTree: () => h("div", {
        class: [o.b("content"), o.is("filter", e.isFilter.value)]
      }, [me(), h("div", {
        class: [o.b("tree-box"), o.is("filter", e.isFilter.value)]
      }, [h(I("el-tree"), {
        ref: "treeRef",
        key: f.value,
        class: [d.b("tree"), o.is("list-tree", e.renderMode === "listTree")],
        "node-key": "_id",
        "highlight-current": !0,
        "expand-on-click-node": !1,
        "auto-expand-parent": !1,
        "show-checkbox": !e.state.singleSelect,
        "check-strictly": !0,
        "default-expanded-keys": e.state.expandedKeys,
        props: {
          label: "_text",
          children: "_children",
          isLeaf: "_leaf",
          class: Ne
        },
        lazy: !0,
        load: D,
        onCheck: M,
        onNodeExpand: (t) => {
          L(t, !0);
        },
        onNodeCollapse: (t) => {
          L(t, !1);
        },
        draggable: !m.value,
        "allow-drop": q,
        "allow-drag": W,
        onNodeDrop: Q,
        "filter-node-method": pe
      }, {
        default: ({
          data: t
        }) => {
          var c, w;
          const i = E(t._uuid, e);
          if (!i)
            return null;
          const r = e.getNodeModel(i._nodeId);
          if (e.state.editingNodeKey === i._id && !m.value)
            return h("div", {
              class: [o.b("node"), (c = r.sysCss) == null ? void 0 : c.cssName]
            }, [i._icon ? h(O, {
              class: o.be("node", "icon"),
              icon: i._icon
            }, null) : null, h(I("el-input"), {
              modelValue: e.state.editingNodeText,
              "onUpdate:modelValue": (N) => e.state.editingNodeText = N,
              ref: "treeNodeTextInputRef",
              class: o.b("editing-node"),
              onBlur: () => {
                y();
              },
              onKeydown: (N) => {
                j(N);
              }
            }, null)]);
          const u = we(r);
          let p;
          return u ? p = h(I("iBizControlShell"), {
            data: i,
            modelData: u,
            context: e.context,
            params: e.params
          }, null) : p = [i._icon ? h(O, {
            class: o.be("node", "icon"),
            icon: i._icon
          }, null) : null, i._textHtml ? h("span", {
            class: o.be("node", "label"),
            innerHTML: i._textHtml
          }, null) : h("span", {
            class: o.be("node", "label")
          }, [i._text])], [h("div", {
            onDblclick: (N) => A(i, N),
            onClick: (N) => F(i, N),
            onContextmenu: (N) => $(i, N),
            class: [o.b("node"), o.is("hidden", Object.is(e.hiddenNodeId, i._nodeId) && !e.isFilter.value), i._leaf ? o.be("node", "item") : o.be("node", "group"), (w = r.sysCss) == null ? void 0 : w.cssName]
          }, [p, X(r), H(r, i)]), Y(i)];
        }
      }), Y()])])
    };
  },
  render() {
    const e = {
      searchbar: () => this.c.enableQuickSearch ? h(I("el-input"), {
        "model-value": this.c.state.query,
        class: this.ns.b("quick-search"),
        placeholder: this.c.state.placeHolder,
        onInput: this.onInput
      }, {
        prefix: () => h(I("ion-icon"), {
          class: this.ns.e("search-icon"),
          name: "search"
        }, null)
      }) : null
    };
    this.c.bottomToolbar && (e.toolbar = () => h(I("iBizControlShell"), {
      modelData: this.c.bottomToolbar,
      context: this.c.context,
      params: this.c.params
    }, null));
    const m = this.c.controlPanel ? "tree" : "default";
    return e[m] = () => {
      if (this.c.state.isLoaded && this.treeRefreshKey)
        return this.renderTree();
    }, Ae(h(I("iBizControlBase"), {
      ref: "treeviewRef",
      controller: this.c
    }, Le(e) ? e : {
      default: () => [e]
    }), [[Oe("loading"), this.c.state.isLoading]]);
  }
});
class je {
  constructor() {
    R(this, "component", "IBizGroupTreeControl");
  }
}
const Xe = Ce(
  V,
  function(e) {
    e.component(V.name, V), xe(
      "TREE_RENDER_GROUP_TREE",
      () => new je()
    );
  }
);
export {
  Xe as IBizGroupTreeControl,
  Xe as default
};
