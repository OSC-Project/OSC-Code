import javascript

query predicate test_RouteSetup_getARouteHandler(Connect::RouteSetup r, DataFlow::SourceNode res) {
  res = r.getARouteHandler()
}
