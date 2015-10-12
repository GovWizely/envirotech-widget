var EnvirotechWidget = {
  container: null,
  options: {},

  initialize: function() {
    EnvirotechWidget.container.empty();
    EnvirotechWidget.container.addClass('envirotech-widget-container');
    EnvirotechWidget.container.append(EnvirotechHTMLBuilder.languageSelection());
    EnvirotechWidget.container.append(EnvirotechHTMLBuilder.searchPanel());
    EnvirotechWidget.container.append(EnvirotechHTMLBuilder.resultsContainer());
  },

  loadData: function(type, options, callback, storeResult) {
    var url = EnvirotechWidget.options.host + EnvirotechWidget.searchPath(type);
    options.api_key = EnvirotechWidget.options.apiKey;

    $.ajax({
      url: url,
      data: options,
      dataType: 'json',
      success: function(data) {
        if (storeResult) { EnvirotechActiveRecord.data[type] = data.results; }
        callback(data.results, data.total, data.offset);
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
      options.host = 'https://api.govwizely.com',
      //options.host = 'http://127.0.0.1:3000',

      EnvirotechWidget.container = $(this);
      EnvirotechWidget.options   = options;

      EnvirotechWidget.initialize();
    };
  });
})();
