import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';


export default class Room{
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.onMouseMove();
    }

    setModel(){
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupchild)=>{
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            if(child.name ==="Screen"){
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

            if(child.name === "Iphone"){
                child.position.x = -6.33078;
                child.position.z = 14.0657;
            }


            child.scale.set(0,0,0);
            if( child.name === "cube"){
                // child.scale.set(1,1,1);
                child.position.set(0, -1.5, 0);
                child.rotation.y = Math.PI / 4;
            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 0;
        const height = 0;
        const intensity = 1.5;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );

        rectLight.position.set(-14.7 ,15.3 ,5.3);
        rectLight.rotation.x = -Math.PI / 2;
        rectLight.rotation.z = Math.PI / 4;

        this.actualRoom.add(rectLight);

        this.roomChildren["recLight"] = rectLight;
        // const rectLightHelper = new RectAreaLightHelper(rectLight);
        // rectLight.add(rectLightHelper);

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11,0.11,0.11);

    }

    onMouseMove(){
        window.addEventListener("mousemove" , (e) =>{
            this.rotation = 
                ((e.clientX - window.innerWidth / 2)*2) / window.innerWidth;
            this.lerp.target = this.rotation * 0.05;
        });
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );
        
        this.actualRoom.rotation.y = this.lerp.current;
        
    }
}