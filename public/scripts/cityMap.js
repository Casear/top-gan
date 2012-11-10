function createCityMap(map) {
    var layer=new google.maps.FusionTablesLayer({
        query:{
            select :'Lat,Long',
            from :'2621505',
            where :'Megacity=1'
        },
        styles:[{
            markerOptions: {
                    iconName: "capital_big"
          }
        }]
    });
    layer.setMap(map);

}
