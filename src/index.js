const Promise = require('bluebird');
const packageJson = require('../package.json')

function RuleSet(pluginManager, repoPath, config) {
    function getRules() {
        return config || packageJson['repo-baseline'] || [];
    }
    
    function run(callback, level = 0, options = {}) {
        const rules = getRules()
        return Promise.resolve(rules)
            .each((ruleSet) => {
                console.log(`${"  ".repeat(level)} ${ruleSet.name}`)
                return pluginManager.installFromNpm(ruleSet.name)
                    .then(() => {
                        return pluginManager.require(ruleSet.name)
                    })
                    .then((package) => {
                        const plugin = package(pluginManager, repoPath);
                        return plugin.run(callback, ++level, ruleSet.options)
                            .catch((err) => {
                                console.log(err)
                            })
                    });
            });
    }
     
    return {
        run
    }
}

module.exports = RuleSet;
