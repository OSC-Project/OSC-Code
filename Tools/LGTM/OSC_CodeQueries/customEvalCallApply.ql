/**
 * @id js/examples/call
 * @name Code injection custom 2 
 * @description Interpreting unsanitized user input as code allows a malicious user arbitrary
 *              code execution. Pattern used for .call and .apply methods
 * @tag call
 *      function 
        eval
 * @kind problem
 */
import javascript
from MethodCallExpr e, IndexExpr i
where (e.calls(i,"call") or e.calls(i,"apply")) and i.getPropertyName()="eval"
select e, "Potential vulnerability"