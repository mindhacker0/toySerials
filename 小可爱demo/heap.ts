export class HeapNode<T> {
    constructor(public weight: number, public payload: T) {
        this.weight = weight;
        this.payload = payload;
    }
}
export function swap<T>(arr: T[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

abstract class HeapFace<T> {
    protected root: [null,...HeapNode<T>[]] = [null];
    protected size = 0;
    abstract offer(node:HeapNode<T>):void;
    abstract poll():HeapNode<T>|null;
    abstract peek():HeapNode<T>|null;
    abstract heapifyUp():void;
    abstract heapifyDown():void;
}

class Heap<T> extends HeapFace<T> {
    constructor(){
        super();
    }
    offer(node: HeapNode<T>): void {
        this.root.push(node);
        this.heapifyUp();
        this.size++;
    }
    poll(): HeapNode<T>|null {
        let result = null;
        if(this.root.length > 1) {
           swap(this.root, 1, this.root.length - 1);
           result = this.root.pop()!;
           this.heapifyDown();
           this.size--;
        }
        return result;
    }
    peek(): HeapNode<T>|null { return this.root[1] || null;}
    heapifyUp(): void {}
    heapifyDown(): void {}
}
//min head heap.
export class MinHeap<T> extends Heap<T> {
    constructor(){super();}
    heapifyUp(): void {
        const end = this.root.length - 1;
        let current = end;
        while(current > 1) {
           const parent = Math.floor(current / 2);
           if(this.root[current]!.weight < this.root[parent]!.weight) swap(this.root, current, parent);
           else break;
           current = parent;
        }
    }
    heapifyDown(): void {
        const start = 1,end = this.root.length - 1;
        let current = start;
        while((current<<1) <= end) {
            const left = current << 1;
            const right = left + 1;
            const next = right <= end && this.root[right]!.weight < this.root[left]!.weight ? right : left;
            if(this.root[current]!.weight <= this.root[next]!.weight) break;
            swap(this.root, current, next);
            current = next;
        }
    }
}
//max head heap
export class MaxHeap<T> extends Heap<T> {
    constructor(){super();}
    heapifyUp(): void {
        const end = this.root.length - 1;
        let current = end;
        while(current > 1) {
            const parent = Math.floor(current / 2);
            if(this.root[current]!.weight > this.root[parent]!.weight) swap(this.root, current, parent);
            else break;
            current = parent;
        }
    }
    heapifyDown(): void {
        const start = 1,end = this.root.length - 1;
        let current = start;
        while((current<<1) <= end) {
            const left = current << 1;
            const right = left + 1;
            const next = right <= end && this.root[right]!.weight > this.root[left]!.weight ? right : left;
            if(this.root[current]!.weight >= this.root[next]!.weight) break;
            swap(this.root, current, next);
            current = next;
        }
    }
}



