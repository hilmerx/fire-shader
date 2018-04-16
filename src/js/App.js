import * as THREE from 'three'
import dat from 'dat.gui'
import Ember from './Ember'
import noise from './Noise'
THREE.OrbitControls = require('three-orbit-controls')(THREE)

import lowpolyscene from '../assets/lowpolyscene.json'
import lowpoly_tex from '../assets/lowpoly_tex.png'

class Scene {
    constructor () {

        this.dirLightSettings = {
            intensity: 0.2,
            dirLightHelper: true,
            position: new THREE.Vector3(0, 250, -250),
            color: [255, 255, 255],
            shadow: {
                near: 280,
                far: 710,
                left: -450,
                right: 200,
                top: 330,
                bottom: -50
            }
        }

        this.campfireLightSettings = {
            intensity: 1,
            baseLineIntensity: 0.5,
            campfireLightHelper: true,
            position: new THREE.Vector3(-102, 16, 55),
            color: [255, 45, 0],
            decay: 0.5,
            distance: 106,
            shadow: {
                near: 280,
                far: 710,
                left: -1150,
                right: 200,
                top: 330,
                bottom: -350
            }
        }

        this.init()
    }

    init () {
        this.initSetup()
        this.initSceneImports()
        this.initLights()
        this.initHelpers()
        this.updateLights()
        this.initFireplace()
    }


