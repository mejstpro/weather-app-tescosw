# WeatherApp

**This is a web application showing the weather forecast for next 5 days created in React.**

Enter the desired city into the search bar which is also equipped by a hint box of cities that match your typing (the list of the cities is downloaded directly from the app directory)

The weather forecast is then displayed in a table and also by a graph. The forecast is provided by: [openweathermap.org](https://openweathermap.org/).

### Interesting features:

- Design is responsive, so it can also be used on tablets and mobile  
  devices.
- Units, times and dates are formatted according to the browser settings.
- You can search for the weather in your current location (geolocation API use).

## Launching the app

The app can be launched locally by on a local server:

1.  Download the production folder
2.  Instal Node.js on your computer ([nodejs.org/download/](https://nodejs.org/en/download/))
3.  In Command Prompt / Terminal run command `npm install -g serve` or on Windows you can just double click the prepared file _install_local_server.bat_
4.  In Command Prompt / Terminal run command `serve -s build` and open the given url in your browser or on Windows you can just double click the prepared file _run_local.bat_

(Of course you can download the entire project, download needed dependencies and run it by command `npm run start` command.)

## Supported browsers

- Google Chrome (version 60+)
- Firefox (version 50+)
- Edge (version 80+)

## Technologies

- HTML5
- SASS
- ReactJS (18.2.0)
- Chart.js & react-chartjs-2

## Inner structure

The app is made of two main components: Searchbar and WeatherSection.

**Searchbar** consists of a form (with an input field and confirm button) and hints area which is shown when the user starts typing something that matched some city in the cities list. The cities list is fetched at the start of the application.
Below the Searchbar is also button for search forecast for local area or errors are displayed there.

**WeatherSection** fetches the weather forecast data of the given place, optimises them and then passes them to the WeatherTable and WeatherGraph components.

- **WeatherTable** component then sorts the weather records to separated days and then displays the individual dates with its records in a table. The time, temperature and weather icon is displayed.
- **WeatherGraph** simply takes the data and displays them in a form of a line graph. It uses the Chart.js library.
