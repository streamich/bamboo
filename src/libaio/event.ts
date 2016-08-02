

export interface IEventPoll {

    /**
     * Blocks while waiting for events.
     * @param timeout Time in milliseconds
     */
    wait(timeout: number);

}
