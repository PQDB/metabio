<?php
$meta_eml=array(
    'dataset_name'=>'dataset|title',
    'dataset_description'=>'dataset|abstract',
    'tags'=>'dataset|keywordset|keyword',
    'data_collector'=>'',
    'data_holder_first_name'=>'dataset|contact|individualName|givenName', //(ResponsibleParty/Person
    'data_holder_last_name'=>'dataset|contact|individualName|surName',
    'data_holder_institution'=>'dataset|contact|organizationName',
    'data_holder_email'=>'dataset|contact|electronicMailAddress',
    'data_holder_phone'=>'dataset|contact|phone',
    'data_holder_address'=>'dataset|contact|address|deliveryPoint',//city optional administrativeArea postalCode country
    'other_institutions'=>'',
    'funding_sources'=>'project|funding|para',
    'dataset_format'=>'',
    'responsible_person'=>'',
    'additional_comments'=>'dataset|additionalInfo',
    'taxa_studied'=>'dataset|methods|sampling|studyExtent|coverage|taxonomicCoverage|generalTaxonomicCoverage',
    'taxonomic_information'=>'dataset|methods|sampling|studyExtent|coverage|taxonomicCoverage|generalTaxonomicCoverage//List', 
    'taxonomic_details'=>'dataset|methods|sampling|studyExtent|coverage|taxonomicCoverage|taxonomicClassification',
    'study_design'=>'dataset|methods|MethodsType|sampling|samplingDescription|para',
    'study_status'=>'',
    'sampling_approaches'=>'dataset|methods|MethodsType|sampling|samplingDescription|para//List',
    'sampling_approaches_other'=>'dataset|methods|MethodsType|sampling|samplingDescription|para//List',
    'study_goals'=>'purpose|para',
    'study_goals_other'=>'purpose|para',
    'data_types'=>'',
    'data_types_other'=>'',
    'frequency_of_sampling',
    'first_year'=>'dataset|methods|sampling|studyExtent|coverage|temporalCoverage|rangeOfDates|beginDate',
    'last_year'=>'dataset|methods|sampling|studyExtent|coverage|temporalCoverage|rangeOfDates|endDate',
    'number_of_sites'=>'',
    'site_description'=>'project|studyAreaDescription|descriptor|descriptorValue|(name_or_id attribute)',
    'site_habitat'=>'project|studyAreaDescription|descriptor|descriptorValue|(name_or_id attribute)',
    'site_environment'=>'project|studyAreaDescription|descriptor|descriptorValue|(name_or_id attribute)',
    'location_name'=>'dataset|methods|sampling|studyExtent|coverage|geographicCoverage|geographicDescription',
    'geography'=>'dataset|methods|sampling|studyExtent|coverage|geographicCoverage|datasetGPolygon|datasetGPolygonOuterGRing|gRingPoint/gRing',
    'publications_types'=>'',
    'publications'=>'',
    'publications_hyperlinks'=>'',
    'publications_dois'=>'',
    'specimens'=>'',
    'collections'=>'',
    'files'=>'',
    'date_created'=>'',
    'date_last_changed'=>'',
);
function metabio_generate_eml(){
	$mid=$_POST['mid'];
	$query=db_select('metabio_dataset', 'm')->fields('m')->condition('mid',$mid,'=')->execute();
	if($query){
		$res=$query->fetchAll();
		$res=$res[0];
	}
	$xmls='<?xml version="1.0" encoding="UTF-8"?>
		<eml packageid="eml.1.1" system="knb" xmlns:eml="eml://ecoinformatics.org/eml-2.1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:stmml="http://www.xml-cml.org/schema/stmml-1.1" xsi:schemalocation="eml://ecoinformatics.org/eml-2.1.1 eml.xsd"></eml>';
	$eml = new SimpleXMLElement($xmls);
	$dataset=$eml->addChild('dataset');
	$project=$eml->addChild('project');
	$purpose=$eml->addChild('purpose');
	// Title
	$dataset->addChild('title',$res->dataset_name);
	// Abstract
	$dataset->addChild('abstract',$res->dataset_description);
	// Keywords
	if($res->tags && $res->tags!=''){
		$kw=explode('|',$res->tags);
		$keywords=$eml->addChild('keywords');
		foreach($kw as $ikw){
			$keywords->addChild('keyword',$ikw);
		}
	}
	// Contact info
	if($res->data_holder_first_name | $res->data_holder_last_name) {
		$contact=$dataset->addChild('contact');
		$name=$contact->addChild('individualName');
		$name->addChild('givenName',$res->data_holder_first_name);
		$name->addChild('surName',$res->data_holder_last_name);
		$contact->addChild('organizationName',$res->data_holder_institution);
		$contact->addChild('electronicMailAddress',$res->data_holder_email);
		$contact->addChild('phone',$res->data_holder_phone);
		$contact->addChild('address')->addChild('deliveryPoint',$res->data_holder_address); // Country, Zip Code, etc all merged here
	}
	// Additionnal comments
	$dataset->addChild('additionalInfo',$res->additional_comments);
	
	// Methods
	$methods=$dataset->addChild('methods');

	// Sampling approaches
	$sampling=$methods->addChild('methodsType')->addChild('sampling');
	$sampling_description=_options_sampling_approaches(array_keys(json_decode($res->sampling_approaches)));
	$sampling_description[]=$res->sampling_approaches_other;
	$sampling_description=$res->study_design.' ('.implode(',',$sampling_description).')';
	$sampling->addChild('samplingDescription',$sampling_description);
	
	// Temporal coverage
	$coverage=$methods->addChild('studyExtent')->addChild('coverage');
	$rangeofDates=$coverage->addChild('temporalCoverage')->addChild('rangeofDates');
	$rangeofDates->addChild('beginDate')->addChild('SingleDateTimeType')->addChild('calendarDate',$res->first_year);
	$rangeofDates->addChild('endDate')->addChild('SingleDateTimeType')->addChild('calendarDate',$res->last_year);

	//Header('Content-type: text/xml');
	$eml=$eml->asXML();
	$eml=str_replace('<eml','<eml:eml',$eml);
	$eml=str_replace('eml>','eml:eml>',$eml);
	$eml=str_replace('<?xml version="1.0" encoding="UTF-8"?>','',$eml);
	$eml=preg_replace('/^.+\n/','',$eml);
	echo $eml;
}
/*
Other required: 

ResearchProject Title and personnel (same as data holder/contact?)


*/
?>