(function ($) {
  module('jQuery.SimpleTmpl');

    $.SimpleTmpl.setSign("{","}");




  test('is SimpleTmpl', function () {
    expect(2);
    // strictEqual($.SimpleTmpl("testDiv",{name:"gg"}).trim(), '<div>gg</div>', 'should be SimpleTmpl');
    strictEqual($.SimpleTmpl("testFilter",{name:"gg",time:1458186760863/1000}).trim(), '<div>2016-03-18</div>', 'should be SimpleTmpl');
    strictEqual($.SimpleTmpl("testFilter2",{name:"gg",time:1458186760863/1000}).trim(), '<div>2016-03</div>', 'should be SimpleTmpl');
    strictEqual($.SimpleTmpl({punctuation: '!'}), 'SimpleTmpl!', 'should be thoroughly SimpleTmpl');
  });
  
}(jQuery));
