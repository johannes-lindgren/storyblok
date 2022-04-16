/**
 *  Originates from https://github.com/rhashimoto/promise-throttle/blob/master/index.js
 */
type AsyncFunction = (...args: any) => Promise<any>

// The exported function takes as input a function and returns a
// function returning a Promise that automatically delays calls to the
// original function such that the rate is kept below the specified
// number of calls in the specified number of milliseconds.
export default function <F extends AsyncFunction>(
    f: F,
    calls: number,
    milliseconds: number
): F {

    const queue: QueueObj[] = [];
    const complete: number[] = [];
    let inflight = 0;

    var processQueue = function () {
        // Remove old complete entries.
        const now = Date.now();
        while (complete.length && complete[0] <= now - milliseconds)
            complete.shift();

        // Make calls from the queue that fit within the limit.
        while (queue.length && complete.length + inflight < calls) {
            const request = queue.shift() as QueueObj;
            ++inflight;

            // Call the deferred function, fulfilling the wrapper Promise
            // with whatever results and logging the completion time.
            var p = f.apply(request.this, request.arguments);
            Promise.resolve(p).then((result) => {
                request.resolve(result);
            }, (error) => {
                request.reject(error);
            }).then(() => {
                --inflight;
                complete.push(Date.now());

                if (queue.length && complete.length === 1)
                    setTimeout(processQueue, milliseconds);
            });
        }

        // Check the queue on the next expiration.
        if (queue.length && complete.length)
            setTimeout(processQueue, complete[0] + milliseconds - now);
    };

    return function (this: any) {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            queue.push({
                this: this,
                arguments: arguments,
                resolve: resolve,
                reject: reject
            })

            processQueue()
        })
    } as F
};

type QueueObj = {
    this: any
    arguments: any,
    resolve: (value: any) => void,
    reject: (reason?: any) => void
}