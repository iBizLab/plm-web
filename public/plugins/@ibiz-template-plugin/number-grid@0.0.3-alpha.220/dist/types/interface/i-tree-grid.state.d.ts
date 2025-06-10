import { ITreeGridState } from '@ibiz-template/runtime';
export interface INumberTreeGridState extends ITreeGridState {
    /**
     * 已加载的节点map
     *
     * @type {Map<string, any>}
     * @memberof INumberTreeGridState
     */
    nodeLoadedMap: Map<string, any>;
    /**
     * 表格刷新key值
     *
     * @type {string}
     * @memberof INumberTreeGridState
     */
    tableKey: string;
}
