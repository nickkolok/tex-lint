'use strict';
QUnit.module("Rules");

test("Rules-all", function () {
    //var ls = require(ls);
    var ruleTests = ls('test/ruletests/*.json');
    ruleTests.map(function(file){
        var text = fs.readFileSync(file.full, 'utf-8');
        var obj = JSON.parse(text);
        var result = applyRuleToString(obj.text, obj.rulename);
        assert.deepEqual(
            JSON.parse(JSON.stringify(result)), // Костыль, но иначе QUnit не признаёт равенство
            obj,
            file.name
        );
    });
    //applyRuleToFile('../webui/tex-examples/' + filename, rulename, writeToFile);
});
