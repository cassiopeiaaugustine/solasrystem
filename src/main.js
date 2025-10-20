import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'
import { gsap } from 'gsap'

class SolarSystemApp {
    constructor() {
        this.scene = null
        this.camera = null
        this.renderer = null
        this.controls = null
        this.clock = new THREE.Clock()
        this.gui = null
        this.animationId = null
        this.isAnimating = true
        
        
        // Objects
        this.sun = null
        this.earth = null
        this.moon = null
        this.planets = []
        this.planetLabels = []
        this.stars = []
        this.text3D = null
        this.atmosphere = null
        this.saturnRings = []
        
        // Materials
        this.sunMaterial = null
        this.earthMaterial = null
        this.moonMaterial = null
        this.atmosphereMaterial = null
        this.planetMaterials = []
        this.starMaterial = null
        
        // Textures
        this.earthTextures = {
            map: null,
            normalMap: null,
            specularMap: null,
            bumpMap: null,
            roughnessMap: null
        }
        
        this.saturnTextures = {
            map: null
        }
        
        this.jupiterTextures = {
            map: null
        }
        
        this.venusTextures = {
            map: null
        }
        
        this.mercuryTextures = {
            map: null
        }
        
        this.neptuneTextures = {
            map: null
        }
        
        this.uranusTextures = {
            map: null
        }
        
        // Parameters
        this.params = {
            sunRotationSpeed: 0.01,
            sunScale: 1.0,
            sunGlowIntensity: 1.0,
            showSunEffects: true,
            earthRotationSpeed: 0.01,
            earthScale: 1.0,
            atmosphereOpacity: 0.3,
            animationSpeed: 0.3,
            showOrbits: true,
            showStars: true,
            cameraAutoRotate: false,
            cameraAutoRotateSpeed: 2.0,
            background: '#000011',
            wireframe: false,
            showAxes: false,
            showAtmosphere: true,
            earthRoughness: 0.8,
            earthMetalness: 0.1,
            planetScale: 1.0,
            showSaturnRings: true,
            moonOrbitSpeed: 0.05,
            showMoon: true,
            showPlanetLabels: true,
            cinematicMode: false
        }
        
        // Cinematic camera variables
        this.cinematicAngle = 0
        this.cinematicMode = false
        
        this.init()
    }
    
    init() {
        this.createScene()
        this.createCamera()
        this.createRenderer()
        this.createControls()
        this.createLights()
        this.createMaterials()
        this.createObjects()
        this.createGUI()
        this.setupEventListeners()
        this.animate()
    }
    
    createScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(this.params.background)
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            5000
        )
        // Sun Focus Camera
        this.camera.position.set(0, 10, 30)
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.2
        
        document.getElementById('container').appendChild(this.renderer.domElement)
    }
    
    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.enableZoom = true
        this.controls.enablePan = true
        this.controls.autoRotate = this.params.cameraAutoRotate
        this.controls.autoRotateSpeed = this.params.cameraAutoRotateSpeed
    }
    
    createLights() {
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
        this.scene.add(ambientLight)
        
      
        const sunLight = new THREE.DirectionalLight(0xffffff, 2.0)
        sunLight.position.set(10, 5, 5)
        sunLight.castShadow = true
        sunLight.shadow.mapSize.width = 2048
        sunLight.shadow.mapSize.height = 2048
        sunLight.shadow.camera.near = 0.5
        sunLight.shadow.camera.far = 100
        sunLight.shadow.camera.left = -50
        sunLight.shadow.camera.right = 50
        sunLight.shadow.camera.top = 50
        sunLight.shadow.camera.bottom = -50
        this.scene.add(sunLight)
        
       
        const pointLight = new THREE.PointLight(0xffffff, 1.0, 200)
        pointLight.position.set(-5, 3, 5)
        this.scene.add(pointLight)
        
       
        const earthLight = new THREE.DirectionalLight(0xffffff, 0.5)
        earthLight.position.set(-10, 0, 0)
        this.scene.add(earthLight)
    }
    
    createMaterials() {
        this.createSunMaterial()
        this.createEarthMaterial()
        this.createMoonMaterial()
        this.createAtmosphereMaterial()
        
        
        this.createEarthTextures()
        this.createSaturnTextures()
        this.createJupiterTextures()
        this.createVenusTextures()
        this.createMercuryTextures()
        this.createNeptuneTextures()
        this.createUranusTextures()
        
       
        const planetColors = [
            '#8c7853', // Mercury
            '#ffc649', // Venus
            '#6b93d6', // Earth
            '#c1440e', // Mars
            '#d8ca9d', // Jupiter
            '#fad5a5', // Saturn
            '#4fd0e7', // Uranus
            '#4b70dd'  // Neptune
        ]
        
        this.planetMaterials = planetColors.map(color => 
            new THREE.MeshPhongMaterial({ 
                color: color,
                shininess: 30
            })
        )
        
        // Star material
        this.starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        })
    }
    
    createSunMaterial() {
        this.sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            emissive: 0xffaa00,
            emissiveIntensity: 1.2
        })
    }
    
    createMoonMaterial() {
        this.moonMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            emissive: 0x222222,
            shininess: 10
        })
    }
    
    createEarthTextures() {
        const textureLoader = new THREE.TextureLoader()
        
       
        console.log('Attempting to load earth.jpg...')
        
        
        this.earthTextures.map = textureLoader.load(
            '/earth.jpg',
            (texture) => {
                console.log('Earth texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                
                if (this.earthMaterial) {
                    this.earthMaterial.map = texture
                    this.earthMaterial.needsUpdate = true
                    console.log('Earth material updated with texture')
                }
              
                if (this.earth) {
                    this.earth.material.map = texture
                    this.earth.material.needsUpdate = true
                    console.log('Earth planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading earth.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load earth.jpg:', error)
                console.log('Trying alternative path...')
            
                this.earthTextures.map = textureLoader.load(
                    'earth.jpg',
                    (texture) => {
                        console.log('Earth texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        if (this.earthMaterial) {
                            this.earthMaterial.map = texture
                            this.earthMaterial.needsUpdate = true
                        }
                        if (this.earth) {
                            this.earth.material.map = texture
                            this.earth.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load earth.jpg with alternative path:', error2)
                        console.log('Creating a test texture...')
                      
                        const canvas = document.createElement('canvas')
                        canvas.width = 512
                        canvas.height = 512
                        const ctx = canvas.getContext('2d')
                        
                     
                        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
                        gradient.addColorStop(0, '#4a90e2')
                        gradient.addColorStop(0.7, '#2e7d32')
                        gradient.addColorStop(1, '#1b5e20')
                        ctx.fillStyle = gradient
                        ctx.fillRect(0, 0, 512, 512)
                        
                     
                        ctx.fillStyle = '#8bc34a'
                        ctx.fillRect(100, 150, 80, 60)
                        ctx.fillRect(300, 200, 100, 80)
                        ctx.fillRect(200, 300, 60, 40)
                        
                        const testTexture = new THREE.CanvasTexture(canvas)
                        testTexture.wrapS = THREE.ClampToEdgeWrapping
                        testTexture.wrapT = THREE.ClampToEdgeWrapping
                        
                        if (this.earthMaterial) {
                            this.earthMaterial.map = testTexture
                            this.earthMaterial.needsUpdate = true
                        }
                        if (this.earth) {
                            this.earth.material.map = testTexture
                            this.earth.material.needsUpdate = true
                        }
                        console.log('Applied test texture to Earth')
                    }
                )
            }
        )
        
     
        this.earthTextures.normalMap = textureLoader.load(
            'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                if (this.earthMaterial) {
                    this.earthMaterial.normalMap = texture
                    this.earthMaterial.needsUpdate = true
                }
                if (this.earth) {
                    this.earth.material.normalMap = texture
                    this.earth.material.needsUpdate = true
                }
            }
        )
        
       
        this.earthTextures.specularMap = textureLoader.load(
            'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                if (this.earthMaterial) {
                    this.earthMaterial.metalnessMap = texture
                    this.earthMaterial.needsUpdate = true
                }
                if (this.earth) {
                    this.earth.material.metalnessMap = texture
                    this.earth.material.needsUpdate = true
                }
            }
        )
        
        
        this.earthTextures.bumpMap = textureLoader.load(
            'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                if (this.earthMaterial) {
                    this.earthMaterial.bumpMap = texture
                    this.earthMaterial.needsUpdate = true
                }
                if (this.earth) {
                    this.earth.material.bumpMap = texture
                    this.earth.material.needsUpdate = true
                }
            }
        )
        
    
        this.earthTextures.roughnessMap = textureLoader.load(
            'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                if (this.earthMaterial) {
                    this.earthMaterial.roughnessMap = texture
                    this.earthMaterial.needsUpdate = true
                }
                if (this.earth) {
                    this.earth.material.roughnessMap = texture
                    this.earth.material.needsUpdate = true
                }
            }
        )
    }
    
    createSaturnTextures() {
        const textureLoader = new THREE.TextureLoader()
        
     
        this.saturnTextures.map = textureLoader.load(
            '/saturn.jpg',
            (texture) => {
                console.log('Saturn texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
        
                const saturnPlanet = this.planets.find(planet => planet.userData.name === 'Saturn')
                if (saturnPlanet) {
                    saturnPlanet.material.map = texture
                    saturnPlanet.material.needsUpdate = true
                    console.log('Saturn planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading saturn.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load saturn.jpg:', error)
                console.log('Trying alternative path...')
               
                this.saturnTextures.map = textureLoader.load(
                    'saturn.jpg',
                    (texture) => {
                        console.log('Saturn texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        const saturnPlanet = this.planets.find(planet => planet.userData.name === 'Saturn')
                        if (saturnPlanet) {
                            saturnPlanet.material.map = texture
                            saturnPlanet.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load saturn.jpg with alternative path:', error2)
                        console.log('Saturn will use default color')
                    }
                )
            }
        )
    }
    
    createJupiterTextures() {
        const textureLoader = new THREE.TextureLoader()
        
        
        this.jupiterTextures.map = textureLoader.load(
            '/jupiter.jpg',
            (texture) => {
                console.log('Jupiter texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
               
                const jupiterPlanet = this.planets.find(planet => planet.userData.name === 'Jupiter')
                if (jupiterPlanet) {
                    jupiterPlanet.material.map = texture
                    jupiterPlanet.material.needsUpdate = true
                    console.log('Jupiter planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading jupiter.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load jupiter.jpg:', error)
                console.log('Trying alternative path...')
           
                this.jupiterTextures.map = textureLoader.load(
                    'jupiter.jpg',
                    (texture) => {
                        console.log('Jupiter texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        const jupiterPlanet = this.planets.find(planet => planet.userData.name === 'Jupiter')
                        if (jupiterPlanet) {
                            jupiterPlanet.material.map = texture
                            jupiterPlanet.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load jupiter.jpg with alternative path:', error2)
                        console.log('Jupiter will use default color')
                    }
                )
            }
        )
    }
    
    createVenusTextures() {
        const textureLoader = new THREE.TextureLoader()
        
      
        this.venusTextures.map = textureLoader.load(
            '/venus.jpg',
            (texture) => {
                console.log('Venus texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
         
                const venusPlanet = this.planets.find(planet => planet.userData.name === 'Venus')
                if (venusPlanet) {
                    venusPlanet.material.map = texture
                    venusPlanet.material.needsUpdate = true
                    console.log('Venus planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading venus.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load venus.jpg:', error)
                console.log('Trying alternative path...')
            
                this.venusTextures.map = textureLoader.load(
                    'venus.jpg',
                    (texture) => {
                        console.log('Venus texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        const venusPlanet = this.planets.find(planet => planet.userData.name === 'Venus')
                        if (venusPlanet) {
                            venusPlanet.material.map = texture
                            venusPlanet.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load venus.jpg with alternative path:', error2)
                        console.log('Venus will use default color')
                    }
                )
            }
        )
    }
    
    createMercuryTextures() {
        const textureLoader = new THREE.TextureLoader()
        
    
        this.mercuryTextures.map = textureLoader.load(
            '/mercury.jpg',
            (texture) => {
                console.log('Mercury texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
         
                const mercuryPlanet = this.planets.find(planet => planet.userData.name === 'Mercury')
                if (mercuryPlanet) {
                    mercuryPlanet.material.map = texture
                    mercuryPlanet.material.needsUpdate = true
                    console.log('Mercury planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading mercury.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load mercury.jpg:', error)
                console.log('Trying alternative path...')
       
                this.mercuryTextures.map = textureLoader.load(
                    'mercury.jpg',
                    (texture) => {
                        console.log('Mercury texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        const mercuryPlanet = this.planets.find(planet => planet.userData.name === 'Mercury')
                        if (mercuryPlanet) {
                            mercuryPlanet.material.map = texture
                            mercuryPlanet.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load mercury.jpg with alternative path:', error2)
                        console.log('Mercury will use default color')
                    }
                )
            }
        )
    }
    
    createNeptuneTextures() {
        const textureLoader = new THREE.TextureLoader()
        
     
        this.neptuneTextures.map = textureLoader.load(
            '/neptune.jpg',
            (texture) => {
                console.log('Neptune texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
             
                const neptunePlanet = this.planets.find(planet => planet.userData.name === 'Neptune')
                if (neptunePlanet) {
                    neptunePlanet.material.map = texture
                    neptunePlanet.material.needsUpdate = true
                    console.log('Neptune planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading neptune.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load neptune.jpg:', error)
                console.log('Trying alternative path...')
            
                this.neptuneTextures.map = textureLoader.load(
                    'neptune.jpg',
                    (texture) => {
                        console.log('Neptune texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        const neptunePlanet = this.planets.find(planet => planet.userData.name === 'Neptune')
                        if (neptunePlanet) {
                            neptunePlanet.material.map = texture
                            neptunePlanet.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load neptune.jpg with alternative path:', error2)
                        console.log('Neptune will use default color')
                    }
                )
            }
        )
    }
    
    createUranusTextures() {
        const textureLoader = new THREE.TextureLoader()
        
  
        this.uranusTextures.map = textureLoader.load(
            '/uranus.jpg',
            (texture) => {
                console.log('Uranus texture loaded successfully:', texture)
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
           
                const uranusPlanet = this.planets.find(planet => planet.userData.name === 'Uranus')
                if (uranusPlanet) {
                    uranusPlanet.material.map = texture
                    uranusPlanet.material.needsUpdate = true
                    console.log('Uranus planet updated with texture')
                }
            },
            (progress) => {
                console.log('Loading uranus.jpg progress:', (progress.loaded / progress.total * 100) + '%')
            },
            (error) => {
                console.error('Failed to load uranus.jpg:', error)
                console.log('Trying alternative path...')
            
                this.uranusTextures.map = textureLoader.load(
                    'uranus.jpg',
                    (texture) => {
                        console.log('Uranus texture loaded with alternative path')
                        texture.wrapS = THREE.ClampToEdgeWrapping
                        texture.wrapT = THREE.ClampToEdgeWrapping
                        const uranusPlanet = this.planets.find(planet => planet.userData.name === 'Uranus')
                        if (uranusPlanet) {
                            uranusPlanet.material.map = texture
                            uranusPlanet.material.needsUpdate = true
                        }
                    },
                    undefined,
                    (error2) => {
                        console.error('Failed to load uranus.jpg with alternative path:', error2)
                        console.log('Uranus will use default color')
                    }
                )
            }
        )
    }
    
    createEarthMaterial() {
        this.earthMaterial = new THREE.MeshStandardMaterial({
            map: this.earthTextures.map,
            normalMap: this.earthTextures.normalMap,
            metalnessMap: this.earthTextures.specularMap,
            bumpMap: this.earthTextures.bumpMap,
            roughnessMap: this.earthTextures.roughnessMap,
            bumpScale: 0.3,
            roughness: 0.7,
            metalness: 0.0,
            transparent: false,
            side: THREE.FrontSide,
        
            color: 0x4a90e2
        })
    }
    
    createAtmosphereMaterial() {
        this.atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: this.params.atmosphereOpacity,
            side: THREE.BackSide
        })
    }
    
    createObjects() {
        this.createSun()
        this.createMoon()
        this.createAtmosphere()
        this.createPlanets()  
        this.createStars()
        this.create3DText()
        this.createAxes()
    }
    
    createSun() {
        // Create the main sun sphere
        const geometry = new THREE.SphereGeometry(3, 32, 32)
        this.sun = new THREE.Mesh(geometry, this.sunMaterial)
        this.sun.position.set(0, 0, 0) // Center Sun at origin
        this.sun.scale.setScalar(this.params.sunScale)
        this.scene.add(this.sun)
        
        // Add glowing effect
        this.createSunGlow()
        
        // Add corona effect
        this.createSunCorona()
    }
    
    createSunGlow() {
    
        const glowGeometry = new THREE.SphereGeometry(4, 32, 32)
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        })
        
        this.sunGlow = new THREE.Mesh(glowGeometry, glowMaterial)
        this.sunGlow.position.set(0, 0, 0)
        this.sunGlow.scale.setScalar(this.params.sunScale * 1.2)
        this.scene.add(this.sunGlow)
    }
    
    
    createSunCorona() {
        
        const coronaGeometry = new THREE.SphereGeometry(5, 32, 32)
        const coronaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        })
        
        this.sunCorona = new THREE.Mesh(coronaGeometry, coronaMaterial)
        this.sunCorona.position.set(0, 0, 0)
        this.sunCorona.scale.setScalar(this.params.sunScale * 1.5)
        this.scene.add(this.sunCorona)
        
        // Create outer corona layer
        const outerCoronaGeometry = new THREE.SphereGeometry(6, 32, 32)
        const outerCoronaMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.05,
            side: THREE.BackSide
        })
        
        this.sunOuterCorona = new THREE.Mesh(outerCoronaGeometry, outerCoronaMaterial)
        this.sunOuterCorona.position.set(0, 0, 0)
        this.sunOuterCorona.scale.setScalar(this.params.sunScale * 2)
        this.scene.add(this.sunOuterCorona)
    }
    
    createEarth() {
     
        console.log('Note: Earth is now created as part of the planets array in createPlanets()')
    }
    
    createMoon() {
        if (!this.params.showMoon) return
        
        const geometry = new THREE.SphereGeometry(0.27, 16, 16) // Moon is about 0.27x Earth's size
        this.moon = new THREE.Mesh(geometry, this.moonMaterial)
        this.moon.castShadow = true
        this.moon.receiveShadow = true
        
      
        this.moon.userData = {
            distance: 3.5, // Distance from Earth
            speed: this.params.moonOrbitSpeed,
            angle: 0
        }
        
        
        this.moon.position.set(35, 0, 3.5) 
        
        this.scene.add(this.moon)
    }
    
    createAtmosphere() {
        if (!this.params.showAtmosphere) return
        
        const geometry = new THREE.SphereGeometry(2.1, 32, 32)
        this.atmosphere = new THREE.Mesh(geometry, this.atmosphereMaterial)
        this.atmosphere.position.set(0, 0, 0) 
        this.scene.add(this.atmosphere)
    }
    
    createPlanets() {
       
        const planetData = [
            { name: 'Mercury', distance: 15, size: 0.38, speed: 0.02 },      // 1st from Sun
            { name: 'Venus', distance: 25, size: 0.95, speed: 0.015 },       // 2nd from Sun
            { name: 'Earth', distance: 35, size: 1.0, speed: 0.01 },         // 3rd from Sun
            { name: 'Mars', distance: 50, size: 0.53, speed: 0.008 },        // 4th from Sun
            { name: 'Jupiter', distance: 80, size: 11.2, speed: 0.005 },     // 5th from Sun
            { name: 'Saturn', distance: 120, size: 9.4, speed: 0.003 },      // 6th from Sun
            { name: 'Uranus', distance: 160, size: 4.0, speed: 0.002 },      // 7th from Sun
            { name: 'Neptune', distance: 200, size: 3.9, speed: 0.001 }      // 8th from Sun
        ]
        
        planetData.forEach((data, index) => {
            const scaledSize = data.size * this.params.planetScale
            const geometry = new THREE.SphereGeometry(scaledSize, 32, 32)
            
            
            let material
            if (data.name === 'Earth') {
                material = this.earthMaterial
                console.log('Using Earth material for Earth planet')
            } else if (data.name === 'Mercury') {
               
                material = new THREE.MeshPhongMaterial({
                    color: 0x8c7853,
                    shininess: 30
                })
                console.log('Using Mercury material for Mercury planet')
            } else if (data.name === 'Venus') {
               
                material = new THREE.MeshPhongMaterial({
                    color: 0xffc649,
                    shininess: 30
                })
                console.log('Using Venus material for Venus planet')
            } else if (data.name === 'Saturn') {
             
                material = new THREE.MeshPhongMaterial({
                    color: 0xfad5a5,
                    shininess: 30
                })
                console.log('Using Saturn material for Saturn planet')
            } else if (data.name === 'Jupiter') {
               
                material = new THREE.MeshPhongMaterial({
                    color: 0xd8ca9d,
                    shininess: 30
                })
                console.log('Using Jupiter material for Jupiter planet')
            } else if (data.name === 'Uranus') {
            
                material = new THREE.MeshPhongMaterial({
                    color: 0x4fd0e7,
                    shininess: 30
                })
                console.log('Using Uranus material for Uranus planet')
            } else if (data.name === 'Neptune') {
      
                material = new THREE.MeshPhongMaterial({
                    color: 0x4b70dd,
                    shininess: 30
                })
                console.log('Using Neptune material for Neptune planet')
            } else {
                material = this.planetMaterials[index]
            }
            
            const planet = new THREE.Mesh(geometry, material)
            
            planet.position.x = data.distance
            planet.castShadow = true
            planet.receiveShadow = true
            
            // Store planet data for animation
            planet.userData = {
                distance: data.distance,
                speed: data.speed,
                angle: Math.random() * Math.PI * 2,
                name: data.name,
                originalSize: data.size
            }
            
            this.planets.push(planet)
            this.scene.add(planet)
            
           
            if (data.name === 'Earth') {
                this.earth = planet
                console.log('Earth planet reference stored:', this.earth)
            }
            
            // Create planet label
            this.createPlanetLabel(planet, data.name)
            
            // Create Saturn's rings
            if (data.name === 'Saturn' && this.params.showSaturnRings) {
                this.createSaturnRings(data.distance, scaledSize, planet)
            }
            
            // Create orbit ring
            if (this.params.showOrbits) {
                this.createOrbitRing(data.distance)
            }
        })
    }
    
    createOrbitRing(radius) {
        const geometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 32)
        const material = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        })
        const ring = new THREE.Mesh(geometry, material)
        ring.rotation.x = -Math.PI / 2
        this.scene.add(ring)
    }
    
    createSaturnRings(distance, planetSize, saturnPlanet) {
       
        const ringSizes = [
            { inner: planetSize * 1.2, outer: planetSize * 1.8, opacity: 0.6 },
            { inner: planetSize * 1.8, outer: planetSize * 2.2, opacity: 0.4 },
            { inner: planetSize * 2.2, outer: planetSize * 2.6, opacity: 0.3 }
        ]
        
        ringSizes.forEach((ringData, index) => {
            const geometry = new THREE.RingGeometry(ringData.inner, ringData.outer, 64)
            const material = new THREE.MeshBasicMaterial({
                color: 0xf4e4bc,
                transparent: true,
                opacity: ringData.opacity,
                side: THREE.DoubleSide
            })
            const ring = new THREE.Mesh(geometry, material)
            ring.position.x = distance
            ring.rotation.x = -Math.PI / 2
            ring.rotation.z = Math.random() * 0.1 // Slight tilt
            
            
            ring.userData = {
                parentPlanet: saturnPlanet,
                originalRotationZ: ring.rotation.z
            }
            
            this.saturnRings.push(ring)
            this.scene.add(ring)
        })
    }
    
    createStars() {
        if (!this.params.showStars) return
        
        const starGeometry = new THREE.BufferGeometry()
        const starCount = 1000
        const positions = new Float32Array(starCount * 3)
        
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 200
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        
        const stars = new THREE.Points(starGeometry, this.starMaterial)
        this.stars.push(stars)
        this.scene.add(stars)
    }
    
    create3DText() {
        const loader = new FontLoader()
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry('Sun', {
                font: font,
                size: 1,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })
            
            textGeometry.computeBoundingBox()
            textGeometry.translate(
                -textGeometry.boundingBox.max.x * 0.5,
                -textGeometry.boundingBox.max.y * 0.5,
                -textGeometry.boundingBox.max.z * 0.5
            )
            
            const textMaterial = new THREE.MeshLambertMaterial({ color: 0x4CAF50 })
            this.text3D = new THREE.Mesh(textGeometry, textMaterial)
            this.text3D.position.set(0, 8, 0)
            this.scene.add(this.text3D)
        })
    }
    
    createPlanetLabel(planet, planetName) {
        if (!this.params.showPlanetLabels) return
        
        const loader = new FontLoader()
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeometry = new TextGeometry(planetName, {
                font: font,
                size: 0.3,
                height: 0.05,
                curveSegments: 8,
                bevelEnabled: false
            })
            
            textGeometry.computeBoundingBox()
            textGeometry.translate(
                -textGeometry.boundingBox.max.x * 0.5,
                -textGeometry.boundingBox.max.y * 0.5,
                -textGeometry.boundingBox.max.z * 0.5
            )
            
            const textMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            })
            const label = new THREE.Mesh(textGeometry, textMaterial)
            
            // Position label above the planet
            label.position.x = planet.position.x
            label.position.y = planet.position.y + planet.geometry.parameters.radius + 1
            label.position.z = planet.position.z
            
            // Store reference to parent planet
            label.userData = {
                parentPlanet: planet,
                planetName: planetName
            }
            
            this.planetLabels.push(label)
            this.scene.add(label)
        })
    }
    
    createAxes() {
        if (this.params.showAxes) {
            const axesHelper = new THREE.AxesHelper(10)
            this.scene.add(axesHelper)
        }
    }
    
    createGUI() {
        this.gui = new GUI()
        
        // Scene controls
        const sceneFolder = this.gui.addFolder('Scene')
        sceneFolder.addColor(this.params, 'background').onChange(value => {
            this.scene.background = new THREE.Color(value)
        })
        sceneFolder.add(this.params, 'showOrbits').onChange(value => {
            this.toggleOrbits(value)
        })
        sceneFolder.add(this.params, 'showStars').onChange(value => {
            this.toggleStars(value)
        })
        sceneFolder.add(this.params, 'showAxes').onChange(value => {
            this.toggleAxes(value)
        })
        sceneFolder.add(this.params, 'planetScale', 0.1, 3).onChange(value => {
            this.updatePlanetSizes()
        })
        sceneFolder.add(this.params, 'showSaturnRings').onChange(value => {
            this.toggleSaturnRings(value)
        })
        sceneFolder.add(this.params, 'showPlanetLabels').onChange(value => {
            this.togglePlanetLabels(value)
        })
        
        // Sun controls
        const sunFolder = this.gui.addFolder('Sun')
        sunFolder.add(this.params, 'sunScale', 0.5, 3).onChange(value => {
            this.sun.scale.setScalar(value)
            // Update glow effects
            if (this.sunGlow) this.sunGlow.scale.setScalar(value * 1.2)
            if (this.sunCorona) this.sunCorona.scale.setScalar(value * 1.5)
            if (this.sunOuterCorona) this.sunOuterCorona.scale.setScalar(value * 2)
        })
        sunFolder.add(this.params, 'sunGlowIntensity', 0, 1).onChange(value => {
            if (this.sunGlow) this.sunGlow.material.opacity = value * 0.3
            if (this.sunCorona) this.sunCorona.material.opacity = value * 0.1
            if (this.sunOuterCorona) this.sunOuterCorona.material.opacity = value * 0.05
        })
        sunFolder.add(this.params, 'showSunEffects').onChange(value => {
            this.toggleSunEffects(value)
        })
        
        // Animation controls
        const animationFolder = this.gui.addFolder('Animation')
        animationFolder.add(this.params, 'animationSpeed', 0, 3)
        animationFolder.add(this, 'isAnimating').name('Play/Pause')
        animationFolder.add(this.params, 'cameraAutoRotate')
        animationFolder.add(this.params, 'cameraAutoRotateSpeed', 0, 5).onChange(value => {
            this.controls.autoRotateSpeed = value
        })
        
        // Camera controls
        const cameraFolder = this.gui.addFolder('Camera')
        cameraFolder.add(this.params, 'cinematicMode').onChange(value => {
            this.toggleCinematicMode()
        })
        cameraFolder.add(this.camera.position, 'x', -50, 50)
        cameraFolder.add(this.camera.position, 'y', -50, 50)
        cameraFolder.add(this.camera.position, 'z', -50, 50)
        cameraFolder.add(this, 'resetCamera').name('Reset Camera')
        
        
        this.gui.open()
    }
    
    toggleOrbits(show) {
        const rings = this.scene.children.filter(child => 
            child.geometry && child.geometry.type === 'RingGeometry'
        )
        rings.forEach(ring => ring.visible = show)
    }
    
    toggleStars(show) {
        this.stars.forEach(star => star.visible = show)
    }
    
   
    
    toggleAtmosphere(show) {
        if (this.atmosphere) {
            this.atmosphere.visible = show
        }
    }
    
    resetCamera() {
        this.camera.position.set(0, 10, 30)
        this.controls.reset()
    }
    
    resetEarthRotation() {
        this.earth.rotation.set(0, 0, 0)
    }
    
    updateEarthMaterial() {
        // Recreate Earth material with current parameters
        this.earthMaterial.dispose()
        this.createEarthMaterial()
        this.earth.material = this.earthMaterial
    }
    
    
    
    
    updatePlanetSizes() {
        this.planets.forEach(planet => {
            const newSize = planet.userData.originalSize * this.params.planetScale
            planet.geometry.dispose()
            planet.geometry = new THREE.SphereGeometry(newSize, 32, 32)
        })
    }
    
    toggleSaturnRings(show) {
        // Toggle Saturn's rings using the stored references
        this.saturnRings.forEach(ring => {
            ring.visible = show
        })
    }
    
    toggleMoon(show) {
        if (this.moon) {
            this.moon.visible = show
        }
    }
    
    togglePlanetLabels(show) {
        this.planetLabels.forEach(label => {
            label.visible = show
        })
    }
    
    toggleSunEffects(show) {
        if (this.sunGlow) this.sunGlow.visible = show
        if (this.sunCorona) this.sunCorona.visible = show
        if (this.sunOuterCorona) this.sunOuterCorona.visible = show
    }
    
    toggleCinematicMode() {
        if (this.params.cinematicMode) {
            // Start cinematic camera movement
            this.startCinematicMode()
        } else {
            // Stop cinematic mode
            this.stopCinematicMode()
        }
    }
    
    startCinematicMode() {
        this.cinematicMode = true
        console.log('Cinematic mode started')
    }
    
    stopCinematicMode() {
        this.cinematicMode = false
        console.log('Cinematic mode stopped')
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
        
        // Keyboard controls
        window.addEventListener('keydown', (event) => {
            switch(event.code) {
                case 'Space':
                    event.preventDefault()
                    this.isAnimating = !this.isAnimating
                    break
                case 'KeyR':
                    this.resetCamera()
                    break
            }
        })
        
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate())
        
        if (this.isAnimating) {
            const elapsedTime = this.clock.getElapsedTime() * this.params.animationSpeed
            
            // Animate Sun effects
            if (this.sun) {
                this.sun.rotation.y += this.params.sunRotationSpeed * this.params.animationSpeed
            }
            
            // Animate sun glow effects
            if (this.sunGlow) {
                this.sunGlow.rotation.y += 0.002 * this.params.animationSpeed
            }
            
            if (this.sunCorona) {
                this.sunCorona.rotation.y += 0.001 * this.params.animationSpeed
            }
            
            if (this.sunOuterCorona) {
                this.sunOuterCorona.rotation.y += 0.0005 * this.params.animationSpeed
            }
            
            
            // Rotate Earth
            if (this.earth) {
                this.earth.rotation.y += this.params.earthRotationSpeed * this.params.animationSpeed
            }
            
            // Animate Moon around Earth
            if (this.moon && this.params.showMoon) {
                const moonData = this.moon.userData
                moonData.angle += moonData.speed * this.params.animationSpeed
                
                // Find Earth's position
                const earthPlanet = this.planets.find(planet => planet.userData.name === 'Earth')
                if (earthPlanet) {
                    // Moon orbits around Earth's position
                    this.moon.position.x = earthPlanet.position.x + Math.cos(moonData.angle) * moonData.distance
                    this.moon.position.z = earthPlanet.position.z + Math.sin(moonData.angle) * moonData.distance
                    this.moon.position.y = earthPlanet.position.y // Keep moon at same height as Earth
                }
            }
            
            // Animate planets
            this.planets.forEach(planet => {
                const data = planet.userData
                data.angle += data.speed * this.params.animationSpeed
                
                planet.position.x = Math.cos(data.angle) * data.distance
                planet.position.z = Math.sin(data.angle) * data.distance
                planet.rotation.y = elapsedTime * 0.5
            })
            
            // Animate Saturn's rings to follow the planet
            this.saturnRings.forEach(ring => {
                const parentPlanet = ring.userData.parentPlanet
                if (parentPlanet) {
                    // Update ring position to match planet
                    ring.position.x = parentPlanet.position.x
                    ring.position.z = parentPlanet.position.z
                    // Rotate rings with the planet
                    ring.rotation.y = parentPlanet.rotation.y
                }
            })
            
            // Update planet labels to follow their planets
            this.planetLabels.forEach(label => {
                const parentPlanet = label.userData.parentPlanet
                if (parentPlanet) {
                    // Update label position to match planet
                    label.position.x = parentPlanet.position.x
                    label.position.z = parentPlanet.position.z
                    // Keep label above the planet
                    label.position.y = parentPlanet.position.y + parentPlanet.geometry.parameters.radius + 1
                }
            })
            
            // Animate 3D text
            if (this.text3D) {
                this.text3D.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1
            }
            
            // Animate stars
            this.stars.forEach(star => {
                star.rotation.y = elapsedTime * 0.001
            })
        }
        
        // Cinematic mode
        if (this.cinematicMode) {
            this.cinematicAngle += 0.005 * this.params.animationSpeed
            this.camera.position.x = Math.cos(this.cinematicAngle) * 20
            this.camera.position.z = Math.sin(this.cinematicAngle) * 20
            this.camera.lookAt(0, 5, 0)
        }
        
        this.controls.update()
        this.renderer.render(this.scene, this.camera)
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
        if (this.gui) {
            this.gui.destroy()
        }
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('keydown', this.handleKeydown)
    }
}

// Initialize the application
const app = new SolarSystemApp()

// Handle page unload
window.addEventListener('beforeunload', () => {
    app.destroy()
})

// Electron-specific features
if (window.electronAPI) {
    console.log('Running in Electron environment')
    
    // Add Electron-specific UI enhancements
    document.addEventListener('DOMContentLoaded', () => {
        // Add Electron-specific styling
        document.body.classList.add('electron-app')
        
        // Add platform-specific styling
        if (window.electronAPI.platform) {
            document.body.classList.add(`platform-${window.electronAPI.platform}`)
        }
    })
    
    // Handle external links in Electron
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="http"]')
        if (link) {
            event.preventDefault()
            window.electronAPI.openExternal(link.href)
        }
    })
}
