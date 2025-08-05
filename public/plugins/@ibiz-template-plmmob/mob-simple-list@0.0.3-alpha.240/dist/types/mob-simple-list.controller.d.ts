import { ListController, MDControlController } from '@ibiz-template/runtime';
export declare class MobSimpleListController extends ListController {
    /**
     * @description 部件名称
     * @memberof MobSimpleListController
     */
    ctrlName: string;
    get pickupCtrl(): MDControlController | null;
    /**
     * 删除项
     *
     * @param {IData} item
     * @memberof MobSimpleListController
     */
    handleRemove(item: IData): void;
    /**
     * 设置选中数据
     *
     * @param {IData[]} items
     * @memberof MobSimpleListController
     */
    setData(items: IData[]): void;
}
