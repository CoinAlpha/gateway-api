declare enum ChronologicalItemStatus {
    DORMANT = "DORMANT",
    PENDING = "PENDING",
    COMPLETE = "COMPLETE"
}
declare enum ChronologicalItemExitStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    UNSET = "UNSET"
}
interface ChronologicalItem<T extends Readonly<{
    type: string;
    payload: any;
}>> {
    action: T;
    activationStatus: ChronologicalItemStatus;
    exitStatus: ChronologicalItemExitStatus;
    errors: any[];
}
export declare class Chronological<ChronItemType extends ChronologicalItem<any>> {
    private _currentItem;
    private _items;
    constructor(_currentItem: ChronItemType);
    private _currentIndex;
    get currentItem(): ChronologicalItem<any>;
    get currentIndex(): number;
    get items(): Array<ChronologicalItem<any>>;
    get length(): number;
    get isEmpty(): boolean;
    get isFirst(): boolean;
    get isLast(): boolean;
    get isInProgress(): boolean;
    get isFinished(): boolean;
}
export {};
