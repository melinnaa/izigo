**Folder structure:**

*src/*
All the files are inside this base component.

*assets/*
Just as the name implies, this houses static files (e.g images) used in the application.

*assets/fonts*
To put the fonts used in the project

*assets/img*
All the images used in the application

*firebase/*
Folder to configure Firebase 

*redux/*
This holds all the redux files if we are using react-redux for managing state. Inside redux folder there are actions, reducers, store which can easily manage the redux files

*redux/slices*
All the action files which are using around redux goes here.
All the reducers which are using around redux goes here.

*redux/store.js*
To put our store inside this redux store folder.

*components/*
Shared components used across features are placed in this directory. An example of such is the layout component, which is used to wrap the application components and determine its overall layout.

*containers/*
We put all screen-based components inside here (Eg - SplashScreen, HomeScreen).

*navigation/*
Project base navigation goes here. We can create stack navigator and export it to our application.

*styles/*
If we have global styles defined in our project we can put it over here like colors, font styles like things.

**Collections**
- users
- course
- transport
- courseTransport

**Pages description**
*components/home*
- Search.js: page to search an itinerary by input with a start point and an end point
- Main.js: page d'accueil
- itinerary.js: affiche les parcours correspondant à la recherche

*componenets/actuality*
- Filtre.js: page to choose the line which we want to see actuaties.
- InfoTwitter.js: page with last tweets for the line and possibility tu go to tweeter account and add a tweet.
- Report.js: To tweet a report for a line
- TwitterAPI.js: page to get results from TwitterAPI

*components/authentification*
- Login.js: page to loggin
- Register.js: page to register

*components/favorites*
- FavoriteList.js: list of favorite itinerary of logged user
- FavoriteDetails.js: statistiques for each itinerary

*components/traffic*
- TrafficFilters.js: search a line by input
- TrafficMAp: show map with line itinerary, time of departure and disruptions from the line in realtime



