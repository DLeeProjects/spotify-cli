Spotify-cli
====================
David Lee
---------------------
### Getting Started
>Project uses Node with no additional dependencies
>
> 1. CD into buildblock project in terminal
> 2. Run command "buildblock spotify.json changes.json output-file.json"
> 3. Project will generate an output.json with updated JSON data
>
> JSON file names can be changed but formatting should remain the same.
>
> Data can be validated by comparing initial spotify.json values with the newly generated output-file.json values.
> * Songs will only be added to a playlist only if the song ID already exists in spotify.json.
> * New playlists will be added only if user ID already exists in spotify.json.
> * Playlist will only be removed if playlist ID already exists in spotify.json.
>
> Can test inputs by adding nonexistent values to changes.json while keeping the example format.
>

### Scalability
> There are some excellent libraries available for parsing through large JSON files.
>
> ex) GSON, JSON Processing API, Pandas Python Data Analysis Library
>
> The reading JSON file function could be optimized as adding additional files would result in nesting additional readJsonFile calls.
>
> Compressing the JSON when communicating with web services.
>
> Avoiding parsing the JSON unless absolutely mandatory
>
> Updating JSON to use predefined typed classes.

### Design Decisions
> Went with a switch check just to mimic useReducer or reducers for redux
>
> Time Spent on the project: ~ 3 hours
>
> Originally planned for a 2 hour timer but used additional time to possibly consider a Ruby on Rails solution as well as refresh memory on Node.
>
>Thank you for an enjoyable take home.

