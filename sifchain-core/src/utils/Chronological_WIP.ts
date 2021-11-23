enum ChronologicalItemStatus {
  DORMANT = "DORMANT",
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
}
enum ChronologicalItemExitStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  UNSET = "UNSET",
}
interface ChronologicalItem<
  T extends Readonly<{ type: string; payload: any }>
> {
  action: T;
  activationStatus: ChronologicalItemStatus;
  exitStatus: ChronologicalItemExitStatus;
  errors: any[];
}
export class Chronological<ChronItemType extends ChronologicalItem<any>> {
  private _items: Array<ChronItemType> = [];
  constructor(private _currentItem: ChronItemType) {}
  private _currentIndex: number = 0;

  public get currentItem(): ChronologicalItem<any> {
    return this._currentItem;
  }

  public get currentIndex(): number {
    return this._currentIndex;
  }

  public get items(): Array<ChronologicalItem<any>> {
    return this._items;
  }

  public get length(): number {
    return this._items.length;
  }

  public get isEmpty(): boolean {
    return this._items.length === 0;
  }

  public get isFirst(): boolean {
    return this._currentIndex === 0;
  }

  public get isLast(): boolean {
    return this._currentIndex === this._items.length - 1;
  }

  public get isInProgress(): boolean {
    return this._currentItem !== undefined;
  }

  public get isFinished(): boolean {
    return this._currentItem === undefined;
  }
}
