var EnvirotechActiveRecord = {
  data: {},
  findById: function(type, id) {
    var ret = false;
    $.each(EnvirotechActiveRecord.data[type], function(i, record) {
      if(record['source_id'] == id) {
        ret = record;
        return;
      }
    });
    return ret;
  },

  all: function(type) {
         return EnvirotechActiveRecord.data[type];
       },
};
