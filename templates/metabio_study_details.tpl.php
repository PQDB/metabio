<div class="metabio-section-header">
  <h2><?php print t('Study Details'); ?></h2>
</div>

<?php
/*
 Fields to work with:
'study_design',
'study_status',
'sampling_approaches',
'sampling_approaches_other',
'study_goals',
'study_goals_other',
'data_types',
'data_types_other',
'frequency_of_sampling',
'first_year',
'last_year'
*/
?>

<dl class="metabio-definitions">
<?php if(!empty($content['study_design'])): ?>
  <dt><?php print t('Study design'); ?></dt><dd><?php print $content['study_design']; ?></dd>
<?php endif; ?>

  <dt><?php print t('Study status'); ?></dt>
  <dd>
    <?php //TODO: fix theme for radios  ?>
    <?php //print theme('metabio_checkbox_values', array('options' => 'study_status', 'checkboxes' => $content['study_status'])); ?>
  </dd>

<?php if(!empty($content['sampling_approaches'])): ?>
  <dt><?php print t('Sampling approaches'); ?></dt>
  <dd>
    <?php print theme('metabio_checkbox_values', array('options' => 'sampling_approaches', 'checkboxes' => $content['sampling_approaches'])); ?>
  </dd>
<?php endif; ?>
</dl>