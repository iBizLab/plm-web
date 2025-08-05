import { IDETree, IDETreeNode } from '@ibiz/model-core';
import { ITreeController, ITreeEvent, ITreeNodeData, ITreeState, TreeController } from '@ibiz-template/runtime';
import { TrackTreeGridService } from './track-tree-grid.service';
export type DropNodeRS = {
    minorEntityId: string;
    pickupDEFName: string;
    childDETreeNodeId: string;
};
export interface ITrackTreeGridDETreeNode extends IDETreeNode {
    /**
     * 是否显示
     * @type {boolean}
     */
    visible: boolean;
    /**
     * 允许配置
     * @type {boolean}
     */
    enableSetting: boolean;
}
export interface ITrackTreeGridNodeData extends ITreeNodeData {
    /**
     * 节点展开
     * @type {boolean}
     */
    _expanded: boolean;
}
export interface ITrackTreeGridState extends ITreeState {
    /**
     * 是否已经刷新过了，适配初始化加载后的无感刷新
     * @type {boolean}
     */
    isRefresh: boolean;
}
/**
 * 跟踪树表格部件控制器
 * @export
 * @class TrackTreeGridController
 * @extends {TrackTreeGridController<IDETree, ITrackTreeGridState, ITreeEvent>}
 * @implements {ITreeController}
 */
export declare class TrackTreeGridController<T extends IDETree = IDETree, S extends ITrackTreeGridState = ITrackTreeGridState, E extends ITreeEvent = ITreeEvent> extends TreeController<T, S, E> implements ITreeController<T, S, E> {
    service: TrackTreeGridService;
    /**
     * 行展开节点标识集合
     *
     * @type {string[]}
     * @memberof TrackTreeGridController
     */
    rowExpandedKeys: string[];
    protected initState(): void;
    /**
     * 初始化对应类型的部件服务
     * @author lxm
     * @date 2023-12-21 11:25:33
     * @protected
     * @return {*}  {Promise<void>}
     */
    protected initService(): Promise<void>;
    /**
     * 部件刷新，走初始加载(规避预置后续刷新和通知刷新同时进行)
     * @return {*}  {Promise<void>}
     */
    refresh(): Promise<void>;
    /**
     * loadNodes加载完子数据之后的处理
     * @param {ITreeNodeData[]} nodes 加载回来的子数据
     * @return {*}  {Promise<void>}
     */
    afterLoadNodes(nodes: ITreeNodeData[]): Promise<void>;
    /**
     * 行展开收缩切换
     *
     * @param {IData} nodeData
     * @param {boolean} [_expanded=false]
     * @memberof TrackTreeGridController
     */
    onRowExpandItem(nodeData: IData, _expanded?: boolean): void;
}
