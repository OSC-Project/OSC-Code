/**
 * @name Database query built from user-controlled sources
 * @description Building a database query
 * @kind path-problem
 * @problem.severity error
 * @precision low
 * @id js/sql-injection
 * @tags security
 *       external/cwe/cwe-089
 */

import javascript
import semmle.javascript.security.dataflow.SqlInjection
import DataFlow::PathGraph

from DataFlow::Configuration config, DataFlow::PathNode source, DataFlow::PathNode sink
where config instanceof SqlInjection::Configuration
select sink.getNode(), source, sink, "here"
