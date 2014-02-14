<div class="metabio-section-header">
  <h2><?php print t('Site Details'); ?></h2>
</div>

<dl class="metabio-definitions">

<?php if(!empty($content['number_of_sites'])): ?>
  <dt><?php print t('Number of sites'); ?></dt><dd><?php print $content['number_of_sites']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['site_description'])): ?>
  <dt><?php print t('Site description'); ?></dt><dd><?php print $content['site_description']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['site_habitat'])): ?>
  <dt><?php print t('Habitat'); ?></dt><dd><?php print $content['site_habitat']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['site_environment'])): ?>
  <dt><?php print t('Environment'); ?></dt>
  <dd>
    <?php print theme('metabio_checkbox_values', array('name' => 'site_environment', 'selections' => $content['site_environment'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['geography'])): ?>
  <?php print theme('metabio_geography', array('content' => $content['geography'])); ?>
<?php endif; ?>

</dl>