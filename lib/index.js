'use strict';

module.exports = function(babel) {
  var t = babel.types;
  var h = require('./jsxToStringHelper')(t);

  return {
    inherits: require('@babel/plugin-syntax-jsx').default,
    visitor: {
      JSXElement: {
        exit(path, file) {
          if (!isInsideJsxElement(path)) {
            var jsxString = h.buildJsxString(path);
            if (jsxString) {
              var callJsxExpression = h.createCallJsxExpression(jsxString);
              h.addExpressionToPath(path, callJsxExpression);
            }
          }
        }
      },
      Program: {
        enter(path, state) {
          if (containsJsxElement(path)) {
            path.unshiftContainer('body', h.createRequireJsxExpression());
          }
        }
      }
    }
  };

  /**
   * Check if path is inside of a JsxElement
   * @param {path} path - Babel path
   * @returns {boolean} true if path is inside of a JsxElement
   */
  function isInsideJsxElement(path) {
    return path.parentPath ? t.isJSXElement(path.parentPath) : false;
  }

  /**
   * Check if path contains a JsxElement
   * @param {path} path - Babel path
   * @returns {boolean} true if path constains a JsxElement
   */
  function containsJsxElement(path) {
    var jsxChecker = {
      hasJsx: false
    };
    path.traverse(
      {
        JSXElement() {
          this.hasJsx = true;
        }
      },
      jsxChecker
    );
    return jsxChecker.hasJsx;
  }
};
