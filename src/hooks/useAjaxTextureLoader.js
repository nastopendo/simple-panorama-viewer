/**
 * AjaxTextureLoader function adapted from Stack Overflow.
 *
 * Original author: Jimmy Breck-McKye
 * Answer posted on: April 11, 2017
 * Source: https://stackoverflow.com/a/43347114/18183318
 *
 * This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
 * See https://creativecommons.org/licenses/by-sa/3.0/ for the full license.
 *
 * Modifications were made to integrate with React applications and improve compatibility with Three.js.
 */

import { useState, useEffect } from "react";
import * as THREE from "three";

const useAjaxTextureLoader = (url) => {
  const [texture, setTexture] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);

    const cache = THREE.Cache;
    cache.enabled = true;

    const textureLoader = new THREE.TextureLoader();
    const fileLoader = new THREE.FileLoader();
    fileLoader.setResponseType("blob");

    fileLoader.load(
      url,
      (blob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          textureLoader.load(
            event.target.result,
            (loadedTexture) => {
              setTexture(loadedTexture);
              setIsLoading(false);
            },
            undefined,
            setError
          );
        };
        reader.onerror = setError;
        reader.readAsDataURL(blob);
      },
      (xhr) => {
        setLoadingProgress((xhr.loaded / xhr.total) * 100);
      },
      setError
    );
  }, [url]);

  return { texture, error, loadingProgress, isLoading };
};

export default useAjaxTextureLoader;
