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