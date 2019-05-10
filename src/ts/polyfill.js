// es6补丁
const polyfill = () =>{
    // includes
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
          value: function(searchElement, fromIndex) {
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) {
              return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
              if (o[k] === searchElement) {
                return true;
              }
              k++;
            }
            return false;
          }
        });
      }

      if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
          value: function(predicate) {
           // 1. Let O be ? ToObject(this value).
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }
      
            var o = Object(this);
      
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
      
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
              throw new TypeError('predicate must be a function');
            }
      
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];
      
            // 5. Let k be 0.
            var k = 0;
      
            // 6. Repeat, while k < len
            while (k < len) {
              // a. Let Pk be ! ToString(k).
              // b. Let kValue be ? Get(O, Pk).
              // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
              // d. If testResult is true, return kValue.
              var kValue = o[k];
              if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
              }
              // e. Increase k by 1.
              k++;
            }
      
            // 7. Return undefined.
            return undefined;
          }
        });
      }
}
export default polyfill;