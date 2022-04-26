type Subscriber<T> = (item: T) => void

class Subject<T> {

    private subscribers: Set<Subscriber<T>>

    constructor() {
        this.subscribers = new Set<Subscriber<T>>()
    }

    next(item: T) {
        this.subscribers.forEach(subscriber => subscriber(item))
    }

    subscribe(subscriber: Subscriber<T>) {
        console.debug('Subscribing new listener...')
        this.subscribers.add(subscriber)
        console.debug(`There are ${this.subscribers.size} listeners`)
        return subscriber
    }

    unsubscribe(subscriber: Subscriber<T>) {
        this.subscribers.delete(subscriber)
    }
}

export {Subject, Subscriber};