import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import GUI from 'lil-gui'


export default class Environment{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        // this.resources = this.experience.resources;

        // this.gui = new GUI({ container: document.querySelector(".hero-main")});
        this.obj = {
            colorObj: {r: 0 ,g: 0 ,b: 0},
            intensity: 3,
        };

        this.setSunlight();
        // this.setGUI();
    }

    setGUI(){
        this.gui.addColor(this.obj , "colorObj").onChange(()=>{
            this.sunLight.color.copy(this.obj.colorObj);
            this.ambientLight.color.copy(this.obj.colorObj);
            // console.log(this.obj.colorObj);
        });
        this.gui.add(this.obj,"intensity", 0 ,10).onChange(()=>{
            this.sunLight.intensity = this.obj.intensity;
            this.sunLight.ambientLight = this.obj.intensity;
        });
    }

    setSunlight(){
        this.sunLight = new THREE.DirectionalLight("#faf4e5" , 1);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(2048,2048);
        this.sunLight.shadow.normalBias = 0.05;
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);
        this.sunLight.position.set(1.5,7,5);
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight("#faf4e5" , 0.5);
        this.scene.add(this.ambientLight);
    }

    switchTheme(theme){
        if(theme === "dark"){
            GSAP.to(this.sunLight.color,{
                r: 0.06274509803921569,
                g: 0.08235294117647059,
                b: 0.21568627450980393,
            });
            GSAP.to(this.ambientLight.color,{
                r: 0.06274509803921569,
                g: 0.08235294117647059,
                b: 0.21568627450980393,
            });
            GSAP.to(this.sunLight,{
                intensity: 0.78,
            });
            GSAP.to(this.ambientLight,{
                intensity: 0.78,
            });
        }else{
            GSAP.to(this.sunLight.color,{
                r: 0.43529411764705883,
                g: 0.43529411764705883,
                b: 0.4627450980392157,
                // r: 255 / 255,
                // g: 255 / 255,
                // b: 255 / 255,
            });
            GSAP.to(this.ambientLight.color,{
                r: 0.43529411764705883,
                g: 0.43529411764705883,
                b: 0.4627450980392157,
            });
            GSAP.to(this.sunLight,{
                intensity: 1,
            });
            GSAP.to(this.ambientLight,{
                intensity: 0.5,
            });
        }
    }

    resize() {
    }

    update() {
    }
}