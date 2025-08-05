import './style.css';
var Z = Object.defineProperty;
var ee = (r, n, o) => n in r ? Z(r, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : r[n] = o;
var u = (r, n, o) => (ee(r, typeof n != "symbol" ? n + "" : n, o), o);
import { EditorController as te, ButtonContainerState as ie, getDeACMode as oe, calcDeCodeNameById as ae, UIActionButtonState as se, UIActionUtil as ne, openRedirectView as re, registerEditorProvider as ce } from "@ibiz-template/runtime";
import { parseRouteViewData as le, getDataPickerProps as de, getEditorEmits as ue, useNamespace as pe, getNestedRoutePath as he, renderString as fe, route2routePath as B, routePath2string as U, withInstall as me } from "@ibiz-template/vue3-util";
import { RuntimeModelError as ye, listenJSEvent as ve, NOOP as F, IBizContext as G } from "@ibiz-template/core";
import { mergeDeepLeft as Ce } from "ramda";
import { defineComponent as Ee, ref as g, computed as z, watch as P, onMounted as De, onBeforeUnmount as we, onActivated as ge, createVNode as p, resolveComponent as C } from "vue";
import { useRoute as Ie, useRouter as xe } from "vue-router";
import { isUndefined as Ae } from "lodash-es";
class Ne extends te {
  constructor() {
    super(...arguments);
    /**
     * 主键属性名称
     */
    u(this, "keyName", "srfkey");
    /**
     * 主文本属性名称
     */
    u(this, "textName", "srfmajortext");
    /**
     * 数据集codeName
     */
    u(this, "interfaceName", "");
    /**
     * 自填模式sort排序
     */
    u(this, "sort", "");
    /**
     * 实体自填模式模型
     */
    u(this, "deACMode");
    /**
     * 自填数据项集合（已排除了value和text)
     */
    u(this, "dataItems", []);
    /**
     * 分组行为状态
     *
     * @type {IButtonContainerState}
     * @memberof RoutePickerController
     */
    u(this, "groupActionState", new ie());
    /**
     * 后缀图标
     *
     * @type {string}
     * @memberof RoutePickerController
     */
    u(this, "suffix", "");
    /**
     * 允许搜索
     *
     * @type {boolean}
     * @memberof RoutePickerController
     */
    u(this, "enablesearch", !1);
    /**
     * 允许缓存
     *
     * @type {boolean}
     * @memberof RoutePickerController
     */
    u(this, "enableCache", !1);
    /**
     * @description 是否立即执行跳转
     * @type {boolean}
     * @memberof RoutePickerController
     */
    u(this, "immediate", !1);
    /**
     * 路由属性标识
     *
     * @type {string}
     * @memberof RoutePickerController
     */
    u(this, "routeKey", "");
    /**
     * 值变更模式
     *
     * @type {'ROUTECHANGE' | 'CONTEXTCHANGE'}
     * @memberof RoutePickerController
     */
    u(this, "valueMode", "ROUTECHANGE");
    // 项布局面板
    u(this, "itemLayoutPanel");
  }
  /**
   * 当前视图
   *
   * @readonly
   * @type {(number)}
   * @memberof RoutePickerController
   */
  get currentView() {
    return this.parent.panel.view;
  }
  /**
   * 当前路由视图的层级
   *
   * @readonly
   * @type {(number)}
   * @memberof RoutePickerController
   */
  get routeDepth() {
    return this.parent.panel.view.modal.routeDepth;
  }
  /**
   * 当前视图重定向引用
   * @readonly
   * @type {(IData | undefined)}
   * @memberof RoutePickerController
   */
  get RedirectViewModel() {
    var o;
    return (o = this.parent.panel.model.appViewRefs) == null ? void 0 : o.find(
      (e) => e.name === "REDIRECT"
    );
  }
  async onInit() {
    if (super.onInit(), this.model.appDataEntityId) {
      if (this.model.appDEDataSetId && (this.interfaceName = this.model.appDEDataSetId), this.model.appDEACModeId && (this.deACMode = await oe(
        this.model.appDEACModeId,
        this.model.appDataEntityId,
        this.context.srfappid
      ), this.deACMode)) {
        const { minorSortAppDEFieldId: e, minorSortDir: s } = this.deACMode;
        e && s && (this.sort = "".concat(e.toLowerCase(), ",").concat(s.toLowerCase())), this.deACMode.textAppDEFieldId && (this.textName = this.deACMode.textAppDEFieldId), this.deACMode.valueAppDEFieldId && (this.keyName = this.deACMode.valueAppDEFieldId), this.deACMode.deacmodeDataItems && (this.dataItems = [], this.deACMode.deacmodeDataItems.forEach(
          (m) => {
            m.id !== "value" && m.id !== "text" && this.dataItems.push(m);
          }
        )), this.deACMode.itemLayoutPanel && (this.itemLayoutPanel = this.deACMode.itemLayoutPanel);
      }
      this.routeKey = ae(this.model.appDataEntityId);
    }
    if (this.model.uiactionGroup) {
      const e = this.model.uiactionGroup.uiactionGroupDetails || [];
      e.length > 0 && (e.forEach((s) => {
        const m = s.uiactionId;
        if (m) {
          const d = new se(
            s.id,
            this.context.srfappid,
            m
          );
          this.groupActionState.addState(s.id, d);
        }
      }), await this.groupActionState.update(
        this.context,
        void 0,
        this.model.appDataEntityId
      ));
    }
    const { editorParams: o } = this.model;
    o && (o.ROUTEKEY && (this.routeKey = o.ROUTEKEY), o.SUFFIX && (this.suffix = o.SUFFIX), o.MODE && (this.valueMode = o.MODE), o.ENABLESEARCH && (this.enablesearch = Object.is(o.ENABLESEARCH, "true") || Object.is(o.ENABLESEARCH, "TRUE")), o.ENABLECACHE && (this.enableCache = Object.is(o.ENABLECACHE, "true") || Object.is(o.ENABLECACHE, "TRUE")), o.IMMEDIATE && (this.immediate = Object.is(o.IMMEDIATE, "true") || Object.is(o.IMMEDIATE, "TRUE")));
  }
  /**
   * 加载实体数据集数据
   *
   * @param {string} query 模糊匹配字符串
   * @param {IData} data 表单数据
   * @returns {*}  {Promise<IHttpResponse<IData[]>>}
   * @memberof RoutePickerController
   */
  async getServiceData(o, e) {
    const { context: s, params: m } = this.handlePublicParams(
      e,
      this.context,
      this.params
    ), d = {};
    this.sort && !Object.is(this.sort, "") && Object.assign(d, { sort: this.sort }), o && Object.assign(d, { query: o }), Object.assign(d, { size: 1e3 });
    const y = Ce(m, d);
    if (this.interfaceName)
      return await ibiz.hub.getApp(this.context.srfappid).deService.exec(
        this.model.appDataEntityId,
        this.interfaceName,
        s,
        y
      );
    throw new ye(this.model, "请配置实体和实体数据集");
  }
  /**
   * 计算回填数据
   *
   * @author lxm
   * @date 2022-10-24 16:10:24
   * @param {IData} data 选中数据
   * @returns {*}  {Promise<Array<{ id: string; value: any }>>}
   */
  async calcFillDataItems(o) {
    return this.deACMode ? this.dataItems.length === 0 ? [] : await Promise.all(
      this.dataItems.map((s) => {
        const m = o[s.appDEFieldId];
        return s.format || s.convertToCodeItemText && s.codeListId || s.customCode, { id: s.id, value: m };
      })
    ) : [];
  }
  /**
   * 分组行为项点击
   *
   * @param {IUIActionGroupDetail} detail
   * @param {MouseEvent} event
   * @return {*}  {Promise<void>}
   * @memberof RoutePickerController
   */
  async onActionClick(o, e) {
    const s = o.uiactionId;
    Object.assign(this.context, {
      srfdefaulttoroutedepth: this.parent.panel.view.modal.routeDepth
    }), await ne.execAndResolved(
      s,
      {
        context: this.context,
        params: this.params,
        data: [],
        view: this.parent.panel.view,
        event: e
      },
      o.appId
    );
  }
  /**
   * 获取路由主信息
   *
   * @param {RouteLocationNormalizedLoaded} route
   * @return {*}
   * @memberof RoutePickerController
   */
  async getRouteKey(o, e, s = !1) {
    let d = (await le(o, this.routeDepth)).context[this.routeKey];
    return !d && s && (d = e[0].srfkey), d;
  }
}
class ke {
  constructor() {
    u(this, "formEditor");
    u(this, "gridEditor");
    this.formEditor = "RoutePicker", this.gridEditor = "RoutePicker";
  }
  async createController(n, o) {
    const e = new Ne(n, o);
    return await e.init(), e;
  }
}
const M = /* @__PURE__ */ Ee({
  name: "RoutePicker",
  props: de(),
  emits: ue(),
  setup(r, {
    emit: n
  }) {
    const o = pe("route-picker"), e = r.controller, s = Ie(), m = xe(), d = g(""), y = g({}), v = g({}), c = g([]), w = g("");
    let x = "", A = !1;
    const S = () => {
      y.value = c.value.find((t) => t[e.textName] === d.value) || {};
    }, E = z(() => {
      var t, i, a;
      return (a = (i = (t = v.value) == null ? void 0 : t.popperRef) == null ? void 0 : i.popperRef) == null ? void 0 : a.contentRef;
    });
    P(() => r.value, (t) => {
      var i;
      (t || t === null) && (d.value = t, t === null && (d.value = "")), S(), (i = ibiz.util) == null || i.setBrowserTitle(d.value);
    }, {
      immediate: !0
    });
    const O = (t = 0) => {
      if (E.value) {
        const i = E.value.querySelector(".ibiz-route-picker__dropdown-list"), a = c.value.findIndex((h) => h[e.keyName] === y.value[e.keyName]);
        i && a > -1 && setTimeout(() => {
          const h = i.offsetHeight, l = Math.floor(h / 38);
          a + 1 > l ? i.scrollTop = 38 * (a + 1 - l) : i.scrollTop = 0;
        }, t);
      }
    };
    P(() => y.value, () => {
      O();
    });
    const T = () => {
      var t, i, a;
      v.value && ((t = v.value) != null && t.popperRef) && ((a = (i = v.value) == null ? void 0 : i.popperRef) == null || a.hide());
    }, H = () => {
      w.value || I(w.value);
    }, $ = (t) => {
      var i;
      t.keyCode === 13 && (t.stopPropagation(), t.preventDefault(), I(w.value)), ((t == null ? void 0 : t.keyCode) === 38 || (t == null ? void 0 : t.keyCode) === 40) && ((i = t.target) == null || i.blur());
    }, L = (t) => {
      (t.keyCode === 13 || t.keyCode === 32) && (t.stopPropagation(), t.preventDefault());
    };
    let N = F;
    De(() => {
      const t = he(s, e.routeDepth);
      x = t.substring(0, t.lastIndexOf("/")), N = ve(window, "keyup", (i) => {
        A && (i.keyCode === 27 && T(), i.keyCode === 40 ? k("down") : i.keyCode === 38 ? k("up") : i.keyCode === 13 && k("enter"));
      }), v.value && (v.value.triggerKeys = []), E.value && E.value.addEventListener("keydown", L, !0);
    }), we(() => {
      N !== F && N(), E.value && E.value.removeEventListener("keydown", L);
    });
    const k = (t) => {
      let i = c.value.findIndex((a) => a[e.keyName] === y.value[e.keyName]);
      switch (t) {
        case "up":
          i--, (i === -1 || i === -2) && (i = c.value.length - 1), y.value = c.value[i];
          break;
        case "down":
          i++, i === c.value.length && (i = 0), y.value = c.value[i];
          break;
        case "enter":
          D(y.value, !1);
          break;
      }
    }, _ = async (t, i = !1) => {
      const a = t[e.keyName];
      if (await e.getRouteKey(s, c.value) === a)
        return;
      let l = s.fullPath;
      if (e.valueMode && e.valueMode === "ROUTECHANGE") {
        if (e.RedirectViewModel) {
          const b = await ibiz.hub.getAppView(e.RedirectViewModel.refAppViewId), j = {
            srfsessionid: e.context.srfsessionid,
            srfappid: e.context.srfappid
          };
          Object.keys(e.context).forEach((R) => {
            R !== "srfreadonly" && (j[R] = e.context[R]);
          });
          const W = G.create({
            [e.routeKey]: a
          }, j);
          return re(b, W, e.params, {});
        }
        const f = B(s);
        f.pathNodes[e.routeDepth - 2].context[e.routeKey] = a, f.pathNodes.splice(e.routeDepth), f.pathNodes[e.routeDepth - 1] && f.pathNodes[e.routeDepth - 1].srfnav && delete f.pathNodes[e.routeDepth - 1].srfnav, l = U(f);
      } else {
        const f = B(s), b = f.pathNodes[e.routeDepth - 1];
        Ae(b.context) && Object.assign(f.pathNodes[e.routeDepth - 1], {
          context: G.create()
        }), f.pathNodes[e.routeDepth - 1].context[e.routeKey] = a, l = U(f);
      }
      i ? m.replace({
        path: l
      }) : ibiz.openView.push(l);
    }, q = (t) => {
      e.enableCache && localStorage.setItem("routePick-".concat(e.context.srfuserid, "-").concat(x), t.id || t.srfkey);
    }, X = () => {
      if (e.enableCache) {
        const t = localStorage.getItem("routePick-".concat(e.context.srfuserid, "-").concat(x));
        return c.value.find((i) => i.id === t || i.srfkey === t);
      }
    }, D = async (t, i, a = !1) => {
      T();
      const h = await e.calcFillDataItems(t);
      h.length && h.forEach((f) => {
        n("change", f.value, f.id);
      });
      const l = {};
      Object.assign(l, t), Object.assign(l, {
        [e.keyName]: l[e.keyName] ? l[e.keyName] : l.srfkey,
        [e.textName]: l[e.textName] ? l[e.textName] : l.srfmajortext
      }), n("change", t[e.textName]), q(t), !(i && e.valueMode && e.valueMode === "CONTEXTCHANGE" && e.immediate === !1) && _(t, a);
    }, I = async (t, i) => {
      if (e.model.appDataEntityId) {
        let a = "";
        t !== r.value && (a = t.trim());
        const h = await e.getServiceData(a, r.data);
        h && (c.value = h.data, i && i instanceof Function && i(c.value));
      }
    }, K = z(() => fe(d.value));
    P(K, (t, i) => {
      t !== i && n("infoTextChange", t);
    }, {
      immediate: !0
    });
    const V = async () => {
      const t = await e.getServiceData("", r.data);
      if (t) {
        c.value = t.data;
        const i = await e.getRouteKey(s, c.value, !0), a = c.value.find((l) => l[e.keyName] === i), h = X();
        h ? D(h, !1, !0) : a && D(a, !0);
      }
    };
    e.enableCache && V(), e.currentView.evt.on("onMounted", () => {
      e.enableCache || V();
    }), ge(async () => {
      const t = await e.getRouteKey(s, c.value, !0), i = c.value.find((a) => a[e.keyName] === t);
      i && D(i, !1);
    });
    const Y = (t) => {
      A = t, A ? (I(""), O(300)) : (w.value = "", S());
    }, J = (t) => {
      D(t, !1);
    }, Q = () => {
      v.value && v.value.handleClose();
    };
    return {
      ns: o,
      c: e,
      dropDown: v,
      curValue: d,
      curSelect: y,
      valueText: K,
      items: c,
      query: w,
      onACSelect: D,
      onSearch: I,
      onKeyup: $,
      onInput: H,
      onVisibleChange: Y,
      onCommand: J,
      renderGroupAction: () => {
        const {
          uiactionGroup: t
        } = e.model;
        if (t)
          return p("div", {
            class: o.e("group-action")
          }, [p(C("iBizActionToolbar"), {
            class: o.be("group", "header-actions"),
            actionDetails: t.uiactionGroupDetails,
            "actions-state": e.groupActionState,
            onActionClick: (i, a) => {
              e.onActionClick(i, a), Q();
            }
          }, null)]);
      },
      renderPanelItemLayout: (t, i) => {
        const {
          context: a,
          params: h
        } = e;
        return p(C("iBizControlShell"), {
          data: t,
          modelData: i,
          context: a,
          params: h
        }, null);
      }
    };
  },
  render() {
    return p("div", {
      class: [this.ns.b(), this.ns.m("route"), this.disabled ? this.ns.m("disabled") : ""]
    }, [p("div", {
      class: [this.ns.e("dropdown")]
    }, [p(C("el-dropdown"), {
      trigger: "click",
      ref: "dropDown",
      "popper-class": this.ns.em("dropdown", "transfer"),
      onVisibleChange: this.onVisibleChange,
      onCommand: this.onCommand
    }, {
      default: () => p("div", null, [p("span", {
        class: this.ns.em("dropdown", "cur-text"),
        title: this.curValue || ""
      }, [this.curValue]), p(C("ion-icon"), {
        name: this.c.suffix
      }, null)]),
      dropdown: () => {
        var r;
        return p("div", null, [this.c.enablesearch && p(C("el-input"), {
          modelValue: this.query,
          "onUpdate:modelValue": (n) => this.query = n,
          placeholder: "搜索",
          onKeyup: this.onKeyup,
          onInput: this.onInput
        }, null), p("div", {
          class: this.ns.e("dropdown-list")
        }, [((r = this.items) == null ? void 0 : r.length) > 0 ? this.items.map((n) => p(C("el-dropdown-item"), {
          class: [this.ns.e("dropdown-item"), this.ns.is("active", n[this.c.textName] === this.curValue), this.ns.is("hover", n[this.c.keyName] === this.curSelect[this.c.keyName])],
          id: n[this.c.keyName],
          title: n[this.c.textName],
          command: n
        }, {
          default: () => [this.c.itemLayoutPanel ? this.renderPanelItemLayout(n, this.c.itemLayoutPanel) : p("span", {
            class: this.ns.em("dropdown-item", "text")
          }, [n[this.c.textName]])]
        })) : p(C("el-dropdown-item"), {
          class: this.ns.e("no-data")
        }, {
          default: () => [p(C("iBizNoData"), {
            text: "暂无数据"
          }, null)]
        })]), this.renderGroupAction()]);
      }
    })])]);
  }
}), be = me(M, function(r) {
  r.component(M.name, M), ce("PICKER_ROUTE", () => new ke());
}), Be = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.use(be);
  }
};
export {
  be as IBizRoutePicker,
  Be as default
};
