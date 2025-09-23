// selectRandomEval.js
module.exports = {
  selectRandomEval: function(context, events, done) {
    // Get the captured eval_ids
    let ids = context.vars.eval_ids || [];
    
    // Handle case where eval_ids might be a string instead of array
    if (typeof ids === 'string') {
      try {
        ids = JSON.parse(ids);
      } catch (e) {
        ids = [ids];
      }
    }
    
    // Ensure we have an array
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    
    // Filter out invalid IDs
    ids = ids.filter(id => 
      typeof id === 'string' && 
      id.length > 0 &&
      id !== 'undefined' &&
      id !== 'null'
    );
    
    if (ids.length > 0) {
      // Select a random ID from the array
      const randomIndex = Math.floor(Math.random() * ids.length);
      context.vars.eval_id = ids[randomIndex];
    } else {
      // Fallback: extract from full response manually
      const fullResponse = context.vars.full_response;
      if (fullResponse && Array.isArray(fullResponse)) {
        const extractedIds = fullResponse
          .map(item => item.eval_id)
          .filter(id => id && typeof id === 'string' && id.length > 0);
        
        if (extractedIds.length > 0) {
          const randomIndex = Math.floor(Math.random() * extractedIds.length);
          context.vars.eval_id = extractedIds[randomIndex];
        } else {
          context.vars.eval_id = null;
        }
      } else {
        context.vars.eval_id = null;
      }
    }
    
    // Call done() to continue the scenario
    return done();
  }
};