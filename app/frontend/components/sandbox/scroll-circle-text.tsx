import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MSDFTextGeometry, uniforms } from 'three-msdf-text-utils'
import atlasUrl from '@/assets/sandbox/Neuton-Regular.png'
import fontData from '@/assets/sandbox/Neuton-Regular-msdf.json'

const vertexShader = `
  attribute vec2 layoutUv;
  attribute float lineIndex;
  attribute float lineLettersTotal;
  attribute float lineLetterIndex;
  attribute float lineWordsTotal;
  attribute float lineWordIndex;
  attribute float wordIndex;
  attribute float letterIndex;

  varying vec2 vUv;
  varying vec2 vLayoutUv;
  varying vec3 vViewPosition;
  varying vec3 vNormal;

  varying float vLineIndex;
  varying float vLineLettersTotal;
  varying float vLineLetterIndex;
  varying float vLineWordsTotal;
  varying float vLineWordIndex;
  varying float vWordIndex;
  varying float vLetterIndex;

  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uCurve;

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
      oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
      oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
  }

  void main() {
    vUv = uv;
    vLayoutUv = layoutUv;
    vNormal = normal;

    vLineIndex = lineIndex;
    vLineLettersTotal = lineLettersTotal;
    vLineLetterIndex = lineLetterIndex;
    vLineWordsTotal = lineWordsTotal;
    vLineWordIndex = lineWordIndex;
    vWordIndex = wordIndex;
    vLetterIndex = letterIndex;

    vec3 newPosition = position;
    float curve = uCurve + uSpeed * uAmplitude;
    newPosition = rotate(newPosition, vec3(0.0, 0.0, 1.0), curve * position.x);

    vec4 mvPosition = vec4(newPosition, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * mvPosition;

    vViewPosition = -mvPosition.xyz;
  }
`

const fragmentShader = `
  varying vec2 vUv;

  uniform float uOpacity;
  uniform float uThreshold;
  uniform float uAlphaTest;
  uniform vec3 uColor;
  uniform vec3 uColorBlack;
  uniform sampler2D uMap;

  uniform vec3 uStrokeColor;
  uniform float uStrokeOutsetWidth;
  uniform float uStrokeInsetWidth;

  float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
  }

  void main() {
    vec3 s = texture2D(uMap, vUv).rgb;
    float sigDist = median(s.r, s.g, s.b) - 0.5;
    float afwidth = 1.4142135623730951 / 2.0;

    #ifdef IS_SMALL
      float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
    #else
      float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
    #endif

    float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;
    float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

    #ifdef IS_SMALL
      float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
      float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
    #else
      float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
      float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
    #endif

    float border = outset * inset;

    if (alpha < uAlphaTest) discard;

    vec4 filledFragColor = vec4(uColorBlack, uOpacity * alpha);
    vec4 strokedFragColor = vec4(uStrokeColor, uOpacity * border);

    gl_FragColor = filledFragColor;
  }
`

type TextRingOptions = {
  title: string
  index: number
  length: number
  scene: THREE.Group
  circleSpeed: number
  amplitude: number
  curve: number
  atlas: THREE.Texture
}

class TextRing {
  mesh: THREE.Mesh | null = null
  index: number
  length: number
  circleSpeed: number
  amplitude: number
  angleCalc: number
  scale = 0.008

