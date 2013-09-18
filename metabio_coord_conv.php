<?php
$cooin=$_GET['coostr'];
$cooina=explode('\n',$cooin);
$cooout=array();
foreach($cooina as $coo){
    array_push($cooout,make_coordinates($coo));
}
echo json_encode($cooout);


function make_coordinates($point) {
    $loc = preg_replace('/[\p{Z}\s]/u', ' ', $point);
    $loc = trim(preg_replace('/[^\d\s,;.\-NSEWO°ºdms\'"]/i', '', $loc));
    if(preg_match('/[NSEWO]/', $loc) != 0) {
      $coord = preg_split("/[,;]/", $loc);
      if (!array_key_exists(1, $coord)) { return array(null, null); }
      $coord = (preg_match('/[EWO]/', $coord[1]) != 0) ? $coord : array_reverse($coord);
      return array(self::dms_to_deg(trim($coord[0])),self::dms_to_deg(trim($coord[1])));
    } else {
      return preg_split("/[\s,;]+/",$loc); //split the coords by a space, comma, semicolon
    }
}


function dms_to_deg($dms) {
    $dms = stripslashes($dms);
    $neg = (preg_match('/[SWO]/i', $dms) == 0) ? 1 : -1;
    $dms = preg_replace('/(^\s?-)|(\s?[NSEWO]\s?)/i','', $dms);
    $pattern = "/(\\d*\\.?\\d+)(?:[°ºd: ]+)(\\d*\\.?\\d+)*(?:['m′: ])*(\\d*\\.?\\d+)*[\"s″ ]?/i";
    $parts = preg_split($pattern, $dms, 0, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
    if (!$parts) { return; }
    // parts: 0 = degree, 1 = minutes, 2 = seconds
    $d = isset($parts[0]) ? (float)$parts[0] : 0;
    $m = isset($parts[1]) ? (float)$parts[1] : 0;
    if(strpos($dms, ".") > 1 && isset($parts[2])) {
      $m = (float)($parts[1] . '.' . $parts[2]);
      unset($parts[2]);
    }
    $s = isset($parts[2]) ? (float)$parts[2] : 0;
    $dec = ($d + ($m/60) + ($s/3600))*$neg; 
    return $dec;
}

?>