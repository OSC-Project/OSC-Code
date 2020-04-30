/**
 * @id js/examples/call
 * @name Code injection custom 2 
 * @description Interpreting unsanitized user input as code allows a malicious user arbitrary
 *              code execution.
 * @tag call
 *      function 
        eval
 * @kind problem
 */
import javascript
from CallExpr c
where c.getCalleeName() = "eval"
select c, "Here" 