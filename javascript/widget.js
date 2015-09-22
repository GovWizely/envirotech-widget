var EnvirotechWidget = {
  container: null,
  options: {},
  apiData: {},

  initialize: function() {
                EnvirotechWidget.container.empty();
                EnvirotechWidget.container.addClass('envirotech-widget-container');
                EnvirotechWidget.container.append(EnvirotechHTMLBuilder.languageSelection());
                EnvirotechWidget.container.append(EnvirotechHTMLBuilder.searchPanel());
                container.find('select').chosen();
              },

  loadData: function(type, options, callback) {
              var url = EnvirotechWidget.options.host + EnvirotechWidget.searchPath(type);
              options.api_key = EnvirotechWidget.options.apiKey;

              $.ajax({
                url: url,
                data: options,
                dataType: 'json',
                success: function(data) {
                  EnvirotechWidget.apiData[type] = data.results;
                  callback(EnvirotechWidget.apiData[type]);
                  container.find('select').trigger('chosen:updated');
                },
              });
            },

  searchPath: function(type) {
                return '/envirotech/' + type + '/search';
              }
};

(function () {
  jQuery(document).ready(function ($) {
    $.fn.envirotechWidget = function (options) {
      //options.host = 'https://api.govwizely.com',
      options.host = 'http://127.0.0.1:3000',

      EnvirotechWidget.container = $(this);
      EnvirotechWidget.options   = options;

      EnvirotechWidget.initialize();
    };
  });
})();
