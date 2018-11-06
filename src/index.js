const Promise = require('bluebird');

function RuleSet(config, pluginManager) {
    function getRules() {
        return config || [];
    }
    
    function run(repoPath, options, level, callback) {
        const rules = getRules()
        return Promise.resolve(rules)
            .each((ruleSet) => {
                return pluginManager.installFromNpm(ruleSet.name)
                    .then(() => {
                        return pluginManager.require(ruleSet.name)
                    })
                    .then((package) => {
                        return package.run(repoPath, ruleSet.options, ++level, callback)
                    });
            });
    }
     
    return {
        getRules,
        run
    }
}

module.exports = RuleSet;
