/**
 * performs deep clone. Not able to deep clone closures, enclosed values
 * still point to original reference, so this is not full deep clone in all situations.
 * Anyway it is able to detect circular references
 */
function clone(x) {
  if (isArray(x)) {
    return cloneArray(x);
  } else if (isFunction(x)) {
    return x;
  }else if(isObject(x)) {
    return cloneObject(x);
  }else {
    return x;
  }

}

/**
 * objects constructed by other functions than Object, because those cannot be
 simply copied as simple object
 */
function isObject(o) {
  //typeof o === "object" inclues arrays and everything else, we want to target only objec-objects here
  return Object.prototype.toString.call(o) === "[object Object]";
};

function isArray(a) {
  return Object.prototype.toString.call(a) === '[object Array]';
}

/**
 * detects just pure functions
 */
function isFunction(f){
  if(f instanceof Function) return true;
  return false;
}

function cloneArray(arr) {
  var cloned = arr.map(function(member) {
    return clone(member);
  });
  return cloned;
}

/**
 * @param obj object to clone
 * @param sources if recursive, allready cloned objects in order to avoid circular references
 * @param clones allready cloned source objects, for avoiding circular references
 */
function cloneObject(obj, sources, clones) {
  if (!obj) return obj;
  if (obj.clone && isFunction(obj.clone)) return obj.clone();
  if(obj instanceof Date) {
    //date is built in type and can be created only by invoking new Date()
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    //there are more such objects as Error, but they are ignored here
    return new Date(obj.getTime());
  }
  sources = sources || [];
  clones = clones || [];
  var target = Object.create(obj);
  var properties = Object.getOwnPropertyNames(obj);
    properties.forEach( function(property) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, property);
      descriptor.value = _getValue2Assign(descriptor.value, obj, target, sources, clones);
      Object.defineProperty(target, property, descriptor);
    });
  return target;
}


function _getValue2Assign(value, objectBeingCloned, target, sources, clones) {
  if (!isObject(value)){
    return clone(value);
  }else if(value.clone) {//cloneable
    var target = value.clone();
    if (target && value.constructor.prototype.isPrototypeOf(clone.constructor.prototype)) {
      return target;
    }
    return _getObjectValue2Assign(value, objectBeingCloned, target, sources, clones);
  }
  //else we deal with new object
  return _getObjectValue2Assign(value, objectBeingCloned, target, sources, clones);
}

function _getObjectValue2Assign(value, objectBeingCloned, target, sources, clones) {
  var allreadyClonedIndex = sources.indexOf(value);
  if(allreadyClonedIndex !== -1) {
    return clones[allreadyClonedIndex];
  }else {
    sources.push(objectBeingCloned);
    clones.push(target);
    return cloneObject(value, sources, clones);
  }
}

module.exports=clone;
