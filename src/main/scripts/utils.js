;(function (window, undefined) {
  'use strict';

  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  /*
   * Hashcode.js 1.0.2
   * https://github.com/stuartbannerman/hashcode
   *
   * Copyright 2013 Stuart Bannerman (me@stuartbannerman.com)
   * Released under the MIT license
   *
   * Date: 07-04-2013
   */
  window.Hashcode = (function () {
    // Hashes a string
    var hash = function (string) {
      var hash = 0, i;
      string = string.toString();

      for (i = 0; i < string.length; i++) {
        hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
      }

      return hash;
    };
    // Deep hashes an object
    var object = function (obj) {
      var result = 0;
      for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
          result += hash(property + value(obj[property]));
        }
      }

      return result;
    };
    // Does a type check on the passed in value and calls the appropriate hash method
    var value = function (value) {
      var types =
      {
        'string': hash,
        'number': hash,
        'boolean': hash,
        'object': object
        // functions are excluded because they are not representative of the state of an object
        // types 'undefined' or 'null' will have a hash of 0
      };
      var type = typeof value;

      return value !== null && types[type] ? types[type](value) + hash(type) : 0;
    };

    return {
      value: value
    };
  })();

  /* escape, keys, has, and isObject functions taken from underscore.js
   *
   * Copyright (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and
   * Investigative Reporters & Editors
   *
   * Permission is hereby granted, free of charge, to any person
   * obtaining a copy of this software and associated documentation
   * files (the "Software"), to deal in the Software without
   * restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the
   * Software is furnished to do so, subject to the following
   * conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
   * OTHER DEALINGS IN THE SOFTWARE.
   */
  window._ = window._ || {};

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  var has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Is a given variable an object?
  var isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  var keys = function(obj) {
    if (!isObject(obj)) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
    var keys = [];
    for (var key in obj) {
      if (has(obj, key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = new RegExp(source);
    var replaceRegexp = new RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  window._.escape = createEscaper(escapeMap);

})(window);
