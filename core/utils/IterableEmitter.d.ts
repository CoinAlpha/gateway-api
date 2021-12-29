export declare class IterableEmitter<EventType> {
    private isEnded;
    private emitter;
    subject: {
        iterator: AsyncGenerator<EventType, any, unknown>;
        feed: (value: EventType) => void;
        end: () => void;
    };
    private listen;
    onValue(callback: (value: EventType) => void): () => void;
    onEnd(callback: () => void): () => void;
    generator(): AsyncGenerator<EventType, any, unknown>;
    emit(event: EventType): void;
    end(): void;
}
