<p align="center">

</p>


  <p align="center">A simple Firebase Full-Stack Starter template with firebase functions as backend with NestJS. As frontend it has a simple react template that is deployable to Firebase Hosting. All in the same project to get you off the ground quickly.</p>


## Description

This is a simple Full-Stack Template that is using NestJS with Firebase Functions. It is configured as a monorepo (https://docs.nestjs.com/cli/monorepo) so that it is easily extenable with more apps (look at Adding Apps to see how to).
Furthermore, the template has a react frontend that is also configured to be easily deploable to Firebase Hosting (https://firebase.google.com/docs/hosting).
In both the above, it has been configured to use eslint and prettifer and it also has a pre-commit hook using husky to ensure that linting is run on each commit.

Test the api here: https://europe-west1-firebase-full-stack-starter.cloudfunctions.net/appDomainApi/

## Folder Structure

    .
    ├── functions                    # NestJS backend for Firebase functions
    │   ├── src                      # All source code
    │       ├── apps                 # All NestJS app modules
            ├── config               # Configuration for the backend
            ├── libs                 # All NestJS libs
            └── ...                  # etc.
    └── react-frontend

# NestJS Backend


## Adding Apps and Libs
Since this is just a NestJS project one can simply use the Nest CLI to generate new libs and apps according to the NestJS Docs. 

Adding a library can be done with:
```bash
$ cd functions/src
$ nest g library my-library
```

To add a new module then simply rujn the following:

```bash
$ cd functions/src
$ nest generate app my-app-domain
```

## Configure Firebase Functions
In this project, there are three examples of firebase functions. 
1) Https On Request (hosting the NestJS api)
2) Pubsub Topic On Publish Listener
3) Pubsub Cloud Scheduler

### On Request Function

To then wire it up with firebase use (look at apps/firebase-full-stack-starter/src/index.ts):

```javascript
const expressServer = express();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppDomainModule,
    new ExpressAdapter(expressInstance),
  );

  await app.init();
};

export const appDomainApi = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  });
```

### Pubsub Topic Handler
Use the PubsubService to register your topic. Provide the topic to listener for and then also the domain from where it should find the actual handler. The Pubsub Service will look for classes decorated with OnMessage with the topic: 

```javascript
// Pubsub listening on 'my-event'
export const onMyEvent = PubsubService.topic('my-event', AppDomainModule);

......

@Injectable()
export class MyEventListener {
  constructor(private readonly logging: FirebaseLoggingService) {}

  @OnMessage({
    topic: 'my-event',
  })
  async onMyEventMessage(message: Message): Promise<void> {
    this.logging.log(
      `Handling my event and received message ${JSON.stringify(message)}`,
    );
  }
}

```



### Pubsub Cloud Scheduler
To initiate the cloud schedule then first create a class with the PubsubScheduleInterface interface and instantiate it as seen here:

```javascript
// Pubsub scheduler
export const mySchedule = PubsubService.schedule(
  `every monday 06:00`,
  AppDomainModule,
  MyScheduleScheduler,
);

......

@Injectable()
export class MyScheduleScheduler implements PubsubScheduleInterface {
  constructor(private readonly logging: FirebaseLoggingService) {}

  schedule(context: EventContext): Promise<any> {
    this.logging.log(`We are now handling stuff in ${MyScheduleScheduler}`);

    return null;
  }
}

```


## Installation

```bash
$ npm run install-all
$ npm run build
```

## Deployment
Remember to fetch your own service account for firebase admin and add it to to a dev-config.ts. Then you can run the following command which also injects it correctly to the config.ts

```bash
$ npm run deploy:dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests (it runs only for one domain so add more if needed)
$ test:app-domain::e2e

# test coverage
$ npm run test:cov
```

# React Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Deployment

```bash
# Run linting on the react frontend
$ npm run lint-react

# Build and deploy
$ npm run deploy:react-frontend:dev
```

# Stay in touch

- Author - [Brian Bak Laursen](https://github.com/blaur/)

# License

