;(function($) {

  Drupal.behaviors.metabio_taxonomy = {

    attach: function() {
      this.attachTaxonomy();
      this.fillTaxoTable();
    },

    attachTaxonomy: function() {
      var self = this, keyCode = "", sp = "";

      $('#edit-taxonomic-details-input').keypress(function(e) {
        keyCode = e.keyCode || e.charCode;
        if(keyCode === 13) {
          e.preventDefault();
          sp = $(this).val();
          $('#taxotbl').append(self.buildTaxonomyRow(sp));
          self.bindDeleteButtons();
          $(this).val('');
          self.refreshTaxonomy();
        }
      });
    },

    fillTaxoTable: function(){
      var self = this,
          taxoin = $("input[name='taxonomic_details']").val(),
          rows = "";

      if(taxoin.length > 0) {
        $.each(taxoin.split('|'), function() {
          rows += self.buildTaxonomyRow(this);
        });
        $('#taxotbl').append(rows);
        this.bindDeleteButtons();
      }
    },
    
    buildTaxonomyRow: function(name) {
      return '<tr><td><input type="hidden" name="taxo[]" value="' + name + '">' + name + '</td><td><button class="taxodel" type="button" style="border:none;">x</button> </td></tr>';
    },
    
    bindDeleteButtons: function() {
      var self = this;

      $('button.taxodel').click(function(){
        $(this).parent('td').parent('tr').remove();
        self.refreshTaxonomy();
      });
    },

    refreshTaxonomy: function() {
      var taxod = $("input[name='taxo\\[\\]']").map(function(){ return $(this).val(); }).get().join('|');
      $("input[name='taxonomic_details']").val(taxod);
    }
  };

}(jQuery));