**Folder structure:**

*src/*
All the files are inside this base component.

*assets/*
Just as the name implies, this houses static files (e.g images) used in the application.

*redux/*
This holds all the redux files if you are using react-redux for managing state. Inside redux folder you have actions, reducers, store which can easily manage your redux files

*redux/slices*
All the action files which are using around redux goes here.
All the reducers which are using around redux goes here.

*redux/store.js*
You can put your store inside this redux store folder.

*components/*
Shared components used across features are placed in this directory. An example of such (as shown above) is the layout component, which is used to wrap the application components and determine its overall layout.

*containers/*
You can put you all screen-based components inside here (Eg - SplashScreen, HomeScreen).

*navigation/*
You project base navigation goes here. You can create stack navigator and export it to your application.

*styles/*
If you have global styles defined in your project you can put it over here like colors, font styles like things.

**Collections**
- users
- course
- transport
- courseTransport