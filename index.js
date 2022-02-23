#! /usr/bin/env node
const fs = require("fs");

if (process.argv.length !== 5) {
  console.log("Usage: buildbook <spotify.json> <changes.json> <output-fil.json>");
  process.exit(1);
}

const readJsonFile = (filePath, callback) => {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return callback && callback(err);
    }
    try {
      const object = JSON.parse(fileData);
      return callback && callback(null, object);
    } catch (err) {
      return callback && callback(err);
    }
  });
}

const readJson = () => {
  readJsonFile(`./${process.argv[2]}`, (err, data) => {
    if (err) {
      console.log("Error reading input file:", err);
      return;
    }
    const inputJson = data;

    readJsonFile(`./${process.argv[3]}`, (err, data) => {
      if (err) {
        console.log("Error reading edit file:", err);
        return;
      }
      const editJson = data;

      updateJson(inputJson, editJson)
    })
  })
}

const updateJson = (input, edit) => {
  const keys = Object.keys(edit);

  const containsValue = (json, value) => {
    let contains = false;
    Object.keys(json).some(key => {
      contains = typeof json[key] === "object" ? containsValue(json[key], value) : json[key] === value;
      return contains;
    });
    return contains;
  }

  keys.forEach((key) => {
    switch (key) {
      case "add_song":

        for (const song of edit["add_song"]) {
          if (containsValue(input, song["song_id"])) {
            input["playlists"].find(obj => obj["id"] === song["playlist_id"])["song_ids"].push(song["song_id"])
          }
        }
        break;
      case "add_playlist":
        for (const playlist of edit["add_playlist"]) {
          if (containsValue(input, playlist["owner_id"])) {
            if (playlist["song_ids"].length >= 1) {
              input["playlists"].push({
                "id": `${input["playlists"].length + 1}`, "owner_id": playlist["owner_id"], "song_ids": playlist["song_ids"]
              })
            }
          }
        }
        break;
      case "remove_playlist":
        for (const playlist of edit["remove_playlist"]) {
          if (containsValue(input, playlist["id"])) {
            input["playlists"].forEach((currentPlaylist, index) => {
              if (currentPlaylist["id"] === playlist["id"]) {
                input["playlists"].splice(index, 1);
              }
            })
          }
        }
        break;
    }
  })

  fs.writeFile(`./${process.argv[4]}`, JSON.stringify(input, null, 2), err => {
    if (err) console.log("Error writing file:", err);
  });
}

readJson();