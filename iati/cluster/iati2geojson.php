<?php
header('Content-type: text/plain');
 
# Grab URL
$ch = curl_init($_GET['url']);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$urlin = curl_exec($ch);
curl_close($ch);
 
$xmlloaded = simplexml_load_string($urlin); 
 
 
# Build GeoJSON feature collection array
$geojson = array(
    'type' => 'FeatureCollection',
    'features' => array()
);
 
# Loop through rows to build feature arrays
 
foreach ($xmlloaded->xpath("//location") as $site):
    $feature = array( 
        'type' => 'Feature', 
        'geometry' => array( 
            'type' => 'Point', 
            'coordinates' => array(
                (float)$site->coordinates['longitude'], 
                (float)$site->coordinates['latitude']
            ) 
        ),
        'properties' => array(
       
	    /*'title' => (string)$site->xpath('..')->title
	    'description' => (string)$site->xpath('..')->description,
	    'sector' => (string)$site->xpath('..')->sector,
	    'collaboration-type' => (string)$site->xpath('..')->collaboration-type,*/
	    'gazetteer-entry' => (string)$site['gazetteer-entry']
        )
    );
    array_push($geojson['features'], $feature);
    
endforeach;
 
# Push GeoJSON Output
header('Content-type: application/json');
echo json_encode($geojson);
 
?>