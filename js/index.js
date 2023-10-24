var map = L.map('map').setView([59.262195836949864, 11.019287109375], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var lines = []
var markers = []

function deg_to_rad(val) {
    return (val/360)*(Math.PI*2)
}

function get_distance(pos1, pos2) {
    var lat1 = deg_to_rad(pos1.lat);
    var lat2 = deg_to_rad(pos2.lat);
    var lon1 = deg_to_rad(pos1.lng);
    var lon2 = deg_to_rad(pos2.lng);

    return Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*6371
}

function trkpt_to_popup(trkpt) {
    pt = {}
    trkpt.querySelectorAll("*").forEach((e) => {
        pt[e.tagName] = e.innerHTML
    })

    pt.time = new Date(Date.parse(pt.time))
    console.log(pt.time)
    return pt.time.toLocaleString()
}

map.on('click', function(e) {
    var pos1 = e.latlng
    lines.forEach((line) => {
        var latlngs = line.getLatLngs()


        var lowest_idx = 0
        var lowest_value = get_distance(pos1,latlngs[0])
        for (let i = 0; i < latlngs.length; i++) {
            var dist = get_distance(pos1,latlngs[i])
            if (lowest_value > dist) {
                lowest_value = dist
                lowest_idx = i
            }
        }
        
        if (lowest_value*1000 < 50) {
            var pop = L.popup().setLatLng(line.getLatLngs()[lowest_idx]).setContent(trkpt_to_popup(line.source.querySelectorAll("trkpt")[lowest_idx]))
            pop.addTo(map)
        }
    })
})