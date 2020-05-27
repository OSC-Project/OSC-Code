/**
 * @id js/examples/call
 * @name Code injection custom 2 
 * @description Interpreting unsanitized user input as code allows a malicious user arbitrary
 *              code execution. Pattern for using call to global window.
 * @tag call
 *      function 
        eval
 * @kind problem
 */
import javascript
from MethodCallExpr e, IndexExpr i
where (e.calls(i,"call") or e.calls(i,"apply")) and i.getPropertyName()="eval" and i.getBase().toString()="window"
select e, "Potential vulnerability"