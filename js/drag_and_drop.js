var dz = document.querySelector("#map")

dz.addEventListener("drop", (e) => {
    e.preventDefault()


    var files = []
    if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...e.dataTransfer.items].forEach((item, i) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            files.push(item.getAsFile());
            
          }
        });
      } else {
        // Use DataTransfer interface to access the file(s)
        [...e.dataTransfer.files].forEach((file, i) => {
          files.push(file)
        });
    }

    files.forEach((f) => {
        var reader = new FileReader()
        reader.onload = (e) => {
            addXmlstring(e.target.result)
        }
        reader.readAsText(f)
    })
})

var body = document.querySelector("body")
var dragHandle
body.addEventListener("dragover", (e) => {
    body.classList.add("user-is-dragging");
    clearTimeout(dragHandle);
    dragHandle = setTimeout(() => {
        body.classList.remove("user-is-dragging");
    }, 200);
});

function randomHexColor() {
    
    
    var h = Math.random()*180;
    if (30 < h && h < 90) {
        return randomHexColor()
    }

    var s = 80+(Math.random()*20);
    var v = 100
    var col = hsvToRgb(h, s, v);
    console.log(col)
    return col
}

function hsvToRgb(h, s, v) {
    h /= 180;
    s /= 100;
    v /= 100;
    var r, g, b;
  
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
  
    return "#"+ Math.floor(r * 255).toString(16).padStart(2, "0") + Math.floor(g * 255).toString(16).padStart(2, "0") + Math.floor(b * 255).toString(16).padStart(2, "0");
  }


function addXmlstring(xml) {
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml")
    
    xmlDoc.querySelectorAll("trk").forEach((trk) => {
        var points = []
        trk.querySelectorAll("trkpt").forEach((trkpt) => {
            var pos = new L.LatLng(trkpt.getAttribute("lat"), trkpt.getAttribute("lon"))
            points.push(pos)
        })

        var pl = new L.Polyline(points, {
            color: randomHexColor(),
            weight: 5,
            opacity: 1.0,
            smoothFactor: 10
        });
        pl.source = trk
        pl.addTo(map);
        lines.push(pl)
    })

}

dz.addEventListener("dragover", (e) => {
    console.log("File(s) in droparea");

    e.preventDefault()
})
