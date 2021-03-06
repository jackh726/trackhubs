hubinfo = {};
genomes = {};
activeGenome = undefined;
oldTrackName = undefined;
objectfordeletion = undefined;
objectfordeletiontype = undefined;

function switchPanel(toHide, toShow) {
    $(toHide).hide();
    $(toShow).show();
}

$(document).ready(function () {
    load();

    if (Object.keys(hubinfo).length == 0) {
        $("#panel-genomes").hide();
    } else {
        $("#panel-basic-info").hide();
    }
    $("#panel-tracks").hide();
    $("#panel-create-track").hide();

    // Basic info panel
    $("#btn-basic-done").click(function () {
        let hub = $("#input_hub").val();
        let shortLabel = $("#input_shortLabel").val();
        let longLabel = $("#input_longLabel").val();
        let email = $("#input_email").val();
        if (hub.length == 0 || shortLabel.length == 0 || longLabel == 0) {
            alert("All fields are required!");
            return;
        }
        if (hub.indexOf(' ') >= 0) {
            alert("Hub name must be a single word.");
            return;
        }
        if (shortLabel.length > 17) {
            alert("Short label should be a maximum of 17 characters.");
            return;
        }
        if (longLabel.length > 80) {
            alert("Long label should be a maximum of 80 characters.");
            return;
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            alert("Please enter a valid email.");
            return;
        }
        let formData = $("#basic-info-form").serializeArray();
        console.log(formData);
        for (var pair in formData) {
            let obj = formData[pair];
            hubinfo[obj.name] = obj.value;
        }
        hubinfo["genomesFile"] = "genomes.txt";
        save();
        switchPanel("#panel-basic-info", "#panel-genomes");
    });

    $("#btn-import-main").click(function() {
        $('#input-import').trigger('click');
    });

    // Genomes panel
    $("#btn-go-info").click(function() {
        switchPanel("#panel-genomes", "#panel-basic-info");

        $("#input_hub").val(hubinfo["hub"]);
        $("#input_shortLabel").val(hubinfo["shortLabel"]);
        $("#input_longLabel").val(hubinfo["longLabel"]);
        $("#input_email").val(hubinfo["email"]);
    });

    $("#btn-export").click(function() {
        let zip = new JSZip();
        zip.file("hub.txt", getHubExportData(hubinfo));
        zip.file("genomes.txt", getGenomesExportData(genomes));

        for (key in genomes) {
            let genome = genomes[key];
            zip.folder(key).file("trackDb.txt", getTrackDBExportData(genome));
        }
        zip.generateAsync({type:"blob"}).then(function (blob) {
            saveAs(blob, hubinfo["hub"] + ".zip");
        });
    });

    // Import
    $("#btn-import").click(function() {
        $('#input-import').trigger('click');
    });

    $("#input-import").change(function() {
        let file = $("#input-import")[0].files[0];
        console.log("Importing: " + file.name);
        let importhubinfo = {};
        let importgenomes = {};
        JSZip.loadAsync(file)
        .then(function(zip) {
        let hubFile = zip.file("hub.txt");
        if (!hubFile) {
            if (Object.keys(hubinfo).length == 0) {
                alert("There must be a hub.txt.");
                resetImport();
                return;
            }
        } else {
            hubFile.async("string").then(function (data) {
            console.log("hubs.txt:");
            console.log(data);
            importhubinfo = getHubImportData(data);
            });
        }
        zip.file("genomes.txt").async("string").then(function (data) {
            console.log("genomes.txt:");
            console.log(data);
            importgenomes = getGenomesImportData(data);
            let genomesSize = Object.keys(importgenomes).length;
            let genomesProcessed = 0;
            for (genome in importgenomes) {
                // TODO: respect trackDb paths in genomes.txt
                trackFile = zip.folder(genome).file("trackDb.txt");
                if (!trackFile) {
                    alert("Uploaded zip does not contain a trackDb.txt for '" + genome + "'. (Must be inside a folder named '" + genome + "'.");
                    resetImport();
                    return;
                }
                trackFile.async("string").then(function (data) {
                    console.log("trackDB.txt:");
                    console.log(data);
                    importgenomes = getTrackDBImportData(data, genome, importgenomes);
                    genomesProcessed += 1;
                    if (genomesProcessed == genomesSize) {
                        hubinfo = importhubinfo;
                        genomes = importgenomes;
                        $("#genome-table tbody").html("");
                        for (genome in genomes) {
                            addGenomeToTable(undefined, genomes[genome]);
                        }
                        resetImport();
                        save();
                        switchPanel("#panel-basic-info", "#panel-genomes");
                    }
                });
            }
        });
        }, function (e) {
        console.log(e);
        });
    });

    function resetImport() {
        importhubinfo = {};
        importgenomes = {};
        $("#input-import").val("");
    }

    $("#btn-create-genome").click(function() {
        switchPanel("#panel-genomes", "#panel-tracks");

        activeGenome = new Genome();
    });

    $("#genome-table").on("click", ".edit-genome", function() {
        switchPanel("#panel-genomes", "#panel-tracks");

        let name = event.target.parentNode.parentNode.dataset.name;
        oldGenomeName = name;
        activeGenome = jQuery.extend(true, {}, genomes[name]);
        for (index in activeGenome.tracks) {
            let track = activeGenome.tracks[index];
            addTrackToTable(track);
        }
        $("#active-genome-name").val(activeGenome.name);
    });

    $("#genome-table").on("click", ".delete-genome", function() {
        let name = event.target.parentNode.parentNode.dataset.name;
        console.log(name);
        objectfordeletiontype = "genome";
        objectfordeletion = name;
        $("#confirm-delete-modal").modal({});
        $("#delete-object").text("genome '" + name + "'");
    });

    function deleteGenome(name) {
        removeGenomeFromTable(name);
        delete genomes[name];
        save();
    }

    $('#confirm-delete').click(function (event) {
        if (objectfordeletiontype == "genome") {
            deleteGenome(objectfordeletion);
        } else {// "track"
            deleteTrack(objectfordeletion);
        }
        $("#confirm-delete-modal").modal('hide');
    });

    $('#confirm-delete-modal').on('hidden.bs.modal', function (event) {
        objectfordeletion = undefined;
        objectfordeletiontype = undefined;
        $("#delete-object").text("");
    })

    // Tracks panel
    $("#btn-create-track").click(function() {
        switchPanel("#panel-tracks", "#panel-create-track");
    });

    $("#btn-tracks-done").click(function() {
        let name = $("#active-genome-name").val();
        if (name.length == 0) {
            alert("Please enter a name for the genome.");
            return;
        }
        if (activeGenome.name != name && genomes[name]) {
            alert("Please enter a unique name for this genome.");
            return;
        }

        switchPanel("#panel-tracks", "#panel-genomes");

        let oldname = activeGenome.name;
        activeGenome.name = name;
        addGenomeToTable(oldname, activeGenome);
        delete genomes[oldname];
        genomes[activeGenome.name] = activeGenome;
        activeGenome = undefined;
        $("#panel-tracks tbody").html("");
        $("#active-genome-name").val("");
        save();
    });

    $("#btn-tracks-cancel").click(function() {
        switchPanel("#panel-tracks", "#panel-genomes");

        $("#panel-tracks tbody").html("");
        $("#active-genome-name").val("");
        activeGenome = undefined;
    });

    $("#track-table").on("click", ".edit-track", function(event) {
        switchPanel("#panel-tracks", "#panel-create-track");

        let name = event.target.parentNode.parentNode.dataset.name;
        let track = activeGenome.tracks[name];

        $("#input_track_name").val(track.track);
        $("#input_track_shortLabel").val(track.shortLabel);
        $("#input_track_longLabel").val(track.longLabel);
        let index = track.type.indexOf(" ");
        let type = track.type;
        let typenum;
        if (index > -1) {
            strs = track.type.split(/(\s+)/);
            type = strs[0];
            $("#input_track_bigBed").prop("disabled", false);
            $("#input_track_bigBed").val(strs[2]);
            typenum = strs[2];
        }
        $("#input_track_type").val(type);
        $("#input_track_URL").val(track.bigDataUrl);

        oldTrackName = name;
    });

    $("#input_track_type").change(function() {
        let val = $(this).val();
        if (val == "bigBed") {
            $("#input_track_bigBed").prop('disabled', false); 
        } else {
            let i = $("#input_track_bigBed")
            i.prop('disabled', true);
            i.val(""); 
        }
    });

    $("#track-table").on("click", ".delete-track", function() {
        let name = event.target.parentNode.parentNode.dataset.name;
        objectfordeletiontype = "track";
        objectfordeletion = name;
        $("#confirm-delete-modal").modal({});
        $("#delete-object").text("track '" + name + "'");
    });

    function deleteTrack(name) {
        removeTrackFromTable(name);
        delete activeGenome.tracks[name];
    }

    // Create track panel
    $("#btn-track-done").click(function(event) {
        let name = $("#input_track_name").val();
        let shortLabel = $("#input_track_shortLabel").val();
        let longLabel = $("#input_track_longLabel").val();
        let type = $("#input_track_type").val();
        let typenum = $("#input_track_bigBed").val();
        if (name.length == 0 || shortLabel.length == 0 || longLabel == 0) {
            alert("All fields are required!");
            event.preventDefault();
            return;
        }
        if (name.indexOf(' ') >= 0) {
            alert("Track name must be a single word.");
            event.preventDefault();
            return;
        }
        if (oldTrackName != name && activeGenome.tracks[name]) {
            alert("Please enter a unique name for this track.");
            event.preventDefault();
            return;
        }
        if (shortLabel.length > 17) {
            alert("Short label should be a maximum of 17 characters.");
            event.preventDefault();
            return;
        }
        if (longLabel.length > 80) {
            alert("Long label should be a maximum of 80 characters.");
            event.preventDefault();
            return;
        }
        if (type == "bigBed" && typenum != 0) {
        if (isNaN(parseFloat(typenum)) || !isFinite(typenum) || typenum < 3 || typenum > 20) {
            alert("Please use a number between 3 and 20 for the bigBed input (or empty).");
            event.preventDefault();
            return;
        }
        }

        switchPanel("#panel-create-track", "#panel-tracks");

        $("#input_track_bigBed").prop("disabled", true);

        let formData = $("#create-track-form").serializeArray();
        let track = new Track(); 
        for (var pair in formData) {
            let obj = formData[pair];
            let val = obj.value;
            if (val == "bigBed" && !isNaN(parseFloat(typenum)) && isFinite(typenum)) {
                val = val + " " + typenum
            }
            if (obj.name == "bigBedNum") continue;
            track[obj.name] = val;
        }
        console.log("Track created:");
        console.log(track);
        activeGenome.tracks[track.track] = track;
        addTrackToTable(track);
    });

    $("#btn-track-cancel").click(function() {
        switchPanel("#panel-create-track", "#panel-tracks");

        $("#input_track_bigBed").prop("disabled", true);
    });

    // TODO: temp
    let addTempIfEmpty = false;
    if (Object.keys(genomes).length == 0 && addTempIfEmpty) {
        console.log("Adding temp");
        let testTrack = new Track();
        testTrack.track = "TestTrack";
        let testGenome = new Genome();
        testGenome.name = "mm10";
        testGenome.tracks[testTrack.track] = testTrack;
        genomes[testGenome.name] = testGenome;
        addGenomeToTable(undefined, testGenome);
    }

    save();
});

