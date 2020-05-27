/**
 * @name Use of eval through JS features
 * @description Non-standard language features such as expression closures or let expressions
 *              make it harder to reuse code.
 * @kind problem
 * @problem.severity warning
 * @id js/non-standard-language-feature
 * @tags portability
 *       maintainability
 *       language-features
 *       external/cwe/cwe-94
 * @precision low
 */

import javascript

/**
 * Holds if `nd` is a use of deprecated language feature `type`, and `replacement`
 * is the recommended replacement.
 */
predicate eval_feature(ASTNode nd, string type, string replacement) {
  exists(FunctionExpr fe | fe = nd and fe.getBody() instanceof Expr |
    type = "eval" and replacement = "arrow expressions"
  )
  or
  nd instanceof LegacyLetExpr and type = "eval" and replacement = "let declarations"
  or
  nd instanceof ForEachStmt and type = "eval" and replacement = "for of statements"
  or
  nd.(ComprehensionExpr).isPostfix() and
  type = "eval" and
  replacement = "prefix comprehensions"
  or
  nd.(ExprStmt).isDoubleColonMethod(_, _, _) and
  type = "eval" and
  replacement = "standard method definitions"
}

from ASTNode depr, string type, string replacement
where deprecated_feature(depr, type, replacement)
select depr, "Use of " + type + "."
