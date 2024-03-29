# Equirectangular Panorama Viewer Project

This project is designed to showcase an immersive equirectangular panorama viewer, similar to Google Street View, created with React and Three.js. It provides an optimized viewing experience with features like zoom, pan, and dynamically loading image qualities based on user interaction. This project was bootstrapped with Create React App.

## Getting Started

First, clone this repository to your local machine. Then, navigate to the project directory and install the dependencies:

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Using the Panorama Viewer Component

## Using the Panorama Viewer Component

The `PanoramaViewer` component is designed to offer an immersive panorama experience within your application. It utilizes WebGL through Three.js to render spherical or cylindrical panoramas, allowing users to navigate the scene with mouse or touch inputs.

### Props

- `texturePath` (**required**): The path to the high-resolution texture for the panorama. This should be a link to an image file that will be used as the main texture for the panorama.
- `lowResTexturePath`: An optional path to a lower resolution version of the panorama texture. This is useful for faster loading times as a placeholder while the high-resolution texture is being loaded.
- `fov` (default = 75): The initial field of view in degrees. This determines how wide or narrow the view is on the initial load.
- `fovMin` (default = 20): The minimum field of view allowed when zooming in. This prevents the user from zooming in too much.
- `fovMax` (default = 90): The maximum field of view allowed when zooming out. This prevents the user from zooming out too much, ensuring the panorama remains immersive.

### Example Usage

```jsx
<PanoramaViewer
  texturePath="path/to/your/panorama.jpg"
  lowResTexturePath="path/to/your/lowRes/panorama.jpg"
  fov={75}
  fovMin={20}
  fovMax={90}
/>
```

## Contributing

We welcome contributions to improve the panorama viewer or to fix any issues you may encounter. Please feel free to open an issue or submit a pull request.
