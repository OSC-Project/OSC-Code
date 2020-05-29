/**
 * @id js/examples/call
 * @name Custom Eval Property
 * @description Interpreting unsanitized user input as code allows a malicious user arbitrary
 *              code execution. Pattern focused on array-like properties
 * @tag call
 *      function
        eval
 * @kind problem
 */

import javascript
from CallExpr e, IndexExpr i
where e.getCallee()=i
select e, "here"
