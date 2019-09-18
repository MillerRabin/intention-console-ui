**Intension Console UI**

## Structure
    The builder folder contains builder for the project. It creates html files from pug templates.    
---

## Dependencies
    NodeJS 11.x or above

## How to install

First, You need to install dependencies for the project and builder 

```sh
npm install
cd ./builder
npm install
```

Next, you need to build static html files from pug templates

```sh
node ./builder/main.js
```

Finally, map your favorite web server to the project folder and open it in browser

## Build in development mode

To build html with all files uncompressed.

```sh
./builder/main.js debug
```


