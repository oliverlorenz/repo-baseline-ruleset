const Promise = require('bluebird');

function RuleSet(packageJson) {
    function getRules() {
        return packageJson['repo-baseline'] || [];
    }
    
    function run(repoPath, options, level, callback) {
        return Promise.resolve(getRules())
            .each((ruleSet) => {
                const package = require.main.require(ruleSet.name);
                return package.run(repoPath, ruleSet.options, ++level, callback)
            });
    }
     
    return {
        getRules,
        run
    }
}

module.exports = RuleSet;
