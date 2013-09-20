<?php
/*
 * Title:   IATI XML to GeoJSON
 * Returns "Location"-level schema
*/

# Read the XML file
$xmlfile = simplexml_load_file('afdb/IATIBotswanaData.xml');
echo $xmlfile
/*
# Build GeoJSON feature collection array
$geojson = array(
    'type' => 'FeatureCollection',
    'features' => array()
);

# Loop through rows to build feature arrays
$header = NULL;
while (($row = fgetcsv($handle, 1000, ',')) !== FALSE) {
    if (!$header) {
        $header = $row;
    } else {
        $data = array_combine($header, $row);
        $properties = $data;
        # Remove x and y fields from properties (optional)
        unset($properties['x']);
        unset($properties['y']);
        $feature = array(
            'type' => 'Feature',
            'geometry' => 'Geometry',
            'geometry' => array(
                'type' => 'Point',
                'coordinates' => array(
                    $data['x'],
                    $data['y']
                )
            ),
            'properties' => $properties
        );
        # Add feature arrays to feature collection array
        array_push($geojson['features'], $feature);
    }
}
fclose($handle);

header('Content-type: application/json');
echo json_encode($geojson, JSON_NUMERIC_CHECK);*/
?>