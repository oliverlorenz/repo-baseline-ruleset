const rulesetProvider = require('../../../src/rulesetProvider');
const { expect } = require('chai')
const path = require('path');

describe(__filename, () => {
    it('return empty array, if repo does not have any information', () => {
        const pathToModule = path.join(
            process.cwd(), 
            'test/assets/bare-repo'
        );
        const rules = rulesetProvider(undefined, pathToModule);
        expect(rules).to.include.members([]);
    })

    describe('return informations from package.json', () => {
        it('if they are available in package.json', () => {
            const pathToModule = path.join(
                process.cwd(), 
                'test/assets/repo-with-package-json'
            );
            const rules = rulesetProvider(undefined, pathToModule);
            expect(rules.length).equals(1)
            expect(rules[0]).deep.equal({
                name: 'a-rule-package',
                options: {}
            });

        })
        it('if they are available in package.json, also if there is also a ruleset.yml', () => {
            const pathToModule = path.join(
                process.cwd(), 
                'test/assets/repo-with-both'
            );
            const rules = rulesetProvider(undefined, pathToModule);
            expect(rules.length).equals(1)
            expect(rules[0]).deep.equal({
                name: 'a-rule-package-from-package-json'
            });
        })
    })

    it('return informations from ruleset.yml if they are available', () => {
        it('if they are available in package.json, also if there is also a ruleset.yml', () => {
            const pathToModule = path.join(
                process.cwd(), 
                'test/assets/repo-with-ruleset-yml'
            );
            const rules = rulesetProvider(undefined, pathToModule);
            expect(rules.length).equals(1)
            expect(rules[0]).deep.equal({
                name: 'a-rule-package',
                options: {
                    key: 'value'
                }
            });
        })
    })

})
