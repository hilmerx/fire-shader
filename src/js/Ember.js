import * as THREE from 'three'
import Noise from './Noise'

let emberVS = require('js/emberVS.glsl')
let emberFS = require('js/emberFS.glsl')
import particle from '../assets/particle.png'


export default class Ember {
    constructor () {
        this.width = 14
        this.instances = 2500
        this.time = 0.0
        this.initPoints()

    }

    initPoints () {
        function weight(number, scale, min = 0, max = 1) {
            let diff = max - min
            number /= diff
            let buffer = Math.pow(number, scale) 
            buffer *= diff
            return buffer
        }

        // let pointGeometry = new THREE.Geometry()
        var pointGeometry = new THREE.InstancedBufferGeometry()

        // for ( let i = 0; i < 5; i ++ ) {
        //     let point = this.createPoint()
        //     pointGeometry.vertices.push( point )
        // }

        let vertices = new Float32Array([0.0, 0.0, 0.0])
        pointGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )

        let offsets = new THREE.InstancedBufferAttribute(new Float32Array( this.instances * 3), 3, 1)
        let distsToMiddle = new THREE.InstancedBufferAttribute(new Float32Array( this.instances ), 1, 1)
        for (let i = 0, ul = offsets.count; i < ul; i++) {
            let a = Math.random() * 2 * Math.PI
            let r = this.width/2 * Math.sqrt(Math.random())
            r = weight(r, 3, 0, this.width/2)

            let randX = r * Math.cos(a)
            let randZ = r * Math.sin(a)

            offsets.setXYZ(i, randX, 0, randZ)
            distsToMiddle.setX(i, (this.width-(r*2))/this.width)
        }

        pointGeometry.addAttribute('offset', offsets)
        pointGeometry.addAttribute('r', distsToMiddle)
        pointGeometry.addAttribute('rInt', distsToMiddle)


        let timeOffsets = new THREE.InstancedBufferAttribute(new Float32Array( this.instances ), 1, 1)
        for (let i = 0, ul = offsets.count; i < ul; i++) {
            timeOffsets.setX(i, 25*Math.random()+25)
        }
        pointGeometry.addAttribute('timeOffset', timeOffsets)

        let onThresholds = new THREE.InstancedBufferAttribute(new Float32Array( this.instances ), 1, 1)
        for (let i = 0, ul = offsets.count; i < ul; i++) {

            onThresholds.setX(i, Math.random())
        }
        pointGeometry.addAttribute('onThreshold', onThresholds)

        let speed = new THREE.InstancedBufferAttribute(new Float32Array( this.instances ), 1, 1)
        for (let i = 0, ul = offsets.count; i < ul; i++) {

            speed.setX(i, (Math.random()+0.5)/1.5)
        }
        pointGeometry.addAttribute('speed', speed)


        this.pointMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { type: 'i', value: 0 },
                amount: { type: 'f', value: 0 },
                texture1: { type: 't', value: new THREE.TextureLoader().load(particle)},
                size: { type: 'f', value: 10000.0 },
                maxOffset: { type: 'f', value: 100.0 },
                width: { type: 'f', value: this.width }
            },
            vertexShader: emberVS,
            fragmentShader: emberFS,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        this.pointField = new THREE.Points( pointGeometry, this.pointMaterial )
        this.pointField.frustumCulled = false
        this.noise = new Noise()
        this.noise.setScale(0.05) 
    }

    updatePointField () {
        let points = this.pointField.geometry.vertices
        for (let i = points.length-1; i >= 0; i--) {
            let diff = points[i].goal - points[i].y
            points[i].y += diff/10 * points[i].speed
            points[i].x += Math.sin(points[i].y) * (diff/50)
            points[i].z += Math.sin(points[i].y) * (diff/50)

            if (points[i].y > points[i].goal-1) {
                points.splice(i, 1)
                let newPoint = this.createPoint(6)
                this.pointField.geometry.vertices.push(newPoint)
            }
        }    
        this.pointField.geometry.verticesNeedUpdate = true
    }

    createPoint () {
        let point = new THREE.Vector3()
        point.x = THREE.Math.randFloatSpread( 16 )
        point.y = THREE.Math.randFloatSpread( 0 )
        point.z = THREE.Math.randFloatSpread( 16 )
        point.speed = ((Math.random() * 2 ) + 1 ) / 3
        point.goal = Math.random() * 60 

        return point
    }

    update() {
        this.time += 1.0333
        this.pointField.material.uniforms.time.value = this.time

        this.amount = (this.noise.getVal(this.time) + 0.2) / 1.2
        this.pointField.material.uniforms.amount.value = this.amount
    }
}

