//generic list type ADT

export default class Base {
    constructor(type){
        this.type = type
        this.listSize = 0;
        this.pos = 0;
        this.data = [];
        this.clear = clear;
        this.find = find;
        this.toString = toString;
        this.insert = insert;
        this.append =  append;
        this.remove = remove;
        this.front = front;
        this.end = end;
        this.prev = prev;
        this.next = next;
        this.length = length;
        this.currPos = currPos;
        this.moveTo = moveTo;
        this.getElement = getElement;
        this.length = length;
        this.contains = contains;

    }
}

export function append(element){
    this.data[this.listSize++] = element;
}

export function find(element){
    for (var i=0; i <this.data.length; ++i){
        if (this.data[i] == element){
            return i;
        }
    }
    return -1;
}

export function remove(element){
    var foundAt = this.find(element);
    if (foundAt > -1){
        this.data.splice(foundAt, 1);
        --this.listSize;
        return true;
    }
    return false;
}

export function length(){
    return this.listSize;
}

export function toString(){
    return this.data;
}

export function insert(element, after){
    var insertPos = this.find(after);
    if (insertPos > -1){
        this.data.splice(insertPos+1, 0, element);
        ++this.listSize;
        return true;
    }
    return false;
}

export function clear(){
    delete this.data;
    this.data = [];
    this.listSize = this.pos = 0;
}

export function contains(element){
    for(var i = 0; i<this.data.length; ++i){
        if (this.data[i] == element){
            return true
        }
    }
    return false;
}

export function front(){
    this.pos = 0;
}

export function end(){
    this.pos = this.listSize -1;
}

export function prev(){
    if (this.pos > 0){
        --this.pos;
    }
}

export function next(){
    if (this.pos < this.listSize-1 ){
        ++this.pos;
    }
}

export function currPos(){
    return this.pos;
}

export function moveTo(position){
    this.pos = position;
}

export function getElement(){
    return this.data[this.pos];
}


