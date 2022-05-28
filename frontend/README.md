# notion <> kindle frontend

this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### requirements:

the following environment variables are required:

- `REACT_APP_SERVICE_URL`: service url generated from backend deployment.
- `REACT_APP_NOTION_CLIENT_ID`: client id from the notion public integration. this is required for to get authorization for desired notion page.

in order to meet notion's public integration requirements, and thus to properly authorize to notion workspaces, your frontend cannot be running in a public IP adddress.

### get started:

- `npm i` to install dependencies
- `npm start` to run the app locally
