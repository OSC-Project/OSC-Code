/**
 * @name Call to eval-like DOM function
 * @description 'eval' and execute strings as code are dangerous 
 * @kind problem
 * @problem.severity recommendation
 * @id js/eval-like-call
 * @tags maintainability
 *       external/cwe/cwe-94
 * @precision low
 */

import javascript

/**
 * A call to either `setTimeout` or `setInterval` where
 * a string literal is passed as first argument.
 */
class ETwin extends DataFlow::CallNode {
  ETwin() {
    exists(string fn | fn = "setTimeout" or fn = "setInterval" |
      this = DataFlow::globalVarRef(fn).getACall() and
      getArgument(0).asExpr() instanceof ConstantString
    )
  }
}

/**  `window.execScript`. */
class ExecScript extends DataFlow::CallNode {
  ExecScript() { this = DataFlow::globalVarRef("execScript").getACall() }
}

/** A call to a function that may evaluate a string as code. */
class PseudoEval extends DataFlow::Node {
  PseudoEval() {
    this instanceof ETwin or
    this instanceof ExecScript
  }
}

from PseudoEval pe
select pe, "Avoid using functions that evaluate strings as code."
