import './style.css';
var d = Object.defineProperty;
var u = (e, r, t) => r in e ? d(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var c = (e, r, t) => (u(e, typeof r != "symbol" ? r + "" : r, t), t);
import { ListController as f, registerControlProvider as b } from "@ibiz-template/runtime";
import { defineComponent as C, createVNode as i, resolveComponent as p, isVNode as h } from "vue";
import { useControlController as S, useNamespace as y } from "@ibiz-template/vue3-util";
class k extends f {
  constructor() {
    super(...arguments);
    /**
     * @description 部件名称
     * @memberof MobSimpleListController
     */
    c(this, "ctrlName", "tree");
  }
  get pickupCtrl() {
    var s;
    const t = (s = this.view.getController("pickupviewpanel")) == null ? void 0 : s.embedView;
    if (t) {
      const { viewType: o } = t.model;
      switch (o) {
        case "DEMOBPICKUPMDVIEW":
          this.ctrlName = "mdctrl";
          break;
        case "DEMOBPICKUPLISTVIEW":
          this.ctrlName = "list";
          break;
        case "DEMOBPICKUPTREEVIEW":
          this.ctrlName = "tree";
          break;
      }
      return t.getController(this.ctrlName);
    }
    return null;
  }
  /**
   * 删除项
   *
   * @param {IData} item
   * @memberof MobSimpleListController
   */
  handleRemove(t) {
    var a;
    const { items: s } = this.state, o = s.findIndex((n) => n.srfkey === t.srfkey);
    if (o !== -1 && s.splice(o, 1), this.ctrlName === "tree") {
      const n = s.map((l) => ({
        ...l,
        _id: l._id || l.srfkey
      }));
      (a = this.pickupCtrl) == null || a.setSelection([...n]);
    } else
      this.pickupCtrl.setSelection([...s]);
  }
  /**
   * 设置选中数据
   *
   * @param {IData[]} items
   * @memberof MobSimpleListController
   */
  setData(t) {
    if (this.state.items = t, this.ctrlName === "tree") {
      const s = t.map((o) => ({
        ...o,
        _id: o._id || o.srfkey
      }));
      this.pickupCtrl && (this.pickupCtrl.state.selectedData = s);
    }
  }
}
function L(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !h(e);
}
const m = /* @__PURE__ */ C({
  name: "MobSimpleList",
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
      default: 2
    },
    singleSelect: {
      type: Boolean,
      default: !0
    },
    isSimple: {
      type: Boolean,
      required: !1
    },
    loadDefault: {
      type: Boolean,
      default: !0
    }
  },
  setup() {
    const e = S((...s) => new k(...s)), r = y("mob-simple-list");
    return {
      c: e,
      ns: r,
      renderListContent: () => i("div", {
        class: r.b("content")
      }, [e.state.items.map((s) => i("div", {
        class: [r.b("item")]
      }, [i("span", {
        class: r.be("item", "caption")
      }, [s.srfmajortext]), i(p("ion-icon"), {
        name: "close-outline",
        class: r.be("item", "icon"),
        onClick: () => e.handleRemove(s)
      }, null)]))])
    };
  },
  render() {
    let e;
    return i(p("iBizControlBase"), {
      class: [this.ns.b()],
      controller: this.c
    }, L(e = this.renderListContent()) ? e : {
      default: () => [e]
    });
  }
});
class I {
  constructor() {
    c(this, "component", "MobSimpleList");
  }
}
const O = {
  install(e) {
    e.component(m.name, m), b(
      "LIST_RENDER_MOB_SIMPLE_LIST",
      () => new I()
    );
  }
};
export {
  O as default
};
