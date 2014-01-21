<div class="metabio-section-header">
  <h2><?php print t('Site Details'); ?></h2>
</div>

<?php if(!empty($content['site_description'])): ?>
  <p><?php print $content['site_description']; ?></p>
<?php endif; ?>

<?php if(!empty($content['geography'])): ?>
  <?php print theme('metabio_geography', array('content' => $content['geography'])); ?>
<?php endif; ?>