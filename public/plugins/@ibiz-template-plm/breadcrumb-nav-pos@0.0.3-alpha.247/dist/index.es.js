import './style.css';
var j = Object.defineProperty;
var z = (o, t, e) => t in o ? j(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[t] = e;
var w = (o, t, e) => (z(o, typeof t != "symbol" ? t + "" : t, e), e);
import { Modal as U, ViewMode as T, calcDeCodeNameById as q, RouteConst as R, getErrorViewProvider as L, registerPanelItemProvider as H } from "@ibiz-template/runtime";
import { defineComponent as P, createVNode as l, createTextVNode as J, ref as y, watch as G, onActivated as $, onDeactivated as F, onUnmounted as V, h as B, resolveComponent as x, isVNode as W, toRaw as Q } from "vue";
import { useNamespace as M, getNestedRoutePath as O, NavPosState as X, NavPosController as Y, route2routePath as k, parseRouteViewData as Z, createOverlayView as ee, routerCallback as te } from "@ibiz-template/vue3-util";
import { useRouter as K, useRoute as A, onBeforeRouteUpdate as ae } from "vue-router";
import { IBizContext as g } from "@ibiz-template/core";
import { isEmpty as re } from "ramda";
import se from "qs";
const oe = /* @__PURE__ */ P({
  name: "IBizBreadcrumb",
  props: {
    items: {
      type: Array,
      required: !0
    }
  },
  emits: {
    click: (o) => !0
  },
  setup(o, {
    emit: t
  }) {
    return {
      ns: M("breadcrumb"),
      handleClick: (r, s) => {
        r.stopPropagation(), s !== o.items.length - 1 && t("click", o.items[s]);
      }
    };
  },
  render() {
    return l("div", {
      class: this.ns.b()
    }, [this.items.map((o, t) => l("div", {
      class: [this.ns.e("item"), this.ns.is("active", t === this.items.length - 1)]
    }, [l("div", {
      class: this.ns.e("item-content"),
      onClick: (e) => {
        this.handleClick(e, t);
      }
    }, [l("div", {
      class: this.ns.em("item", "text")
    }, [o.caption || ""])]), t !== this.items.length - 1 && l("div", {
      class: this.ns.em("item", "separator")
    }, [J("/")])]))]);
  }
});
function ne(o) {
  return typeof o == "function" || Object.prototype.toString.call(o) === "[object Object]" && !W(o);
}
const I = /* @__PURE__ */ P({
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
  setup(o) {
    const t = o.controller, e = M("breadcrumb-nav-pos"), a = (n) => {
      t.onViewCreated(n);
    }, r = K(), s = A(), h = y(!1), d = y(!0), i = y(!1), m = y({});
    if (t.setRouter(r), t.routeDepth) {
      const n = O(s, t.routeDepth);
      G(() => s.fullPath, () => {
        i.value = s.fullPath.indexOf("/route-modal") !== -1;
        const p = O(s, t.routeDepth);
        if (n === p && s.matched.length > t.routeDepth) {
          if (s.matched.length === t.routeDepth + 1 && (h.value = !!s.name, h.value))
            return;
          i.value && (m.value = new U({
            mode: T.ROUTE,
            routeDepth: s.matched.length
          })), t.onRouteChange(s);
        }
      }, {
        immediate: !0
      });
    }
    return $(() => {
      d.value = !0;
    }), F(() => {
      d.value = !1;
    }), V(() => {
      t.clearBreadcrumb();
    }), {
      ns: e,
      c: t,
      isPresetView: h,
      isActivated: d,
      routeModal: m,
      isModalRoute: i,
      onViewCreated: a
    };
  },
  render() {
    const {
      state: o
    } = this.c, {
      currentKey: t,
      cacheKeys: e,
      navViewMsgs: a,
      cache: r,
      breadcrumb: s
    } = o;
    let h = null;
    const d = t && a[t] ? B(x("IBizViewShell"), {
      context: a[t].context,
      params: a[t].params,
      key: this.c.ignoreEmbedKey ? void 0 : t,
      viewId: a[t].viewId,
      onCreated: this.onViewCreated
    }) : null;
    return h = r ? l(x("keepAlive"), {
      include: e,
      max: 30,
      isKey: !0
    }, ne(d) ? d : {
      default: () => [d]
    }) : d, l("div", {
      class: [this.ns.b(), this.ns.m(this.modelData.id), ...this.controller.containerClass, this.ns.is("show-breadcrumb", this.controller.state.showBreadcrumd)]
    }, [this.controller.state.showBreadcrumd && l("div", {
      class: this.ns.e("header")
    }, [l("div", {
      class: this.ns.em("header", "left")
    }, [l(oe, {
      items: s,
      onClick: (i) => this.c.handleBreadcrumbSkip(i)
    }, null)]), l("div", {
      class: this.ns.em("header", "right")
    }, [l("div", {
      id: "breadcrumb-nav-pos-searchbar"
    }, null), l("div", {
      id: "breadcrumb-nav-pos-toolbar"
    }, null)])]), h, this.isModalRoute && l(x("customModalRouterShell"), {
      modal: this.routeModal
    }, null)]);
  }
});
class ie extends X {
  constructor() {
    super(...arguments);
    /**
     * 面包屑数据
     *
     * @type {IBreadcrumb[]}
     * @memberof BreadcrumbNavPosState
     */
    w(this, "breadcrumb", []);
    /**
     * 显示面包屑
     *
     * @type {boolean}
     * @memberof BreadcrumbNavPosState
     */
    w(this, "showBreadcrumd", !0);
    /**
     * @description 路由key
     * @type {string}
     * @memberof BreadcrumbNavPosState
     */
    w(this, "routeManualKey", "DEFAULT");
  }
}
var S;
class ce extends Y {
  constructor() {
    super(...arguments);
    /**
     * 缓存识别码
     *
     * @protected
     * @type {string}
     * @memberof BreadcrumbNavPosController
     */
    w(this, "localStorageKey", "".concat((S = this.panel.view.model.codeName) == null ? void 0 : S.toLowerCase(), "@breadcrumb-nav-pos"));
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
    return new ie((e = this.parent) == null ? void 0 : e.state);
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
    let { pathNodes: a } = k(e);
    a = a.slice(this.routeDepth).filter((s) => s.viewName !== "route-modal"), e.fullPath.indexOf("/route-modal") !== -1 && (this.state.routeManualKey = e.fullPath), this.state.breadcrumb = await Promise.all(
      a.map(async (s, h) => {
        var b;
        const { context: d, params: i, viewName: m } = s, n = await ibiz.hub.config.view.get(m);
        let p = "undefined";
        if (n.appDataEntityId) {
          const C = q(n.appDataEntityId);
          p = (b = s.context) == null ? void 0 : b[C.toLowerCase()];
        }
        const v = this.calcCacheKey({
          key: p,
          viewId: m
        });
        return this.findBreadcrumb(v) || {
          key: p,
          params: i,
          context: g.create(
            {
              ...d,
              srfdefaulttoroutedepth: this.routeDepth + 2 + h
            },
            this.panel.context
          ),
          viewId: m
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
      const r = this.calcCacheKey(a);
      this.state.navViewMsgs[r] = a;
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
      const r = { ...a };
      r.context = (s = a.context) == null ? void 0 : s.getOwnContext(), e.push(r);
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
        return Array.isArray(a) ? (a.forEach((r) => {
          r.context = g.create(r.context, this.panel.context);
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
class le {
  constructor() {
    w(this, "component", "IBizBreadcrumbNavPos");
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
    const r = new ce(t, e, a);
    return await r.init(), r;
  }
}
const D = /* @__PURE__ */ P({
  name: "CustomModalRouterShell",
  props: {
    modal: {
      type: Object,
      required: !0
    }
  },
  setup(o) {
    const t = A(), e = K(), a = y(!1), r = y({}), s = [], h = () => {
      if (r.value.context) {
        const {
          context: n
        } = Q(r.value);
        n && n.destroy();
      }
    }, d = o.modal.routeDepth;
    let i = null;
    V(() => {
      a.value = !0, i && (i.dismiss(), i = null), h();
    });
    const m = async (n) => {
      var N;
      if (r.value = await Z(n, d, !0), a.value)
        return;
      r.value.context instanceof g || (r.value.context = g.create(r.value.context));
      const p = n.params.modalView, v = n.params.modalParams;
      if (v && v !== "-") {
        const c = se.parse(v, {
          strictNullHandling: !0,
          delimiter: ";"
        });
        if (c.srfnavctx) {
          const f = JSON.parse(decodeURIComponent(c.srfnavctx));
          Object.assign(r.value.context, f), delete c.srfnavctx;
        }
        c.srfnav && (r.value.srfnav = c.srfnav, delete c.srfnav), re(c) || (r.value.params ? Object.assign(r.value.params, c) : r.value.params = c);
      }
      if (!r.value.context) {
        const c = g.create({});
        r.value.context = c;
      }
      let u = r.value.viewConfig, b;
      try {
        u || (u = await ibiz.hub.config.view.get(p)), b = ee({
          context: r.value.context,
          params: r.value.params,
          viewId: u.id
        });
      } catch (c) {
        const f = L("404");
        f && (typeof f.component == "string" && (b = B(x(f.component))), b = B(f.component));
      }
      const C = {
        width: (u == null ? void 0 : u.width) || "80%",
        height: (u == null ? void 0 : u.height) || "80%",
        footerHide: !0,
        isRouteModal: !0
      };
      i = ibiz.overlay.createModal(b, void 0, C), i.present(), s.push(n.fullPath);
      const E = await i.onWillDismiss();
      if (i = null, a.value === !1) {
        const c = s.indexOf(n.fullPath);
        if (c !== -1 && s.splice(c, 1), (N = window.history.state) != null && N.back)
          e.back();
        else {
          const {
            path: f
          } = n, _ = f.indexOf("/".concat(R.ROUTE_MODAL_TAG, "/"));
          e.replace(f.substring(0, _));
        }
        te.close(e.currentRoute.value.fullPath, E || {
          ok: !1
        });
      }
    };
    return ae((n, p) => {
      if (!a.value && s.length > 0 && s.indexOf(p.fullPath) !== -1 && s.indexOf(n.fullPath) === -1) {
        const {
          pathNodes: v
        } = k(n), u = v[v.length - 1];
        u && u.viewName === R.ROUTE_MODAL_TAG && m(n);
      }
    }), m(t), {};
  },
  render() {
    return l("div", {
      style: "position: absolute;width: 0;height: 0;"
    }, null);
  }
}), we = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  install(o) {
    o.component(I.name, I), o.component(D.name, D), H(
      "CUSTOM_BREADCRUMB_NAV_POS",
      () => new le()
    );
  }
};
export {
  we as default
};
