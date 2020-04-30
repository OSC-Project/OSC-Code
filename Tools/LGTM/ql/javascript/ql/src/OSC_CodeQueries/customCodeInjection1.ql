/**
 * @id js/examples/call
 * @name Code injection custom 1 
 * @description Interpreting unsanitized user input as code allows a malicious user arbitrary
 *              code execution.
 * @tag call
 *      function 
        eval
 * @kind problem
 */
import javascript  
from VarDecl d, CallExpr e
where d.getVariable().getAnAssignedExpr().toString()="eval" and d.getVariable().getName() = e.getCalleeName()
select d, "here"