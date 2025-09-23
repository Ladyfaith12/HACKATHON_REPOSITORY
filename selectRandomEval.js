function selectRandomEval(context, events, done) {
  const ids = context.vars.eval_id;
  context.vars.eval_id = ids[Math.floor(Math.random() * ids.length)];
  return done();
}
