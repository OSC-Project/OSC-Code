/**
 * @id js/examples/call
 * @name Code injection custom 2 
 * @description Interpreting unsanitized user input as code allows a malicious user arbitrary
 *              code execution. Pattern for comman execution; example: (1, eval)(data)
 * @tag call
 *      function 
        eval
 * @kind problem
 */

import javascript
from CallExpr e, SeqExpr i
where e.getCallee().stripParens().toString() = i.toString()
select e, "Got it!"
