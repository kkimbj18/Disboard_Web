import React, { useEffect, useState } from 'react'
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

function Index() {
    useEffect(() => {
        console.log('aa')
        const canvas = document.querySelector('#c');
        const renderer = new THREE.WebGLRenderer({ canvas });

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(10, 3, 7);


        const scene = new THREE.Scene();
        scene.background = new THREE.Color('black');
        {
            const controls = new OrbitControls(camera, canvas);
            controls.target.set(0, 5, 1);
            controls.update();
        }
        {
            const planeSize = 40;

            const loader = new THREE.TextureLoader();
            const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.magFilter = THREE.NearestFilter;
            const repeats = planeSize / 2;
            texture.repeat.set(repeats, repeats);

            const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
            const planeMat = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(planeGeo, planeMat);
            mesh.rotation.x = Math.PI * -.5;
            scene.add(mesh);
        }

        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 1;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            scene.add(light);
        }

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 10, 0);
            light.target.position.set(-5, 0, 0);
            scene.add(light);
            scene.add(light.target);
        }

        //load material
        {
            const mtlLoader = new MTLLoader();
            mtlLoader.load('/3d/GeneralClassroom_uv.mtl', (mtl) => {
                mtl.preload();
                for (const material of Object.values(mtl.materials)) {
                    console.log(material);
                    material.side = THREE.DoubleSide;
                }
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load(process.env.PUBLIC_URL + '/3d/GeneralClassroom_uv.obj', (root) => {
                    scene.add(root);
                });
            });
        }

        function resizeRendererToDisplaySize(renderer) {
            const canvas = renderer.domElement;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        function render() {

            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }, [])

    return (
        <>
            <canvas width="600" height='300' id="c"></canvas>
            <img src={process.env.PUBLIC_URL + '/abocado.jpg'} />
        </>
    )
}

export default Index
