function selectRandomEval(context, events, done) {
  const ids = context.vars.eval_ids; // MUST match the capture "as" name
  if (!ids || ids.length === 0) {
    console.log("No eval_ids captured:", context.vars);
    return done(new Error("No valid eval_ids found"));
  }

  // Filter out any undefined or invalid IDs
  const validIds = ids.filter(id => id && id !== "undefined");

  // Pick a random eval_id from the valid list
  context.vars.eval_id = validIds[Math.floor(Math.random() * validIds.length)];

  console.log("Random eval_id selected:", context.vars.eval_id);
  return done();
}
