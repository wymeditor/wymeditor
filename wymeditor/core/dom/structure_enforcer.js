Wymeditor.ns('dom').structureEnforcer = (function($, undefined) {
	var enforcers = [];
		
	function addEnforcer (func, weight) {
		weight = weight || 0;
		
		// Arrays are sparse, so we can put enforcers at whatever index we like
		if (Wymeditor.utils.is('Array', enforcers[weight]) {
			enforcers[weight].push(func);
		} else {
			enforcers[weight] = [func];
		}
	}

	function makeNiceAndTidy (nodes, structureManager, stack) {
		var node,
			rules,
			enforcer,
			i, j, k;
		
		stack = stack || [];
		
		for (i = 0; node = nodes[i]; i++) {
			rules = structureManager.getNodeRules(node.name);

			// Start at the leaves and work our way up (or should it be down, 
			// sticking with the tree metaphor?)
			if (node.children && node.children.length) {
				stack.push(node.name);
				makeNiceAndTidy(node.children, structureManager, stack);
				stack.pop();
			}

			// Run the heaviest enforcers first, i.e. start from the back
			for (j = enforcers.length; j > 0; j--) {
				if (enforcers[j] !== undefined) {
	 				for (k = 0; enforcer = enforcers[j][k]; k++) {
	 					nodes[i] = enforcer(node, rules, stack);
	 				}
				}
			}
		}
	}
	
	return {
		addEnforcer: addEnforcer,
		enforce: makeNiceAndTidy
	};
})(jQuery);