function addGenomeToTable(oldname, genome) {
    var markup = `
        <tr data-name="${genome.name}">
        <td>${genome.name}</td>
        <td>${Object.keys(genome.tracks).length}</td>
        <td>
        <button type="button" class="btn btn-primary edit-genome">Edit</button> 
        <button type="button" class="btn btn-danger delete-genome">Delete</button>
        </td>
        </tr>
        `;
    if (oldname) {
        let oldelement = $("#genome-table tbody tr[data-name='" + oldname + "']");
        oldelement.replaceWith(markup);
    } else {
        $("#genome-table tbody").append(markup);
    }
}

function removeGenomeFromTable(name) {
    $("#genome-table tr[data-name='" + name + "']").remove();
}

function addTrackToTable(track) {
    var markup = `
        <tr data-name="${track.track}">
        <td>${track.track}</td>
        <td>${track.longLabel}</td>
        <td>
        <button type="button" class="btn btn-primary edit-track">Edit</button> 
        <button type="button" class="btn btn-danger delete-track">Delete</button>
        </td>
        </tr>
        `;
    if (oldTrackName) {
        $("#track-table tbody tr[data-name='" + oldTrackName + "']").replaceWith(markup);
        oldTrackName = undefined;
    } else {
        $("#track-table tbody").append(markup);
    }
}

function removeTrackFromTable(name) {
    $("#track-table tr[data-name='" + name + "']").remove();
}

function load() {
    raw = localStorage["genomes"];
    //console.log(raw);
    if (raw) {
        genomes = JSON.parse(raw);
    }

    raw = localStorage["hubinfo"];
    //console.log(raw);
    if (raw) {
        hubinfo = JSON.parse(raw);
    }

    for (key in genomes) {
        genome = genomes[key];
        addGenomeToTable(undefined, genome);
    }
}

function save() {
    localStorage["genomes"] = JSON.stringify(genomes);
    localStorage["hubinfo"] = JSON.stringify(hubinfo);
}