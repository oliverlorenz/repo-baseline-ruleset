const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');

function ruleProvider(config, moduleBasePath = '..') {
    function getRulesFromPackageJson() {
        try {
            const packageJson = require(path.join(moduleBasePath, 'package.json'));
            return packageJson['repo-baseline']
        } catch (err) { }
    }

    function getRulesFromYaml() {
        try {
            return yaml.safeLoad(fs.readFileSync(path.join(moduleBasePath, 'ruleset.yml'), 'utf8'));
        } catch (e) { }
    }

    return config || getRulesFromPackageJson() || getRulesFromYaml() || [];
}

module.exports = ruleProvider;
