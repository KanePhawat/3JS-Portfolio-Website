import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from '@ashthornton/asscroll'



export default class Controls {
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach((child) =>{
            if(child.type === 'RectAreaLight') {
                this.rectLight = child;
            }
        });
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;
        
        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";

        if (
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            this.setSmoothScroll();
        }
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            ease: 0.1,
            disableRaf: true,
        });

        GSAP.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement,
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    asscroll.currentPos = value;
                    return;
                }
                return asscroll.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            fixedMarkers: true,
        });

        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        requestAnimationFrame(() => {
            asscroll.enable({
                newScrollElements: document.querySelectorAll(
                    ".gsap-marker-start, .gsap-marker-end, [asscroll]"
                ),
            });
        });
        return asscroll;
    }
    
    setSmoothScroll() {
        this.asscroll = this.setupASScroll();
    }
    
    setScrollTrigger() {
        ScrollTrigger.matchMedia({
            //Desktop
            "(min-width: 969px)": () => {
                // console.log("fired desktop");

                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width = 0.1;
                this.rectLight.height = 0.1;
                this.camera.orthographicCamera.position.set(0, 6.5, 10);
                this.room.position.set(0, 0, 0);
                //First section ------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                });
                this.firstMoveTimeline.fromTo(
                    this.room.position,
                    { x: 0, y: 0, z: 0 },
                    {
                        x: () => {
                            return this.sizes.width * 0.0014;
                        },
                    }
                );

                //Second section ------------------------------
                 this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(
                        this.room.position,
                        {
                            x: () => {
                                return 1;
                            },
                            z: () => {
                                return this.sizes.height * 0.0032;
                            },
                        },
                        "same"
                    )
                    .to(
                        this.room.scale, 
                        {
                            x: 0.4,
                            y: 0.4,
                            z: 0.4,
                        }, 
                        "same"
                    )
                    .to(
                        this.rectLight,
                        {
                            width: 0,
                            height: 0,
                        }, 
                        "same"
                    );

                //Thrid section ------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.rectLight.position,{
                    x: -8.4,
                    y: 1,
                    z: 25.1
                }).to(this.rectLight,{
                    width:  2.75,
                    height: 4.295,
                }).to(this.rectLight.rotation ,{
                    x : -Math.PI / 2,
                    y : 0,
                    z : Math.PI/4,
                }).to(this.camera.orthographicCamera.position, {
                    y: -2.0,
                    x: -4.5,
                });
            },            

            //Mobile
            "(max-width: 968px)": ()=> {
                
                // Resets
                this.room.scale.set(0.07, 0.07 ,0.07);
                this.room.position.set(0,0,0);
                this.rectLight.width = 0.1;
                this.rectLight.height = 0.1;

                //First section ------------------------------
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale,{
                    x: 0.1 ,
                    y: 0.1 ,
                    z: 0.1 ,
                });

                //Second section ------------------------------
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale,{
                    x: 0.25,
                    y: 0.25,
                    z: 0.25, 
                },"same").to(this.rectLight, {
                    width: 0.1 * 2.5,
                    height: 0.1 * 2.5,
                },"same").to(this.room.position ,{
                    x: 1.5,
                },"same")

                //Thrid section ------------------------------
                this.thirdMoveTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position, {
                    z: -4.5,
                });
            },

            all: ()=>{
                this.sections = document.querySelectorAll('.section');
                this.sections.forEach((section) => {
                    this.progressWrapper = 
                        section.querySelector(".progress-wrapper");
                    this.progressBar = 
                        section.querySelector(".progress-bar");

                    if(section.classList.contains("right")){
                        GSAP.to(section, {
                            borderTopLeftRadius: 100,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.3,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 100,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.3,
                            },
                        });
                    }else{
                        GSAP.to(section, {
                            borderTopRightRadius: 100,
                            scrollTrigger: {
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.3,
                            },
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 100,
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.3,
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    });
                });

                // All animations ------
                //First section ------------------------------
                this.firstCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleFirst.scale , {
                    x: 3,
                    y: 3,
                    z: 3,
                });

                //Second section ------------------------------
                this.secondCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleSecond.scale , {
                    x: 3,
                    y: 3,
                    z: 3,
                }, "same" ).to(this.room.position , {
                    y: 0.7,
                }, "same");

                //Thrid section ------------------------------
                this.thirdCircle = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleThird.scale , {
                    x: 3,
                    y: 3,
                    z: 3,
                })


                // Mini Platform Animations
                this.secondPartTimeline = new GSAP.timeline({
                    scrollTrigger: {
                        trigger: ".third-move",
                        start: "center center",
                    },
                });


                this.room.children.forEach((child)=>{
                    if(child.name === "Iphone"){
                        this.first = GSAP.to(child.position, {
                            x: -12.9095,
                            z: 20.6444,
                            duration: 0.5,
                        });
                    }
                    if(child.name === "Blender"){
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.5,
                        });
                    }
                    if(child.name === "Github"){
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.5,
                        });
                    }
                    if(child.name === "LinkedIn"){
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.5,
                        });
                    }
                    if(child.name === "Email"){
                        this.fifth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.5,
                        });
                    }
                });
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third);
                this.secondPartTimeline.add(this.fourth);
                this.secondPartTimeline.add(this.fifth);
            },
          }); 

    }

    resize() {
    }

    update() {
    } 
}
