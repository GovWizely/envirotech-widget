var EnvirotechWidget = {
  container: null,
  options: {},
  initialize: function() {
                EnvirotechWidget.container.empty();
                EnvirotechWidget.container.addClass('envirotech-widget-container');
                EnvirotechWidget.container.append(EnvirotechHTMLBuilder.languageSelection());
                EnvirotechWidget.container.append(EnvirotechHTMLBuilder.searchForm());
              },

  loadData: function(path, options, callback) {
              var url = EnvirotechWidget.options.host + path;
              options.api_key = EnvirotechWidget.options.apiKey;

              $.ajax({
                url: url,
                data: options,
                dataType: 'json',
                success: function(data) {
                  callback(data);
                },
              });
            },
};

(function () {
  jQuery(document).ready(function ($) {
    $.fn.envirotechWidget = function (options) {
      options.host = 'https://api.govwizely.com',

      EnvirotechWidget.container = $(this);
      EnvirotechWidget.options   = options;

      EnvirotechWidget.initialize();
    };
  });
})();
