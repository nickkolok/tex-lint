QUnit.module("Module A");

test("first test within module", 1, function () {
    ok(true, "a dummy");
});

test("second test within module", 2, function () {
    ok(true, "dummy 1 of 2");
    ok(true, "dummy 2 of 2");
});
