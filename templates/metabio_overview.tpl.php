<div class="metabio-section-header">
  <h2><?php print t('Overview'); ?></h2>
</div>

<?php if(!empty($content['dataset_description'])): ?>
  <p><?php print $content['dataset_description']; ?></p>
<?php endif; ?>

<h3><?php print t('Data holder(s)') ?></h3>
<?php print theme('metabio_contact', $content); ?>

<?php print theme('metabio_collector', $content); ?>

<dl class="metabio-definitions">
<?php if(!empty($content['other_institutions'])): ?>
  <dt><?php print t('Other institutions'); ?></dt><dd><?php print $content['other_institutions']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['responsible_person'])): ?>
  <dt><?php print t('Individual responsible for data'); ?></dt><dd><?php print $content['responsible_person']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['funding_sources'])): ?>
  <dt><?php print t('Funding source(s)'); ?></dt><dd><?php print $content['funding_sources']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['dataset_format'])): ?>
  <dt><?php print t('Dataset format'); ?></dt><dd><?php print $content['dataset_format']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['additional_comments'])): ?>
  <dt><?php print t('Additional information'); ?></dt><dd><?php print $content['additional_comments']; ?></dd>
<?php endif; ?>
</dl>

