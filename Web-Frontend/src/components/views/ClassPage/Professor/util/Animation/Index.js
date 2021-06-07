import * as THREE from 'three'

export default function startAnim() {
    const canvas = document.querySelector('#canvas2');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    const scene = new THREE.Scene();
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [];  // just an array we can use to rotate the cubes
    const aaa = document.querySelector("#canvas0");
    const texture = new THREE.CanvasTexture(aaa);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubes.push(cube);  // add to our list of cubes to rotate
    console.log(canvas.width);

    function render(time) {
        time *= 0.001;
        texture.needsUpdate = true;

        cubes.forEach((cube, ndx) => {
            const speed = .2 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}