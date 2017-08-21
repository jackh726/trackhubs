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