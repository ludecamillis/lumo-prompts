'use client'
import { useUser, SignIn } from '@clerk/nextjs'

const LIGHTING_CATEGORIES = [
  {
    name: 'Luz Natural',
    items: [
      { name: 'Golden Hour', prompt: 'golden hour lighting', desc: 'Luz dourada do pôr do sol' },
      { name: 'Sunrise Light', prompt: 'soft sunrise lighting', desc: 'Luz do amanhecer' },
      { name: 'Sunset Light', prompt: 'warm sunset lighting', desc: 'Luz de entardecer' },
      { name: 'Midday Sun', prompt: 'harsh midday sunlight', desc: 'Sol do meio-dia' },
      { name: 'Overcast Light', prompt: 'soft overcast lighting', desc: 'Céu nublado' },
      { name: 'Window Light', prompt: 'soft window light', desc: 'Luz de janela' },
      { name: 'Backlit Sunlight', prompt: 'backlit sunlight', desc: 'Sol atrás do personagem' },
      { name: 'Diffuse Daylight', prompt: 'diffuse daylight', desc: 'Luz difusa do dia' },
    ]
  },
  {
    name: 'Luz Cinematográfica',
    items: [
      { name: 'Cinematic', prompt: 'cinematic lighting', desc: 'Iluminação cinematográfica' },
      { name: 'Dramatic', prompt: 'dramatic lighting', desc: 'Iluminação dramática' },
      { name: 'Volumetric', prompt: 'volumetric lighting', desc: 'Luz volumétrica' },
      { name: 'Rim Light', prompt: 'rim lighting', desc: 'Luz de contorno' },
      { name: 'Backlight', prompt: 'strong backlight', desc: 'Contraluz' },
      { name: 'Side Lighting', prompt: 'side lighting', desc: 'Luz lateral' },
      { name: 'Top Lighting', prompt: 'top lighting', desc: 'Luz de cima' },
      { name: 'Underlighting', prompt: 'underlighting', desc: 'Luz de baixo' },
      { name: 'Silhouette', prompt: 'silhouette lighting', desc: 'Luz de silhueta' },
    ]
  },
  {
    name: 'Luz de Estúdio',
    items: [
      { name: 'Soft Studio', prompt: 'soft studio lighting', desc: 'Luz de estúdio suave' },
      { name: 'High Key', prompt: 'high key lighting', desc: 'Iluminação clara' },
      { name: 'Low Key', prompt: 'low key lighting', desc: 'Iluminação escura' },
      { name: 'Rembrandt', prompt: 'Rembrandt lighting', desc: 'Iluminação clássica de retrato' },
      { name: 'Butterfly', prompt: 'butterfly lighting', desc: 'Iluminação de moda' },
      { name: 'Split', prompt: 'split lighting', desc: 'Metade do rosto iluminado' },
      { name: 'Loop', prompt: 'loop lighting', desc: 'Iluminação lateral suave' },
      { name: 'Clamshell', prompt: 'clamshell lighting', desc: 'Iluminação de beleza' },
    ]
  },
  {
    name: 'Luz Urbana / Noturna',
    items: [
      { name: 'Neon', prompt: 'neon lighting', desc: 'Luz de neon' },
      { name: 'City Night', prompt: 'city night lighting', desc: 'Iluminação urbana noturna' },
      { name: 'Street Lamp', prompt: 'street lamp lighting', desc: 'Luz de poste' },
      { name: 'Headlight', prompt: 'car headlight lighting', desc: 'Luz de farol' },
      { name: 'Cyberpunk', prompt: 'cyberpunk neon lighting', desc: 'Iluminação cyberpunk' },
    ]
  },
  {
    name: 'Luz Ambiente',
    items: [
      { name: 'Candle', prompt: 'warm candlelight illumination', desc: 'Luz de vela' },
      { name: 'Fire', prompt: 'firelight illumination', desc: 'Luz de fogo' },
      { name: 'Lantern', prompt: 'lantern light', desc: 'Luz de lanterna' },
      { name: 'Campfire', prompt: 'campfire lighting', desc: 'Luz de fogueira' },
      { name: 'Torch', prompt: 'torch lighting', desc: 'Luz de tocha' },
    ]
  },
  {
    name: 'Atmosfera Cinematográfica',
    items: [
      { name: 'God Rays', prompt: 'god rays lighting', desc: 'Raios de luz' },
      { name: 'Hazy', prompt: 'hazy lighting', desc: 'Luz difusa com névoa' },
      { name: 'Fog', prompt: 'foggy atmospheric lighting', desc: 'Luz com neblina' },
      { name: 'Dust', prompt: 'dust particles in light', desc: 'Partículas de poeira' },
      { name: 'Mist', prompt: 'misty lighting', desc: 'Névoa fina' },
      { name: 'Smoke', prompt: 'smoke volumetric lighting', desc: 'Luz atravessando fumaça' },
    ]
  },
]

