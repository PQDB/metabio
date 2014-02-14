/*global jQuery, window, document, self, _gaq, Drupal, google */
(function($) {

  Drupal.behaviors.metabio_tags = {

    attach: function() {
      this.attachTags();
      this.fillTagsTable();
    },

    attachTags: function() {
      var self = this, keyCode = "", sp = "";

      $('#edit-tags-input').keypress(function(e) {
        keyCode = e.keyCode || e.charCode;
        if(keyCode === 13) {
          e.preventDefault();
          sp = $(this).val();
          $('#tagstbl').append(self.buildTagsRow(sp));
          self.bindDeleteButtons();
          $(this).val('');
          self.refreshTags();
        }
      });
    },

    fillTagsTable: function(){
      var self = this,
          tagin = $("input[name='tags']").val(),
          rows = "";

      if(tagin.length > 0) {
        $.each(tagin.split('|'), function() {
          rows += self.buildTagsRow(this);
        });
        $('#tagstbl').append(rows);
        this.bindDeleteButtons();
      }
    },

    buildTagsRow: function(name) {
      return '<tr><td><input type="hidden" name="tag[]" value="' + name + '">' + name + '</td><td style="width:25px;"><button class="tagsdel" type="button" style="border:none;">x</button> </td></tr>';
    },

    bindDeleteButtons: function() {
      var self = this;

      $('button.tagsdel').click(function(){
        $(this).parent('td').parent('tr').remove();
        self.refreshTags();
      });
    },

    refreshTags: function() {
      var taxod = $("input[name='tag\\[\\]']").map(function(){ return $(this).val(); }).get().join('|');

      $("input[name='tags']").val(taxod);
    }
  };

}(jQuery));