document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("input").forEach(input => input.onchange = e => {

        const fileName = e.target.files[0].name;

        const reader = new FileReader();

        switch (e.target.id) {
            case "map-to-json": {
                reader.onload = () => {
                    const bytes = new Uint8Array(reader.result);
                    const map = new Map(bytes);
                    console.log(map);
                    const json = JSON.stringify(map, null, "\t");
                    downloadJSON(json, fileName.replace(".map", ".json"));                    
                };
                reader.readAsArrayBuffer(e.target.files[0]);
                break;
            }
            case "json-to-map": {
                reader.onload = () => {
                    const json = JSON.parse(reader.result);
                    const map = new Map([]);
                    map.Version = json.Version;
                    map.X = json.X;
                    map.Y = json.Y;
                    map.Z = json.Z;
                    map.A = json.A;
                    map.S = json.S;
                    map.Sectors = json.Sectors;
                    map.Walls = json.Walls;
                    map.Sprites = json.Sprites;
                    const bytes = new Uint8Array(map.Serialize());
                    donwloadMap(bytes, fileName.replace(".json", ".map"));              
                };
                reader.readAsText(e.target.files[0]);
                break;
            }
        }

    });    

});

function downloadJSON (json, name) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", name);
    //document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function donwloadMap (bytes, name) {

    downloadBlob = function (data, fileName, mimeType) {
        var blob, url;
        blob = new Blob([data], {
            type: mimeType
        });
        url = window.URL.createObjectURL(blob);
        downloadURL(url, fileName);
        setTimeout(function () {
            return window.URL.revokeObjectURL(url);
        }, 1000);
    };

    downloadURL = function (data, fileName) {
        var a;
        a = document.createElement('a');
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        a.remove();
    };

    downloadBlob(bytes, name, "application/octet-stream");

}