const TEMPLATES = {
  pro: {
    name: 'PRO',
    desc: '4 blocos completos. Para qualquer cena com personagem.',
    generate: (data) => `[Character & Action] Consistent character: ${data.character} performing the action: ${data.action} in the setting: ${data.scene}

[Cinematography] Award-winning level cinematography. Rigorous composition (rule of thirds / golden ratio). Fast cinema lens aesthetic (f/1.8), shallow depth of field, pronounced bokeh and subtle optical chromatic aberration.

[Lighting] Realistic and atmospheric lighting: ${data.lighting}. Light positioned at a dramatic angle creating volume and natural contrast.

[Micro-Details] Extreme surface textures: skin pores, natural micro-imperfections, worn fabrics, metallic corrosion and realistic specular highlights.`
  },
  ultra: {
    name: 'ULTRA',
    desc: 'Versão 8K avançada. Melhor no Midjourney v6+ e Flux Pro.',
    generate: (data) => `[Character & Action] Consistent character: ${data.character} performing: ${data.action} in: ${data.scene}. Identical setting across all frames.

[Cinematography] Award-winning DP. Rule of thirds composition. Cinema prime lens 85mm at f/1.8. Shallow DOF, organic bokeh, subtle chromatic aberration at frame edges.

[Lighting] Atmospheric: ${data.lighting}. Single dominant light source, dramatic shadow angle, natural fill bounce.

[Micro-Details] Hyper-real textures: skin pores, micro-imperfections, fabric weave, material wear, physically accurate specular highlights.

[Output] 8K resolution, RAW photo aesthetic, zero post-processing look, photojournalism standard.`
  },
  retrato: {
    name: 'RETRATO',
    desc: 'Close-up de rosto. 85mm f/1.4 com bokeh extremo.',
    generate: (data) => `[Character] ${data.character}, close-up portrait, direct eye contact.

[Cinematography] 85mm f/1.4, extreme bokeh, golden ratio framing.

[Lighting] ${data.lighting}, Rembrandt shadow, catchlight in eyes.

[Details] Skin pores, eyelash detail, lip texture, hair strands.`
  },
  produto: {
    name: 'PRODUTO',
    desc: 'Fotografia de produto com iluminação de estúdio.',
    generate: (data) => `[Product] ${data.character} on ${data.scene}.

[Cinematography] 50mm f/2.8, tabletop macro, centered composition.

[Lighting] Studio softbox, ${data.lighting}, product highlight.

[Details] Material texture, label detail, surface reflections.`
  },
  paisagem: {
    name: 'PAISAGEM',
    desc: 'Cenas sem personagens. Grande angular atmosférico.',
    generate: (data) => `[Scene] ${data.scene}, no people, epic scale.

[Cinematography] 24mm f/8, wide angle, landscape rule of thirds.

[Lighting] ${data.lighting}, volumetric light rays, atmospheric haze.

[Details] Terrain texture, foliage micro-detail, water caustics.`
  },
}

const ACTION_SUGGESTIONS = [
  'walking slowly looking at shop windows',
  'standing still looking at the horizon',
  'sitting reading a book',
  'running through the rain',
  'looking directly at the camera',
  'turning away from the camera',
]

