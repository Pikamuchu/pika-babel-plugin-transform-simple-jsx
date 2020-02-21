'use strict';

module.exports = function(t) {
  var CLEAN_JSX_SPACES_REGEX = /(\r?\n)\s+/g;
  var CLEAN_JSX_ATTRIBUTES_VALUES_REGEX = /\s*=\s*'?"?\{(\w*)\}'?"?/g;
  var CLEAN_JSX_ATTRIBUTES_VALUES_REPLACE = '="{$1}"';
  var MAX_INTERPOLATE_VARIABLE_ITERATIONS = 10000;

  /**
   * Transform JsxElement to a jsx string.
   *
   * @param {path} path - Babel path
   * @returns {expression}
   */
  function buildJsxString(path) {
    var expression;

    var jsxTemplate = path.toString().replace(CLEAN_JSX_SPACES_REGEX, '');
    if (jsxTemplate.indexOf('{') > -1) {
      var jsxTemplate = jsxTemplate.replace(CLEAN_JSX_ATTRIBUTES_VALUES_REGEX, CLEAN_JSX_ATTRIBUTES_VALUES_REPLACE);
    }

    var iteration = 0;
    var finish = false;
    while (!finish && iteration < MAX_INTERPOLATE_VARIABLE_ITERATIONS) {
      var interpolateExpressionStartIndex = jsxTemplate.indexOf('{');
      var interpolateExpressionEndIndex = calculateInterpolateExpressionEndIndex(
        jsxTemplate,
        interpolateExpressionStartIndex
      );
      if (
        interpolateExpressionStartIndex > -1 &&
        interpolateExpressionEndIndex > -1 &&
        interpolateExpressionStartIndex < interpolateExpressionEndIndex
      ) {
        expression = createJsxInterpolateExpressionTemplatePortionExpression(
          expression,
          jsxTemplate,
          interpolateExpressionStartIndex,
          interpolateExpressionEndIndex
        );
        jsxTemplate = jsxTemplate.substring(interpolateExpressionEndIndex + 1, jsxTemplate.length);
        iteration++;
      } else {
        expression = createJsxTemplateExpression(expression, jsxTemplate);
        finish = true;
      }
    }

    return expression;
  }

  /**
   * Create the new JSX expression.
   * @example
   *   var jsx = new JSX(jsxString);
   *
   * @param {expression} jsxString - jsx to parse as string expression
   * @returns {callExpression}
   */
  function createCallJsxExpression(jsxString) {
    return t.callExpression(t.identifier('JSX'), [jsxString]);
  }

  /**
   * Check parent path and add the built expression to it.
   * @param {path} path - Babel path
   * @returns {path} parentPath
   */
  function addExpressionToPath(path, expression) {
    var resultIdentifier = getResultIdentifier(path);
    var parentPath = path && path.parentPath;
    if (!parentPath) {
      path.replaceWith(expression);
    } else if (t.isVariableDeclarator(parentPath)) {
      parentPath.parentPath.replaceWith(
        t.variableDeclaration('var', [t.variableDeclarator(t.identifier(resultIdentifier.name), expression)])
      );
    } else {
      path.replaceWith(expression);
    }
  }

  /**
   * Create the require JSX expression.
   * @example
   *   var JSX = require("simple-jsx");
   *
   * @param {expression} jsxString - jsx to parse as string expression
   * @returns {callExpression}
   */
  function createRequireJsxExpression() {
    return t.variableDeclaration('var', [
      t.variableDeclarator(
        t.identifier('JSX'),
        t.callExpression(t.identifier('require'), [t.stringLiteral('simple-jsx')])
      )
    ]);
  }

  function calculateInterpolateExpressionEndIndex(jsxTemplate, interpolateExpressionStartIndex) {
    var interpolateExpressionEndIndex = jsxTemplate.indexOf('}');
    var preIndex = interpolateExpressionStartIndex + 1;
    var endIndex = interpolateExpressionEndIndex;
    while (jsxTemplate.substring(preIndex, interpolateExpressionEndIndex).indexOf('{') > -1 && endIndex > 0) {
      preIndex = preIndex + jsxTemplate.substring(preIndex, interpolateExpressionEndIndex).indexOf('{');
      var endIndex = jsxTemplate.substring(interpolateExpressionEndIndex + 1).indexOf('}') + 1;
      interpolateExpressionEndIndex += endIndex;
    }
    return interpolateExpressionEndIndex;
  }

  function createJsxInterpolateExpressionTemplatePortionExpression(
    startExpression,
    jsxTemplate,
    interpolateExpressionStartIndex,
    interpolateExpressionEndIndex
  ) {
    var expression = startExpression
      ? t.binaryExpression(
          '+',
          startExpression,
          t.stringLiteral(jsxTemplate.substring(0, interpolateExpressionStartIndex))
        )
      : t.stringLiteral(jsxTemplate.substring(0, interpolateExpressionStartIndex));
    return t.binaryExpression(
      '+',
      expression,
      createInterpolatedExpression(
        jsxTemplate.substring(interpolateExpressionStartIndex + 1, interpolateExpressionEndIndex)
      )
    );
  }

  function createJsxTemplateExpression(startExpression, jsxTemplate) {
    return startExpression
      ? t.binaryExpression('+', startExpression, t.stringLiteral(jsxTemplate))
      : t.stringLiteral(jsxTemplate);
  }

  function createInterpolatedExpression(interpolatedString) {
    return t.identifier('(' + interpolatedString + ')');
  }

  function getResultIdentifier(path) {
    var result;
    var parentNode = path && path.parentPath && path.parentPath.node;
    if (!parentNode) {
      result = t.identifier('nullParentNode');
    } else if (t.isAssignmentExpression(parentNode)) {
      result = parentNode.left;
    } else if (t.isVariableDeclarator(parentNode)) {
      result = parentNode.id;
    } else {
      result = t.identifier('identifierNotFound');
    }
    return result;
  }

  return {
    buildJsxString: buildJsxString,
    createCallJsxExpression: createCallJsxExpression,
    addExpressionToPath: addExpressionToPath,
    createRequireJsxExpression: createRequireJsxExpression
  };
};
