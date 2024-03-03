//generic list type ADT

class Base{
    constructor(){
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

function append(element){
    this.data[this.listSize++] = element;
}

function find(element){
    for (var i=0; i <this.data.length; ++i){
        if (this.data[i] == element){
            return i;
        }
    }
    return -1;
}

function remove(element){
    var foundAt = this.find(element);
    if (foundAt > -1){
        this.data.splice(foundAt, 1);
        --this.listSize;
        return true;
    }
    return false;
}

function length(){
    return this.listSize;
}

function toString(){
    return this.data;
}

function insert(element, after){
    var insertPos = this.find(after);
    if (insertPos > -1){
        this.data.splice(insertPos+1, 0, element);
        ++this.listSize;
        return true;
    }
    return false;
}

function clear(){
    delete this.data;
    this.data = [];
    this.listSize = this.pos = 0;
}

function contains(element){
    for(var i = 0; i<this.data.length; ++i){
        if (this.data[i] == element){
            return true
        }
    }
    return false;
}

function front(){
    this.pos = 0;
}

function end(){
    this.pos = this.listSize -1;
}

function prev(){
    if (this.pos > 0){
        --this.pos;
    }
}

function next(){
    if (this.pos < this.listSize-1 ){
        ++this.pos;
    }
}

function currPos(){
    return this.pos;
}

function moveTo(position){
    this.pos = position;
}

function getElement(){
    return this.data[this.pos];
}

export {Base};




