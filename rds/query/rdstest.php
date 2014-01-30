<?php
$host = "geosprocketpostgis1.cdjgl80tycem.us-east-1.rds.amazonaws.com";
$database = "gspkt1";
$username = "geosprocket1";
$password = "thorvaldpo05";
	
# Connect to PostgreSQL database
 $conn = new PDO('pgsql:host=geosprocketpostgis1.cdjgl80tycem.us-east-1.rds.amazonaws.com;dbname=gspkt1','geosprocket1','thorvaldpo05');

/*$dbPostgres = pg_connect("host=$host port=5432 dbname=$database user=$username password=$password")
	   or die("Could not connect");
*/
# Build SQL SELECT statement and return the geometry as a GeoJSON element
$sql = 'SELECT the_geom, gid, "NAME", "POP1950", "POP1955", "POP1960", "POP1965", "POP1970", "POP1975", "POP1980", "POP1985", "POP1990", "POP1995", "POP2000", "POP2005", "POP2010", "POP2015", "POP2020", public.ST_AsGeoJSON(public.ST_Transform((the_geom),4326),6) as geojson FROM ne_10m_populated_places';

#$result = pg_query($dbPostgres, $sql);
#echo $result;
# Try query or error
$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

# Build GeoJSON feature collection array
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);

# Loop through rows to build feature arrays
while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
    $properties = $row;
    # Remove geojson and geometry fields from properties
    unset($properties['geojson']);
    unset($properties['the_geom']);
    $feature = array(
         'type' => 'Feature',
         'geometry' => json_decode($row['geojson'], true),
         'properties' => $properties
    );
    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}

header('Content-type: application/json');
echo json_encode($geojson);
$conn = NULL;
#pg_close($dbPostgres);
?>