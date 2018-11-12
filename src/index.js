const Promise = require('bluebird');
const yaml = require('js-yaml');
const fs   = require('fs');
const packageJson = require('../package.json');
const getRules = require('./rulesetProvider')

function RuleSet(pluginManager, repoPath, config) {
    function run(callback, level = 0, options = {}) {
        const rules = getRules(repoPath, config)
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
