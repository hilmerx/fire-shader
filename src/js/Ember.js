import * as THREE from 'three'
let emberVS = require('js/emberVS.glsl')
let emberFS = require('js/emberFS.glsl')

import particle from '../assets/particle.png'


export default class Ember {
    constructor () {
        this.initPoints()
        this.time = 0.00001
    }

    initPoints () {
        let pointGeometry = new THREE.Geometry()

        for ( let i = 0; i < 5; i ++ ) {
            let point = this.createPoint()
            pointGeometry.vertices.push( point )
        }

        this.pointMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { type: 'i', value: 0 },
                texture1: { type: 't', value: new THREE.TextureLoader().load(particle)},
                size: { type: 'f', value: 10000.0 }
            },
            vertexShader: emberVS,
            fragmentShader: emberFS,
            transparent: true
        })

        this.pointField = new THREE.Points( pointGeometry, this.pointMaterial )
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

    update(time) {
        this.updatePointField()
        this.time += 0.0333
        this.pointField.material.uniforms.time.value = this.time
    }
}

