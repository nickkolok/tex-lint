jasmine.getFixtures().fixturesPath = 'webui';
 
describe('basic interface', function () {
  
    beforeEach(function () {
        
    });
    
    it('should  have 2 buttons', function () {
        expect(document.getElementsByTagName('button').length).toEqual(2);
    });        
});
