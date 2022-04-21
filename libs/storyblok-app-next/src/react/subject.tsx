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
        console.log('Subscribing new listener...')
        this.subscribers.add(subscriber)
        console.log(`There are ${subscriber.length} listeners`)
        return subscriber
    }

    unsubscribe(subscriber: Subscriber<T>) {
        this.subscribers.delete(subscriber)
    }
}

export {Subject, Subscriber};