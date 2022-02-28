#! /usr/bin/env node
const fs = require("fs");
const { performance } = require('perf_hooks');

if (process.argv.length !== 5) {
  console.log("Usage: buildbook <spotify.json> <changes.json> <output-file.json>");
  process.exit(1);
}

const readJsonFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) reject(Error("File not found"));

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);

      resolve(JSON.parse(data));
    });
  })
}

const readJson = async () => {
  const inputJson = await readJsonFile(`./${process.argv[2]}`);
  const editJson = await readJsonFile(`./${process.argv[3]}`);

  updateJson(inputJson, editJson);
}

const updateJson = (input, edit) => {
  const keys = Object.keys(edit);

  keys.forEach((key) => {
    switch (key) {
      case "add_song":
        for (const song of edit["add_song"]) {
          if (containsValue(input["songs"], song["song_id"])) {
            input["playlists"].find(obj => obj["id"] === song["playlist_id"])["song_ids"].push(song["song_id"])
          }
        }
        break;
      case "add_playlist":
        for (const playlist of edit["add_playlist"]) {
          if (containsValue(input["users"], playlist["owner_id"]) && playlist["song_ids"].length >= 1) {
            input["playlists"].push(
              {
                "id": `${input["playlists"].length + 1}`,
                "owner_id": playlist["owner_id"],
                "song_ids": playlist["song_ids"]
              }
            )
          }
        }
        break;
      case "remove_playlist":
        for (const playlist of edit["remove_playlist"]) {
          if (containsValue(input["playlists"], playlist["id"])) {
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

const containsValue = (json, value) => {
  let contains = false;
  Object.keys(json).some(key => {
    contains = typeof json[key] === "object" ? containsValue(json[key], value) : json[key] === value;
    return contains;
  });
  return contains;
}

let start = performance.now();
readJson();
let end = performance.now();

console.log(`Execution time: ${end - start} ms`);