  constructor({ title, index, length, scene, circleSpeed, amplitude, curve, atlas }: TextRingOptions) {
    this.index = index
    this.length = length
    this.circleSpeed = circleSpeed
    this.amplitude = amplitude
    this.angleCalc = ((this.length / 10) * Math.PI) / this.length

    const geometry = new MSDFTextGeometry({
      text: title,
      font: fontData,
    })

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      defines: {
        IS_SMALL: false,
      },
      extensions: {
        derivatives: true,
      },
      uniforms: {
        uColorBlack: { value: new THREE.Vector3(0.133, 0.133, 0.133) },
        uSpeed: { value: 0.0 },
        uAmplitude: { value: this.amplitude },
        uCurve: { value: curve },
        ...uniforms.common,
        ...uniforms.rendering,
        ...uniforms.strokes,
      },
      vertexShader,
      fragmentShader,
    })

    material.uniforms.uMap.value = atlas
    material.uniforms.uStrokeColor.value = new THREE.Vector3(0.133, 0.133, 0.133)
    material.uniforms.uStrokeOutsetWidth.value = 0.0
    material.uniforms.uStrokeInsetWidth.value = 0.0

    this.mesh = new THREE.Mesh(geometry, material)
    scene.add(this.mesh)
    this.updateScale()
    this.updatePosition(0)
  }

  updateScale() {
    if (this.mesh) {
      this.mesh.scale.set(this.scale, -this.scale, this.scale)
    }
  }

  updatePosition(scrollValue = 0) {
    if (!this.mesh) return
    const angle = this.index * this.angleCalc - scrollValue
    this.mesh.position.x = Math.cos(angle)
    this.mesh.position.y = Math.sin(angle)
    this.mesh.rotation.z = (this.index / this.length) * 2 * Math.PI - scrollValue
  }

  update(scrollValue: number, circleSpeed: number, speed: number, amplitude: number) {
    this.circleSpeed = circleSpeed
    this.amplitude = amplitude
    if (!this.mesh) return
    const material = this.mesh.material as THREE.ShaderMaterial
    material.uniforms.uSpeed.value = speed
    material.uniforms.uAmplitude.value = amplitude
    this.updatePosition(scrollValue * this.circleSpeed)
  }
}

const words = ['human', 'only', 'stories', 'ideas']
const phrase = 'human written stories, and ideas'
const pair = ['human only', 'stories and ideas']

type ScrollCircleTextProps = {
  variant?: 'words' | 'phrase' | 'pair'
  curve?: number
}

const lerp = (start: number, end: number, amount: number) => {
  return (1 - amount) * start + amount * end
}

export default function ScrollCircleText({ variant = 'words', curve = 0 }: ScrollCircleTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const textItems = useMemo(() => {
    if (variant === 'phrase') {
      return Array.from({ length: 20 }, () => phrase)
    }
    if (variant === 'pair') {
      return Array.from({ length: 20 }, (_, index) => pair[index % pair.length])
    }
    return Array.from({ length: 20 }, (_, index) => words[index % words.length])
  }, [variant])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const group = new THREE.Group()
    group.position.y = 0.1
    scene.add(group)

    const atlas = new THREE.TextureLoader().load(atlasUrl)
    atlas.generateMipmaps = false
    atlas.minFilter = THREE.LinearFilter
    atlas.magFilter = THREE.LinearFilter

    const circleSpeed = 0.0007
    const amplitude = 0.004

    const texts = textItems.map(
      (title, index) =>
        new TextRing({
          title,
          index,
          length: textItems.length,
          scene: group,
          circleSpeed,
          amplitude,
          curve,
          atlas,
        })
    )

    const scroll = {
      current: 0,
      target: 0,
      lerp: 0.1,
    }
    const speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    }

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      scroll.target += event.deltaY
    }

    let lastTouchY: number | null = null
    const touchMultiplier = 3
    const onTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null
    }

    const onTouchMove = (event: TouchEvent) => {
      if (lastTouchY === null) return
      event.preventDefault()
      const currentY = event.touches[0]?.clientY ?? lastTouchY
      const deltaY = lastTouchY - currentY
      scroll.target += deltaY * touchMultiplier
      lastTouchY = currentY
    }

    const onTouchEnd = () => {
      lastTouchY = null
    }

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      scroll.current = lerp(scroll.current, scroll.target, scroll.lerp)
      speed.target = (scroll.target - scroll.current) * 0.001
      speed.current = lerp(speed.current, speed.target, speed.lerp)

      texts.forEach((text) => text.update(scroll.current, circleSpeed, speed.current, amplitude))
      renderer.render(scene, camera)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      cancelAnimationFrame(frameId)
      texts.forEach((text) => {
        if (text.mesh) {
          text.mesh.geometry.dispose()
          ;(text.mesh.material as THREE.ShaderMaterial).dispose()
        }
      })
      atlas.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [curve, textItems])

  return <div ref={containerRef} className="circle-canvas" aria-hidden="true" />
}
