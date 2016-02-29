describe('memeryJS Initialisation', function() {

		var form;

		beforeEach(function(){
				jasmine.getFixtures().fixturesPath = 'base/Tests';
				loadFixtures('Template.html');
				form = $('form.mermery');
			  form.mermery();
	  });

	  it('Should restore the initial value to the element', function() {
				var initialValue = $('input[name="test-text"]', form).val();
				$('input[name="test-text"]', form).val('alehop');
				expect(initialValue == $('input[name="test-text"]', form).val()).toBe(false);
				form.mermery('unstash');
				expect(initialValue == $('input[name="test-text"]', form).val()).toBe(true);
	  });

		it("Shouldn't restore the initial value to the element", function() {
				var initialValue = $('input[name="test-text"]', form).val();
				$('input[name="test-text"]', form).val('alehop');
				expect(initialValue == $('input[name="test-text"]', form).val()).toBe(false);
				form.mermery('clear');
				expect(initialValue == $('input[name="test-text"]', form).val()).toBe(false);
	  });

});
