;(function($) {

  Drupal.behaviors.metabio_taxonomy = {

    attach: function() {
      this.attachTaxonomy();
      this.fillTaxoTable();
    },

    attachTaxonomy: function() {
      var self = this, keyCode = "", sp = "";

      $('#edit-taxonomic-details-input').keypress(function(e) {
        keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if(keyCode === 13) {
          e.preventDefault();
          sp = $('#edit-taxonomic-details-input').val();
          $('#taxotbl').append('<tr><td><input type="hidden" name="taxo[]" value="'+sp+'">' + sp + '</td><td><button class="taxodel" type="button" style="border:none;">x</button> </td></tr>');
          self.bindDeleteButtons();
          $(this).val('');
          self.refreshTaxonomy();
        }

      })
    },

    fillTaxoTable: function(){
      var taxoin = $("input[name='taxonomic_details']").val(), rows = "";

      if(taxoin.length > 0) {
        $.each(taxoin.split('|'), function(e) {
          rows += '<tr><td><input type="hidden" name="taxo[]" value="' + this + '">' + this + '</td><td><button class="taxodel" type="button" style="border:none;">x</button> </td></tr>';
        });
        $('#taxotbl').append(rows);
        this.bindDeleteButtons();
      }
    },
    
    bindDeleteButtons: function() {
      var self = this;

      $('button.taxodel').click(function(){
        $(this).parent('td').parent('tr').remove();
        self.refreshTaxonomy();
      });
    },

    refreshTaxonomy: function(){
      var taxod = $("input[name='taxo\\[\\]']").map(function(){ return $(this).val(); }).get().join('|');
      $("input[name='taxonomic_details']").val(taxod);
    }
  }

}(jQuery));