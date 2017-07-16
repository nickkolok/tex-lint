jasmine.getFixtures().fixturesPath = 'webui';
 
describe('jquery sort plugin', function () {
    var elem;
    
    beforeEach(function () {
        //loadFixtures('playground.html');
/*
        jasmine.getFixtures().load('playground.html');
        elem = document.getElementById('tex-lint_main_html');
        //eval(document.body.parentElement.innerHTML+'()');
        //console.error(elem.innerHTML);
        throw new Error(document.innerHTML);
        document.body.innerHTML = elem.innerHTML;
*/
    });
    
    it('should  have French sorting', function () {
        //jasmine.getFixtures().load('playground.html');
/*        loadFixtures('playground.html_');
        elem = document.getElementById('tex-lint_main_html');
        //eval(document.body.parentElement.innerHTML+'()');
        //console.error(elem.innerHTML);
        throw (new Error(document.innerHTML));
        document.body.innerHTML = elem.innerHTML;
        */
        expect(document.getElementsByTagName('button').length).toEqual(2);

    });        
});
