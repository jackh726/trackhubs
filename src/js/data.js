class Track {
    //track uniqueNameNoSpacesOrDots
    //type track_type
    //bigDataUrl track_data_url
    //shortLabel label 17 chars
    //longLabel long label up to 80 chars

    constructor() {
        this.track = "UNDEFINED"
        this.type = "UNDEFINED";
        this.bigDataUrl = "UNDEFINED";
        this.shortLabel = "UNDEFINED";
        this.longLabel = "UNDEFINED";
    }
}

class Genome {
    //name
    //tracks

    constructor() {
        this.name = undefined;
        this.tracks = {};
    }
}

function getHubExportData(hubinfo) {
    let out = "";
    out += "hub " + hubinfo["hub"] + "\n";
    for (key in hubinfo) {
        if (key == "hub") continue;
        out += key + " " + hubinfo[key] + "\n";
    }
    return out;
}

function getGenomesExportData(genomes) {
    let out = "";
    let first = true;
    for (key in genomes) {
        if (first) {
            first = false;
        } else {
            out += "\n";
        }
        out += "genome " + key + "\n";
        out += "trackDb " + key + "\\trackDb.txt\n";
    }
    return out;
}

function getTrackDBExportData(genome) {
    let tracks = genome["tracks"];
    let out = "";
    let first = true;
    for (t in tracks) {
        let track = tracks[t];
        if (first) {
            first = false;
        } else {
            out += "\n";
        }
        for (key in track) {
            out += key + " " + track[key] + "\n";
        }
    }
    return out;
}

function getHubImportData(data) {
    let importhubinfo = {};
    let lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
        let str = lines[i];
        let key = clean(str.substr(0, str.indexOf(' ')));
        let value = clean(str.substr(str.indexOf(' ') +1));
        importhubinfo[key] = value;
    }
    return importhubinfo;
}

function clean(str) {
    str = str.replace(/(\r\n|\n|\r)/gm,"");
    return str;
}

function getGenomesImportData(data) {
    let importgenomes = {};
    let lines = data.split('\n');
    let current = {};
    for (var i = 0; i < lines.length; i++) {
        let str = lines[i];
        let key = clean(str.substr(0, str.indexOf(' ')));
        let value = clean(str.substr(str.indexOf(' ') +1));
        if (key == "genome") {
            importgenomes[value] = {};
        }
    }

    $("#input-import-genomeslist").show();
    for (genome in importgenomes) {
        let markup = `
        <label for="input_import_genome-${genome}">${genome}</label>
        <input class="form-control-file genome-upload" data-genome="${genome}" type="file" name="genome-${genome}" id="input_import_genome_${genome}">
        <br>
        `;
        $("#input-import-genomeslist").append(markup);
    }
    return importgenomes;
}

function getTrackDBImportData(data, genomeName, importgenomes) {
    let genomeObj = new Genome();
    genomeObj.name = genomeName;
    let lines = data.split('\n');
    let current = new Track();
    let currentTrack = "";
    for (var i = 0; i < lines.length; i++) {
        let str = lines[i];
        let key = clean(str.substr(0, str.indexOf(' ')));
        let value = clean(str.substr(str.indexOf(' ') +1));
        if (key == "track") {
            currentTrack = value;
        }
        current[key] = value;
        if (i+1 == lines.length || !lines[i+1].trim()) {
            i++;
            genomeObj.tracks[currentTrack] = current;
            current = new Track();
            currentTrack = "";
        }
    }
    importgenomes[genomeObj.name] = genomeObj;
    return importgenomes;
}