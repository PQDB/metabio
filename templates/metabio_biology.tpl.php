<div class="metabio-section-header">
  <h2><?php print t('Biology'); ?></h2>
</div>

<dl class="metabio-definitions">
<?php if(!empty($content['taxa_studied'])): ?>
  <dt><?php print t('Taxa studied'); ?></dt><dd><?php print $content['taxa_studied']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['taxonomic_information'])): ?>
  <dt><?php print t('Taxonomic information'); ?></dt>
  <dd>
  <?php print theme('metabio_checkbox_values', array('name' => 'taxonomic_information', 'selections' => $content['taxonomic_information'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['taxonomic_details'])): ?>
  <dt><?php print t('Taxonomic details'); ?></dt><dd>
<?php 
  //$content['taxonomic_details']=str_replace('null','"null"',$content['taxonomic_details']);
  //$ct=str_replace('"',"'",$content['taxonomic_details']);
  $ct=$content['taxonomic_details'];
  //$taxo=json_decode('[{"tsn":"180575","latin_name":"Procyon lotor","english_name":"Raccoon","french_name":"raton laveur","parent_tsn":"503436"}]');
  $taxo=json_decode($ct);
  //print json_last_error();
  //print_r($taxo);
  //echo trim($ct,'"');
  print '<table class="taxotable" style="width:400px;"><th>'.t('Latin name').'</th><th>'.t('English name').'</th><th>'.t('French name').'</th>';
  foreach($taxo as $ta){
  	print '<tr><td>'.$ta->latin_name.'</td><td>'.$ta->english_name.'</td><td>'.$ta->french_name.'</td></tr>';
  }
  print '</table>';
  ?></dd>
<?php endif; ?>
</dl>