    initSetup () {
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
        this.renderer.setClearColor(0x180f2a)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight-5)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-5   ), 0.1, 3000)
        this.camera.position.x = -270
        this.camera.position.y = 50
        this.camera.position.z = 35
    }


    initSceneImports () {
        let texture = new THREE.TextureLoader()
            .load(lowpoly_tex)

        let loader = new THREE.ObjectLoader()
            .load(lowpolyscene, (obj) => {
                obj.traverse( child => {
                    child.material = new THREE.MeshLambertMaterial()
                    child.material.map = texture
                })
                obj.scale.multiplyScalar(20)
                this.scene.add(obj)
            })
    }

    initLights () {
        this.light1 = new THREE.AmbientLight( 0x180f2a, 0.1)
        this.light1.position.set(50, 50, 50)

        this.scene.add(this.light1)

        this.light2 = new THREE.PointLight( 0xffffff, 0.5, 400)
        this.light2.position.set(50, 50, 50)
        this.light2.castShadow = true
        // this.scene.add(this.light2)

        this.campfireLight = new THREE.PointLight( 0xffffff, 0, 400)
        this.campfireLight.position.set(0, 50, -50)
        this.campfireLight.castShadow = true
        this.scene.add(this.campfireLight)

        this.dirLight = new THREE.DirectionalLight()
        this.dirLight.castShadow = true
        this.scene.add(this.dirLight)
    }

    initFireplace () {
        this.ember = new Ember()
        this.scene.add(this.ember.pointField)
        this.ember.pointField.position.set(-102, 5, 55)
    }

    initHelpers() {
        this.controls = new THREE.OrbitControls( this.camera )

        this.controls.target.set( -102, 25, 55 )
        this.controls.update()

        this.gui = new dat.GUI()
        let guiEl = document.getElementsByClassName('dg main a')
        guiEl[0].addEventListener('mousedown', event  => {
            event.stopPropagation()
        })

        // this.campfireLightHelper = new THREE.PointLightHelper(this.campfireLight)
        // this.scene.add(this.campfireLightHelper)


        this.dirLightFolder = this.gui.addFolder('DirectionalLight')
        // this.dirLightFolder.open()

        this.dirLightFolder.add(this.dirLightSettings, 'intensity', 0, 1).onChange( val => {
            this.updateLights()
        })
        this.dirLightFolder.addColor(this.dirLightSettings, 'color').onChange( val => {
            this.updateLights()
        })
        this.dirLightFolder.add(this.dirLightSettings, 'dirLightHelper').onChange( () => {
            this.toggleDirLightHelper()
        })

        this.dirLightPosFolder = this.dirLightFolder.addFolder('Position')
        // this.dirLightPosFolder.open()

        this.dirLightPosFolder.add(this.dirLightSettings.position, 'x').onChange(() => {
            this.updateLights()
        })
        this.dirLightPosFolder.add(this.dirLightSettings.position, 'y').onChange( () => {
            this.updateLights()
        })
        this.dirLightPosFolder.add(this.dirLightSettings.position, 'z').onChange( () => {
            this.updateLights()
        })

        this.dirLightShadowFolder = this.dirLightFolder.addFolder('Shadows')
        // this.dirLightShadowFolder.open()

        for (let key in this.dirLightSettings.shadow) {
            this.dirLightShadowFolder.add(this.dirLightSettings.shadow, key).onChange( () => {
                this.updateLights()
            })
        }


        this.campfireLightFolder = this.gui.addFolder('Campfire Light')
        // this.campfireLightFolder.open()

        this.campfireLightFolder.add(this.campfireLightSettings, 'intensity', 0, 1).onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.addColor(this.campfireLightSettings, 'color').onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.add(this.campfireLightSettings, 'decay', 0, 1).onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.add(this.campfireLightSettings, 'distance', 0, 1000).onChange( val => {
            this.updateLights()
        })
        this.campfireLightFolder.add(this.campfireLightSettings, 'campfireLightHelper').onChange( () => {
            // this.toggleDirLightHelper()
        })


        this.campfireLightPosFolder = this.campfireLightFolder.addFolder('Position')
        // this.campfireLightPosFolder.open()

        this.campfireLightPosFolder.add(this.campfireLightSettings.position, 'x').onChange(() => {
            this.updateLights()
        })
        this.campfireLightPosFolder.add(this.campfireLightSettings.position, 'y').onChange( () => {
            this.updateLights()
        })
        this.campfireLightPosFolder.add(this.campfireLightSettings.position, 'z').onChange( () => {
            this.updateLights()
        })

        this.campfireLightShadowFolder = this.campfireLightFolder.addFolder('Shadows')
        // this.campfireLightShadowFolder.open()

        for (let key in this.campfireLightSettings.shadow) {
            this.campfireLightShadowFolder.add(this.campfireLightSettings.shadow, key).onChange( () => {
                this.updateLights()
            })
        }

    }

    updateLights () {
        this.updateDirLights()
        this.updateCampfireLights()
    }

    updateDirLights () {
        let light = this.dirLight
        let settings = this.dirLightSettings
        light.position.copy(settings.position)
        light.intensity = settings.intensity
        light.shadow.camera.near = settings.shadow.near
        light.shadow.camera.far = settings.shadow.far
        light.shadow.camera.left = settings.shadow.left
        light.shadow.camera.right = settings.shadow.right
        light.shadow.camera.top = settings.shadow.top
        light.shadow.camera.bottom = settings.shadow.bottom

        light.color.setRGB(settings.color[0]/256, settings.color[1]/256, settings.color[2]/256)

        light.shadow.camera.updateProjectionMatrix()

    }

    updateCampfireLights () {
        let light = this.campfireLight
        let settings = this.campfireLightSettings
        light.position.copy(settings.position)
        light.intensity = settings.intensity
        light.decay = settings.decay
        light.distance = settings.distance
        light.shadow.camera.near = settings.shadow.near
        light.shadow.camera.far = settings.shadow.far
        light.shadow.camera.left = settings.shadow.left
        light.shadow.camera.right = settings.shadow.right
        light.shadow.camera.top = settings.shadow.top
        light.shadow.camera.bottom = settings.shadow.bottom

        light.color.setRGB(settings.color[0]/256, settings.color[1]/256, settings.color[2]/256)

        light.shadow.camera.updateProjectionMatrix()

    }

    toggleDirLightHelper () {
        if (!this.dirLightHelper) {
            this.dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight)
            this.scene.add(this.dirLightHelper)

            this.dirLightShadowHelper = new THREE.CameraHelper( this.dirLight.shadow.camera )
            this.scene.add( this.dirLightShadowHelper )

        } else {
            this.scene.remove(this.dirLightHelper)
            this.dirLightHelper = undefined

            this.scene.remove( this.dirLightShadowHelper )
            this.dirLightShadowHelper = undefined
        }
    }

    animateCampfire (time) {
        if (time >= 0) {
            let deltaTime1 = (time%1000)/(1000/2)
            let deltaTime2 = (time%400)/(400/2)
            let deltaTime3 = (time%2456)/(2456/2)
            let deltaTime4 = (time%1200)/(1000/2)
            this.campfireLight.intensity = deltaTime1 + deltaTime2 + deltaTime3 + deltaTime4 + this.campfireLightSettings.baseLineIntensity

        }
    }


    update(time) {
        this.animateCampfire(time)
        this.ember.update()
    }
}


let scene = new Scene ()

function render(time) {

    scene.update(time)
    scene.renderer.render(scene.scene, scene.camera)
    requestAnimationFrame(render)
}
render()



