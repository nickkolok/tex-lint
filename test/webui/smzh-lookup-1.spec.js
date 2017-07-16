describe('SMZH quick lookup no. 1', function () {
    beforeEach(function () {
        
    });
    
    it('should  have exportedControls', function () {
        window.exportedControls.switchToRuleset('smzh');
        expect(window.exportedControls).not.toEqual(undefined);
    });

    it('should  have non-empty example', function () {
        window.exportedControls.pasteExample();
        expect(window.exportedControls.myCodeMirror.getValue().length).not.toEqual(0);
    });

    it('should  have fix-buttons when checking example', function () {
        window.exportedControls.runcheck();
        expect($('.btn-fix-all').length).not.toEqual(0);
        expect($('.btn-fix-one').length).not.toEqual(0);
    });

    it('should  have working fix-all buttons', function(){
        var selector = '.btn-fix-all';

        window.exportedControls.pasteExample();
        window.exportedControls.runcheck();
        var fixbuttons; // = $(selector);
        do{
            fixbuttons = $(selector);
            var textBefore = window.exportedControls.myCodeMirror.getValue();
            fixbuttons[0].click();
            var textAfter = window.exportedControls.myCodeMirror.getValue();
            expect(textBefore).not.toEqual(textAfter);
        }while(fixbuttons.length > 1);
    });

    it('should  have working fix-one buttons', function(){
        var selector = '.btn-fix-one';

        window.exportedControls.pasteExample();
        window.exportedControls.runcheck();
        var fixbuttons; // = $(selector);
        do{
            fixbuttons = $(selector);
            var textBefore = window.exportedControls.myCodeMirror.getValue();
            fixbuttons[0].click();
            var textAfter = window.exportedControls.myCodeMirror.getValue();
            expect(textBefore).not.toEqual(textAfter);
        }while(fixbuttons.length > 1);
    });
});
