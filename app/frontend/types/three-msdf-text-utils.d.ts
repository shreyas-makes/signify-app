declare module 'three-msdf-text-utils' {
  export class MSDFTextGeometry {
    constructor(options: { text: string; font: unknown })
  }

  export const uniforms: {
    common: Record<string, unknown>
    rendering: Record<string, unknown>
    strokes: Record<string, unknown>
  }
}
