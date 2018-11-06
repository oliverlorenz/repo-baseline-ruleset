const Promise = require('bluebird');
const packageJson = require('../package.json')

function RuleSet(pluginManager, repoPath, config) {
    function getRules() {
        return config || packageJson['repo-baseline'] || [];
    }
    
    function run(callback, level = 1, options = {}) {
        const rules = getRules()
        return Promise.resolve(rules)
            .each((ruleSet) => {
                console.log(`${"  ".repeat(level)} ${ruleSet.name}`)
                return pluginManager.installFromNpm(ruleSet.name)
                    .then(() => {
                        return pluginManager.require(ruleSet.name)
                    })
                    .then((package) => {
                        console.log(package)
                        const plugin = package(pluginManager, repoPath);
                        return plugin.run(callback, ++level, ruleSet.options);
                    });
            });
    }
     
    return {
        run
    }
}

module.exports = RuleSet;
