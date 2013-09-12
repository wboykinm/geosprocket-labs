## Parameters for Mapping GDA Query Results

### UX
A user will submit a query to the GDA site, something like "Show all partnerships in the 'Health' sector with a total lifetime investment of greater than $1,000,000". They'll then see a list of partnerships that meet this criteria, presumably with an option to click through to each for more details. When they hit the "Map it" button on the left nav, they'll be directed to a map of the query results, which are clustered by country and clickable for summary information as in [this demo with fake data](http://wboykinm.github.io/Leaflet.markercluster/example/geojson.html):
![Map View](http://farm8.staticflickr.com/7358/8977829799_143193ae26_z.jpg)

### Data Needed for the Handoff
In order to populate the map, the query results must be passed to the leaflet library in GeoJSON format. (Note that we could parse this a few other ways, but GeoJSON is efficient and easy enough to construct since we're slinging PHP anyway). The following variables must be requested and declared for the queried records when the map page loads:
* Partnership ID
* Partnership Name
* Longitude
* Latitude

The above variables are what will be necessary to get points on a map (I'll be giving you a table of latitude and longitude for all countries and regions once you send me the finalized list of those). In order to make an informative popup when a map feature is clicked, we'll need additional information requested in the same script:
* Description
* Sector
* Country
* Status
* Start Date
* End Date
* Total Lifetime Investment
* USG Investment
* Non-USG Investment

### PHP to GeoJSON
If the PHP that returns the initial queried list is already requesting all of this information, it may be simplest to construct the GeoJSON as a process within the same script. Specifically, we need the above variables to be parsed into [this structure](https://gist.github.com/wboykinm/5730548) (with variables in mustache tages: {{foo}}):
    ```{
        "features":[
            {
                "id":"{{Partnership ID}}",
                "properties":{
                    "name":"{{Partnership Name}}",
                    "description":"{{Description}}",
                    "sector":"{{Sector}}",
                    "country":"{{Country}}",
                    "status":"{{Status}}",
                    "start_date":"{{Start Date}}",
                    "end_date":"{{End Date}}",
                    "total_invest":{{Total Lifetime Investment}},
                    "usg_invest":{{USG Investment}},
                    "non_usg_invest":{{Non-USG Investment}}
                },
                "type":"Feature",
                "geometry":{
                    "type":"Point",
                    "coordinates":[
                        {{longitude}},
                        {{latitude}}
                    ]   
                }
            }
        ]
    }```

My PHP is a little bit rusty, but I think [this example should do the trick](https://gist.github.com/wboykinm/5730504).

### Site Behavior
My assumption is that the site will reload on each new query and the above PHP-to-GeoJSON request will fire again. If we're doing this in more of an ajax-y way that's also doable; I'll just need to write in some event handlers for the map itself.

Does this make sense?