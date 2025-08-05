import './style.css';
var x = Object.defineProperty;
var V = (r, t, e) => t in r ? x(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var h = (r, t, e) => (V(r, typeof t != "symbol" ? t + "" : t, e), e);
import { Modal as I, ViewMode as S, calcDeCodeNameById as D, registerPanelItemProvider as M } from "@ibiz-template/runtime";
import { defineComponent as g, createVNode as i, createTextVNode as R, ref as p, watch as K, onActivated as k, onDeactivated as O, onUnmounted as A, h as z, resolveComponent as b, Fragment as E, isVNode as _ } from "vue";
import { useNamespace as C, getNestedRoutePath as f, NavPosState as j, NavPosController as U, route2routePath as T } from "@ibiz-template/vue3-util";
import { useRouter as q, useRoute as L } from "vue-router";
import { IBizContext as w } from "@ibiz-template/core";
const F = /* @__PURE__ */ g({
  name: "IBizBreadcrumb",
  props: {
    items: {
      type: Array,
      required: !0
    }
  },
  emits: {
    click: (r) => !0
  },
  setup(r, {
    emit: t
  }) {
    return {
      ns: C("breadcrumb"),
      handleClick: (o, s) => {
        o.stopPropagation(), s !== r.items.length - 1 && t("click", r.items[s]);
      }
    };
  },
  render() {
    return i("div", {
      class: this.ns.b()
    }, [this.items.map((r, t) => i("div", {
      class: [this.ns.e("item"), this.ns.is("active", t === this.items.length - 1)]
    }, [i("div", {
      class: this.ns.e("item-content"),
      onClick: (e) => {
        this.handleClick(e, t);
      }
    }, [i("div", {
      class: this.ns.em("item", "text")
    }, [r.caption || ""])]), t !== this.items.length - 1 && i("div", {
      class: this.ns.em("item", "separator")
    }, [R("/")])]))]);
  }
});
function J(r) {
  return typeof r == "function" || Object.prototype.toString.call(r) === "[object Object]" && !_(r);
}
const y = /* @__PURE__ */ g({
  name: "IBizBreadcrumbNavPos",
  props: {
    modelData: {
      type: Object,
      required: !0
    },
    controller: {
      type: Object,
      required: !0
    }
  },
  setup(r) {
    const t = r.controller, e = C("breadcrumb-nav-pos"), a = (d) => {
      t.onViewCreated(d);
    }, o = q(), s = L(), u = p(!1), c = p(!0), n = p(!1);
    if (t.setRouter(o), t.routeDepth) {
      const d = f(s, t.routeDepth);
      K(() => s.fullPath, () => {
        n.value = s.fullPath.indexOf("/route-modal") !== -1;
        const m = f(s, t.routeDepth);
        if (d === m && s.matched.length > t.routeDepth) {
          if (s.matched.length === t.routeDepth + 1 && (u.value = !!s.name, u.value))
            return;
          t.onRouteChange(s);
        }
      }, {
        immediate: !0
      });
    }
    k(() => {
      c.value = !0;
    }), O(() => {
      c.value = !1;
    }), A(() => {
      t.clearBreadcrumb();
    });
    const l = new I({
      mode: S.ROUTE,
      routeDepth: (t.routeDepth || 0) + 1
    });
    return {
      ns: e,
      c: t,
      isPresetView: u,
      isActivated: c,
      routeModal: l,
      isModalRoute: n,
      onViewCreated: a
    };
  },
  render() {
    const {
      state: r
    } = this.c, {
      currentKey: t,
      cacheKeys: e,
      navViewMsgs: a,
      cache: o,
      breadcrumb: s,
      routeManualKey: u
    } = r, c = t && a[t] ? z(b("IBizViewShell"), {
      key: t,
      class: this.ns.e("view-pos"),
      context: a[t].context,
      params: a[t].params,
      viewId: a[t].viewId,
      onCreated: this.onViewCreated
    }) : null;
    return i("div", {
      class: [this.ns.b(), this.ns.m(this.modelData.id), ...this.controller.containerClass, this.ns.is("show-breadcrumb", this.controller.state.showBreadcrumd)]
    }, [this.controller.state.showBreadcrumd && i("div", {
      class: this.ns.e("header")
    }, [i("div", {
      class: this.ns.em("header", "left")
    }, [i(F, {
      items: s,
      onClick: (n) => this.c.handleBreadcrumbSkip(n)
    }, null)]), i("div", {
      class: this.ns.em("header", "right")
    }, [i("div", {
      id: "breadcrumb-nav-pos-searchbar"
    }, null), i("div", {
      id: "breadcrumb-nav-pos-toolbar"
    }, null)])]), i(E, null, [o ? i(b("keepAlive"), {
      include: e,
      max: 30,
      isKey: !0
    }, J(c) ? c : {
      default: () => [c]
    }) : c, this.isActivated && this.isModalRoute && i(b("iBizRouterView"), {
      manualKey: u,
      modal: this.routeModal,
      style: "display: none;"
    }, {
      default: ({
        Component: n
      }) => t === "" || !n ? null : i(n, null, null)
    })])]);
  }
});
class $ extends j {
  constructor() {
    super(...arguments);
    /**
     * 面包屑数据
     *
     * @type {IBreadcrumb[]}
     * @memberof BreadcrumbNavPosState
     */
    h(this, "breadcrumb", []);
    /**
     * 显示面包屑
     *
     * @type {boolean}
     * @memberof BreadcrumbNavPosState
     */
    h(this, "showBreadcrumd", !0);
    /**
     * @description 路由key
     * @type {string}
     * @memberof BreadcrumbNavPosState
     */
    h(this, "routeManualKey", "DEFAULT");
  }
}
var B;
class G extends U {
  constructor() {
    super(...arguments);
    /**
     * 缓存识别码
     *
     * @protected
     * @type {string}
     * @memberof BreadcrumbNavPosController
     */
    h(this, "localStorageKey", "".concat((B = this.panel.view.model.codeName) == null ? void 0 : B.toLowerCase(), "@breadcrumb-nav-pos"));
  }
  /**
   * 创建导航占位状态对象
   *
   * @protected
   * @return {*}  {BreadcrumbNavPosState}
   * @memberof BreadcrumbNavPosController
   */
  createState() {
    var e;
    return new $((e = this.parent) == null ? void 0 : e.state);
  }
  /**
   * 查找指定面包屑
   *
   * @param {string} key 缓存key
   * @return {*}  {(IBreadcrumb | undefined)}
   * @memberof BreadcrumbNavPosController
   */
  findBreadcrumb(e) {
    return this.state.breadcrumb.find((a) => this.calcCacheKey(a) === e);
  }
  /**
   * 初始化
   *
   * @protected
   * @return {*}  {Promise<void>}
   * @memberof BreadcrumbNavPosController
   */
  async onInit() {
    await super.onInit(), this.rawItemParams.show_breadcrumb === "false" && (this.state.showBreadcrumd = !1), this.state.breadcrumb = this.getBreadcrumb();
  }
  /**
   * 根据路由计算面包屑数据
   *
   * @protected
   * @param {Route} route
   * @return {*}  {Promise<void>}
   * @memberof BreadcrumbNavPosController
   */
  async calcBreadcrumbByRoute(e) {
    let { pathNodes: a } = T(e);
    a = a.slice(this.routeDepth).filter((s) => s.viewName !== "route-modal"), e.fullPath.indexOf("/route-modal") !== -1 && (this.state.routeManualKey = e.fullPath), this.state.breadcrumb = await Promise.all(
      a.map(async (s, u) => {
        var v;
        const { context: c, params: n, viewName: l } = s, d = await ibiz.hub.config.view.get(l);
        let m = "undefined";
        if (d.appDataEntityId) {
          const N = D(d.appDataEntityId);
          m = (v = s.context) == null ? void 0 : v[N.toLowerCase()];
        }
        const P = this.calcCacheKey({
          key: m,
          viewId: l
        });
        return this.findBreadcrumb(P) || {
          key: m,
          params: n,
          context: w.create(
            {
              ...c,
              srfdefaulttoroutedepth: this.routeDepth + 2 + u
            },
            this.panel.context
          ),
          viewId: l
        };
      })
    );
  }
  /**
   * 处理面包屑跳转
   *
   * @param {IBreadcrumb} item
   * @memberof BreadcrumbNavPosController
   */
  handleBreadcrumbSkip(e) {
    e.fullPath && this.router.push(e.fullPath);
  }
  /**
   * 路由变化
   *
   * @param {Route} route
   * @memberof BreadcrumbNavPosController
   */
  async onRouteChange(e) {
    await this.calcBreadcrumbByRoute(e), this.state.breadcrumb.forEach((a) => {
      const o = this.calcCacheKey(a);
      this.state.navViewMsgs[o] = a;
    }), this.curNavViewMsg = this.state.breadcrumb[this.state.breadcrumb.length - 1], super.onRouteChange(e);
  }
  /**
   * 打开视图
   *
   * @param {INavViewMsg} openViewMsg
   * @memberof BreadcrumbNavPosController
   */
  openView(e) {
    e.viewId && super.openView(e);
  }
  /**
   * 视图创建
   *
   * @param {EventBase} event
   * @memberof BreadcrumbNavPosController
   */
  onViewCreated(e) {
    super.onViewCreated(e), this.curNavViewMsg.caption = e.view.model.caption, e.view.evt.on("onViewInfoChange", ({ dataInfo: a }) => {
      this.curNavViewMsg.caption = a;
    }), this.saveBreadcrumb();
  }
  /**
   * 保存面包屑
   *
   * @memberof BreadcrumbNavPosController
   */
  saveBreadcrumb() {
    const e = [];
    this.state.breadcrumb.forEach((a) => {
      var s;
      const o = { ...a };
      o.context = (s = a.context) == null ? void 0 : s.getOwnContext(), e.push(o);
    }), localStorage.setItem(this.localStorageKey, JSON.stringify(e));
  }
  /**
   * 获取面包屑
   *
   * @return {*}  {IBreadcrumb[]}
   * @memberof BreadcrumbNavPosController
   */
  getBreadcrumb() {
    const e = localStorage.getItem(this.localStorageKey);
    try {
      if (e) {
        const a = JSON.parse(e);
        return Array.isArray(a) ? (a.forEach((o) => {
          o.context = w.create(o.context, this.panel.context);
        }), a) : [];
      }
    } catch (a) {
      ibiz.log.error(a);
    }
    return [];
  }
  /**
   * 清除面包屑
   *
   * @memberof BreadcrumbNavPosController
   */
  clearBreadcrumb() {
    localStorage.removeItem(this.localStorageKey);
  }
}
class H {
  constructor() {
    h(this, "component", "IBizBreadcrumbNavPos");
  }
  /**
   * 创建控制器
   *
   * @param {IPanelItem} panelItem
   * @param {PanelController} panel
   * @param {(PanelItemController | undefined)} parent
   * @return {*}  {Promise<IPanelItemNavPosController>}
   * @memberof BreadcrumbNavPosProvider
   */
  async createController(t, e, a) {
    const o = new G(t, e, a);
    return await o.init(), o;
  }
}
const ae = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(r) {
    r.component(y.name, y), M(
      "CUSTOM_BREADCRUMB_NAV_POS",
      () => new H()
    );
  }
};
export {
  ae as default
};
