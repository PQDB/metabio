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
  <?php print theme('metabio_checkbox_values', array('options' => 'taxonomic_information', 'checkboxes' => $content['taxonomic_information'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['taxonomic_details'])): ?>
  <dt><?php print t('Taxonomic details'); ?></dt><dd><?php print str_replace("|", ", ", $content['taxonomic_details']); ?></dd>
<?php endif; ?>
</dl>