var EnvirotechWidget = {
  container: null,
  options: {},
  initialize: function() {
                EnvirotechWidget.container.empty();
                EnvirotechWidget.container.addClass('envirotech-widget-container');
                EnvirotechWidget.container.append(EnvirotechHTMLBuilder.languageSelection());
                EnvirotechWidget.container.append(EnvirotechHTMLBuilder.searchForm());
              }
};

(function () {
  jQuery(document).ready(function ($) {
    $.fn.envirotechWidget = function (options) {
      EnvirotechWidget.container = $(this);
      EnvirotechWidget.options   = options;

      EnvirotechWidget.initialize();
    };
  });
})();