const styles = {
  page: { minHeight: '100vh', background: '#070707', color: '#e8e0d0', fontFamily: 'Georgia, serif' },
  header: { borderBottom: '1px solid #2a2a2a', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { display: 'flex', flexDirection: 'column' },
  brand: { fontSize: '10px', letterSpacing: '3px', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '2px' },
  title: { fontSize: '14px', letterSpacing: '2px', color: '#e8e0d0', textTransform: 'uppercase' },
  progressBar: { display: 'flex', borderBottom: '1px solid #1a1a1a' },
  progressStep: (active, done) => ({
    flex: 1, padding: '14px 0', textAlign: 'center', fontSize: '9px',
    letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
    color: active ? '#c9a96e' : done ? '#666' : '#333',
    borderBottom: active ? '2px solid #c9a96e' : '2px solid transparent',
    transition: 'all 0.3s'
  }),
  main: { maxWidth: '900px', margin: '0 auto', padding: '60px 40px' },
  stepLabel: { fontSize: '10px', letterSpacing: '3px', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '12px' },
  stepTitle: { fontSize: '36px', fontWeight: 'normal', marginBottom: '12px', color: '#f0ebe0' },
  stepDesc: { fontSize: '14px', color: '#666', marginBottom: '40px', lineHeight: '1.6' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' },
  card: (selected) => ({
    border: selected ? '1px solid #c9a96e' : '1px solid #2a2a2a',
    background: selected ? 'rgba(201,169,110,0.05)' : '#0d0d0d',
    padding: '22px 24px', cursor: 'pointer',
    transition: 'all 0.2s'
  }),
  cardName: (selected) => ({ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: selected ? '#c9a96e' : '#e8e0d0', marginBottom: '6px' }),
  cardDesc: { fontSize: '12px', color: '#555', lineHeight: '1.5' },
  textarea: {
    width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a',
    color: '#e8e0d0', padding: '18px', fontSize: '14px', fontFamily: 'Georgia, serif',
    resize: 'vertical', minHeight: '80px', outline: 'none', boxSizing: 'border-box',
    lineHeight: '1.6'
  },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' },
  suggestion: { background: '#111', border: '1px solid #2a2a2a', color: '#666', padding: '6px 14px', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '60px', paddingTop: '30px', borderTop: '1px solid #1a1a1a' },
  btnBack: { background: 'transparent', border: '1px solid #2a2a2a', color: '#555', padding: '14px 28px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' },
  btnNext: { background: '#c9a96e', border: 'none', color: '#070707', padding: '14px 36px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 'bold' },
  resultBox: { background: '#0a0a0a', border: '1px solid #2a2a2a', padding: '32px', marginBottom: '24px', whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '2', color: '#ccc', fontFamily: 'monospace' },
  copyBtn: { background: '#c9a96e', border: 'none', color: '#070707', padding: '14px 36px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 'bold' },
  lightingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' },
  lightingItem: (selected) => ({
    border: selected ? '1px solid #c9a96e' : '1px solid #1a1a1a',
    background: selected ? 'rgba(201,169,110,0.05)' : '#090909',
    padding: '12px 14px', cursor: 'pointer', transition: 'all 0.2s'
  }),
  catTitle: { fontSize: '9px', letterSpacing: '3px', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '10px', marginTop: '24px' },
  loginWrap: { minHeight: '100vh', background: '#070707', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px' },
  loginTitle: { fontSize: '11px', letterSpacing: '4px', color: '#c9a96e', textTransform: 'uppercase' },
}

const STEPS = ['Template', 'Personagem', 'Ação', 'Cenário', 'Iluminação', 'Resultado']

export default function PromptBuilder() {
  const { isLoaded, isSignedIn } = useUser()

  const [step, setStep] = React.useState(0)
  const [template, setTemplate] = React.useState('pro')
  const [character, setCharacter] = React.useState('')
  const [action, setAction] = React.useState('')
  const [scene, setScene] = React.useState('')
  const [lighting, setLighting] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  if (!isLoaded) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginTitle}>Carregando...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginTitle}>Lumo Estúdio · Gerador de Prompts</div>
        <SignIn routing="hash" />
      </div>
    )
  }

  const generated = TEMPLATES[template].generate({ character, action, scene, lighting })

  const copy = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.brand}>Lumo Estúdio</span>
          <span style={styles.title}>Gerador de Prompts Cinematográficos</span>
        </div>
      </header>

      <div style={styles.progressBar}>
        {STEPS.map((s, i) => (
          <div key={s} style={styles.progressStep(i === step, i < step)} onClick={() => i < step && setStep(i)}>
            <span style={{ marginRight: '6px', opacity: 0.5 }}>0{i + 1}</span>{s}
          </div>
        ))}
      </div>

      <main style={styles.main}>

        {step === 0 && (
          <>
            <div style={styles.stepLabel}>Passo 01</div>
            <h1 style={styles.stepTitle}>Escolha o Template</h1>
            <p style={styles.stepDesc}>Cada template é otimizado para um tipo de imagem. Selecione o que melhor se encaixa na sua visão.</p>
            <div style={styles.grid}>
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <div key={key} style={styles.card(template === key)} onClick={() => setTemplate(key)}>
                  <div style={styles.cardName(template === key)}>{t.name}</div>
                  <div style={styles.cardDesc}>{t.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div style={styles.stepLabel}>Passo 02</div>
            <h1 style={styles.stepTitle}>{template === 'produto' ? 'Descreva o Produto' : 'Descreva o Personagem'}</h1>
            <p style={styles.stepDesc}>{template === 'produto' ? 'Nome do produto + material + cor + detalhes visuais' : 'Gênero · idade · roupa · traço marcante'}</p>
            <textarea
              style={styles.textarea}
              value={character}
              onChange={e => setCharacter(e.target.value)}
              placeholder={template === 'produto' ? 'ex: luxury perfume bottle, dark glass, gold cap, minimal label' : 'ex: young woman, round glasses, yellow linen blouse, curly red hair'}
              rows={3}
            />
          </>
        )}

        {step === 2 && (
          <>
            <div style={styles.stepLabel}>Passo 03</div>
            <h1 style={styles.stepTitle}>Descreva a Ação</h1>
            <p style={styles.stepDesc}>Verbo + intensidade + direção do movimento</p>
            <textarea
              style={styles.textarea}
              value={action}
              onChange={e => setAction(e.target.value)}
              placeholder="ex: walking slowly looking at shop windows"
              rows={3}
            />
            <div style={styles.suggestions}>
              {ACTION_SUGGESTIONS.map(s => (
                <div key={s} style={styles.suggestion} onClick={() => setAction(s)}>{s}</div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={styles.stepLabel}>Passo 04</div>
            <h1 style={styles.stepTitle}>{template === 'produto' ? 'Descreva a Superfície' : 'Descreva o Cenário'}</h1>
            <p style={styles.stepDesc}>{template === 'produto' ? 'Superfície + textura + contexto visual' : 'Ambiente + época + detalhes de fundo'}</p>
            <textarea
              style={styles.textarea}
              value={scene}
              onChange={e => setScene(e.target.value)}
              placeholder={template === 'produto' ? 'ex: dark marble surface, dramatic shadows, luxury editorial' : 'ex: old European cobblestone street, flowers on windowsills, warm afternoon'}
              rows={3}
            />
          </>
        )}

        {step === 4 && (
          <>
            <div style={styles.stepLabel}>Passo 05</div>
            <h1 style={styles.stepTitle}>Escolha a Iluminação</h1>
            <p style={styles.stepDesc}>Selecione o tipo de luz que define a atmosfera da cena</p>
            {LIGHTING_CATEGORIES.map(cat => (
              <div key={cat.name}>
                <div style={styles.catTitle}>{cat.name}</div>
                <div style={styles.lightingGrid}>
                  {cat.items.map(item => (
                    <div key={item.prompt} style={styles.lightingItem(lighting === item.prompt)} onClick={() => setLighting(item.prompt)}>
                      <div style={{ fontSize: '10px', letterSpacing: '1px', color: lighting === item.prompt ? '#c9a96e' : '#e8e0d0', textTransform: 'uppercase', marginBottom: '3px' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#444' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 5 && (
          <>
            <div style={styles.stepLabel}>Resultado</div>
            <h1 style={styles.stepTitle}>Seu Prompt Cinematográfico</h1>
            <p style={styles.stepDesc}>Copie e cole diretamente no Midjourney, Flux, Leonardo ou qualquer IA de imagem</p>
            <div style={styles.resultBox}>{generated}</div>
            <button style={styles.copyBtn} onClick={copy}>{copied ? '✓ Copiado!' : 'Copiar Prompt →'}</button>
          </>
        )}

        <div style={styles.footer}>
          <button style={styles.btnBack} onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>← Voltar</button>
          {step < 5 && <button style={styles.btnNext} onClick={() => setStep(step + 1)}>Próximo →</button>}
        </div>

      </main>
    </div>
  )
}

// Need React import for hooks
import React from 'react'
