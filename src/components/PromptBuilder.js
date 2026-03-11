'use client'
import { useState } from 'react'

const gold = '#c9a96e'
const bg = '#070707'
const card = '#0e0e0e'
const border = '#1c1c1c'
const muted = '#555'
const textColor = '#ddd'

const lightingOptions = {
  'Luz Natural': [
    { label: 'Golden Hour', prompt: 'golden hour lighting', desc: 'Luz dourada do pôr do sol' },
    { label: 'Sunrise Light', prompt: 'soft sunrise lighting', desc: 'Luz suave do amanhecer' },
    { label: 'Sunset Light', prompt: 'warm sunset lighting', desc: 'Luz de entardecer' },
    { label: 'Midday Sun', prompt: 'harsh midday sunlight', desc: 'Sol do meio-dia' },
    { label: 'Overcast Light', prompt: 'soft overcast lighting', desc: 'Céu nublado difuso' },
    { label: 'Window Light', prompt: 'soft window light', desc: 'Luz de janela' },
    { label: 'Backlit Sunlight', prompt: 'backlit sunlight', desc: 'Sol atrás do personagem' },
    { label: 'Diffuse Daylight', prompt: 'diffuse daylight', desc: 'Luz difusa do dia' },
  ],
  'Cinematográfica': [
    { label: 'Cinematic', prompt: 'cinematic lighting', desc: 'Iluminação cinematográfica' },
    { label: 'Dramatic', prompt: 'dramatic lighting', desc: 'Iluminação dramática' },
    { label: 'Volumetric', prompt: 'volumetric lighting', desc: 'Raios de luz visíveis' },
    { label: 'Rim Light', prompt: 'rim lighting', desc: 'Luz de contorno' },
    { label: 'Backlight', prompt: 'strong backlight', desc: 'Contraluz' },
    { label: 'Side Lighting', prompt: 'side lighting', desc: 'Luz lateral' },
    { label: 'Silhouette', prompt: 'silhouette lighting', desc: 'Luz de silhueta' },
  ],
  'Estúdio': [
    { label: 'Soft Studio', prompt: 'soft studio lighting', desc: 'Estúdio suave' },
    { label: 'High Key', prompt: 'high key lighting', desc: 'Iluminação clara' },
    { label: 'Low Key', prompt: 'low key lighting', desc: 'Iluminação escura' },
    { label: 'Rembrandt', prompt: 'Rembrandt lighting', desc: 'Retrato clássico' },
    { label: 'Butterfly', prompt: 'butterfly lighting', desc: 'Iluminação de moda' },
    { label: 'Split', prompt: 'split lighting', desc: 'Metade do rosto' },
    { label: 'Clamshell', prompt: 'clamshell lighting', desc: 'Iluminação de beleza' },
  ],
  'Urbana/Noturna': [
    { label: 'Neon', prompt: 'neon lighting', desc: 'Luz de neon' },
    { label: 'City Night', prompt: 'city night lighting', desc: 'Noite urbana' },
    { label: 'Street Lamp', prompt: 'street lamp lighting', desc: 'Luz de poste' },
    { label: 'Headlight', prompt: 'car headlight lighting', desc: 'Luz de farol' },
    { label: 'Cyberpunk', prompt: 'cyberpunk neon lighting', desc: 'Estilo cyberpunk' },
  ],
  'Ambiente': [
    { label: 'Candle', prompt: 'warm candlelight illumination', desc: 'Luz de vela' },
    { label: 'Fire', prompt: 'firelight illumination', desc: 'Luz de fogo' },
    { label: 'Lantern', prompt: 'lantern light', desc: 'Luz de lanterna' },
    { label: 'Campfire', prompt: 'campfire lighting', desc: 'Fogueira' },
    { label: 'Torch', prompt: 'torch lighting', desc: 'Luz de tocha' },
  ],
  'Atmosfera': [
    { label: 'God Rays', prompt: 'god rays lighting', desc: 'Raios divinos' },
    { label: 'Hazy', prompt: 'hazy lighting', desc: 'Névoa difusa' },
    { label: 'Fog', prompt: 'foggy atmospheric lighting', desc: 'Neblina' },
    { label: 'Dust', prompt: 'dust particles in light', desc: 'Poeira na luz' },
    { label: 'Mist', prompt: 'misty lighting', desc: 'Névoa fina' },
    { label: 'Smoke', prompt: 'smoke volumetric lighting', desc: 'Fumaça volumétrica' },
  ],
}

const templates = ['Pro', 'Ultra', 'Retrato', 'Produto', 'Paisagem']
const templateInfo = {
  Pro: '4 blocos completos. Para qualquer cena com personagem.',
  Ultra: 'Versão 8K avançada. Melhor no Midjourney v6+ e Flux Pro.',
  Retrato: 'Close-up de rosto. 85mm f/1.4 com bokeh extremo.',
  Produto: 'Fotografia de produto com iluminação de estúdio.',
  Paisagem: 'Cenas sem personagens. Grande angular atmosférico.',
}

const actionSuggestions = [
  'standing still facing camera',
  'walking slowly looking at windows',
  'sitting reading a book',
  'looking over shoulder',
  'gazing at the horizon',
  'running through rain',
]

const steps = [
  { id: 'template', label: 'Template', num: '01' },
  { id: 'character', label: 'Personagem', num: '02' },
  { id: 'action', label: 'Ação', num: '03' },
  { id: 'scenario', label: 'Cenário', num: '04' },
  { id: 'lighting', label: 'Iluminação', num: '05' },
  { id: 'result', label: 'Resultado', num: '06' },
]

function Label({ children }) {
  return <div style={{ fontSize: 9, letterSpacing: 4, color: gold, marginBottom: 10, textTransform: 'uppercase' }}>{children}</div>
}
function Title({ children }) {
  return <h2 style={{ fontSize: 26, fontWeight: 300, margin: '0 0 10px', letterSpacing: '-0.3px', color: textColor }}>{children}</h2>
}
function Sub({ children }) {
  return <p style={{ color: muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{children}</p>
}
function Tip({ children }) {
  return (
    <div style={{ marginTop: 16, background: '#0a0a0a', border: `1px solid #1a1a1a`, padding: '14px 18px' }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: gold, marginBottom: 6, textTransform: 'uppercase' }}>Dica Pro</div>
      <div style={{ fontSize: 11, color: muted, lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

export default function PromptBuilder() {
  const [step, setStep] = useState(0)
  const [template, setTemplate] = useState('Pro')
  const [character, setCharacter] = useState('')
  const [action, setAction] = useState('')
  const [scenario, setScenario] = useState('')
  const [lighting, setLighting] = useState(null)
  const [lightCat, setLightCat] = useState('Luz Natural')
  const [lens, setLens] = useState('50mm')
  const [copied, setCopied] = useState(false)

  const canNext = () => {
    if (step === 1 && !character.trim()) return false
    if (step === 2 && !action.trim()) return false
    if (step === 3 && !scenario.trim()) return false
    if (step === 4 && !lighting) return false
    return true
  }

  const buildPrompt = () => {
    const lp = lighting?.prompt || 'golden hour lighting'
    const ch = character || 'young woman, round glasses, yellow blouse, curly red hair'
    const ac = action || 'walking slowly looking at shop windows'
    const sc = scenario || 'old European cobblestone street, flowers on windowsills'

    if (template === 'Ultra') return `[Character & Action] Consistent character: ${ch} performing: ${ac} in: ${sc}. Identical setting across all frames.\n\n[Cinematography] Award-winning DP. Rule of thirds composition. Cinema prime lens ${lens} at f/1.8. Shallow DOF, organic bokeh, subtle chromatic aberration at frame edges.\n\n[Lighting] Atmospheric: ${lp}. Single dominant light source, dramatic shadow angle, natural fill bounce.\n\n[Micro-Details] Hyper-real textures: skin pores, micro-imperfections, fabric weave, material wear, physically accurate specular highlights.\n\n[Output] 8K resolution, RAW photo aesthetic, zero post-processing look, photojournalism standard.`
    if (template === 'Retrato') return `[Character] ${ch}, close-up portrait, direct eye contact.\n\n[Cinematography] 85mm f/1.4, extreme bokeh, golden ratio framing.\n\n[Lighting] ${lp}, Rembrandt shadow, catchlight in eyes.\n\n[Details] Skin pores, eyelash detail, lip texture, hair strands.`
    if (template === 'Produto') return `[Product] ${ch} on ${sc}.\n\n[Cinematography] 50mm f/2.8, tabletop macro, centered composition.\n\n[Lighting] Studio softbox, ${lp}, product highlight.\n\n[Details] Material texture, label detail, surface reflections.`
    if (template === 'Paisagem') return `[Scene] ${sc}, no people, epic scale.\n\n[Cinematography] 24mm f/8, wide angle, landscape rule of thirds.\n\n[Lighting] ${lp}, volumetric light rays, atmospheric haze.\n\n[Details] Terrain texture, foliage micro-detail, water caustics.`
    return `[Character & Action] Consistent character: ${ch} performing the action: ${ac} in the setting: ${sc}\n\n[Cinematography] Award-winning level cinematography. Rigorous composition (rule of thirds / golden ratio). Fast cinema lens aesthetic (f/1.8), shallow depth of field, pronounced bokeh and subtle optical chromatic aberration.\n\n[Lighting] Realistic and atmospheric lighting: ${lp}. Light positioned at a dramatic angle creating volume and natural contrast.\n\n[Micro-Details] Extreme surface textures: skin pores, natural micro-imperfections, worn fabrics, metallic corrosion and realistic specular highlights.`
  }

  const copy = () => {
    navigator.clipboard.writeText(buildPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const reset = () => {
    setStep(0); setTemplate('Pro'); setCharacter(''); setAction('')
    setScenario(''); setLighting(null); setLens('50mm'); setCopied(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: "'Georgia', serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '18px 28px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 5, color: gold, textTransform: 'uppercase', marginBottom: 3 }}>LUMO ESTÚDIO</div>
          <div style={{ fontSize: 15, fontWeight: 300, letterSpacing: 1 }}>Gerador de Prompts Cinematográficos</div>
        </div>
        <div style={{ fontSize: 9, color: '#333', letterSpacing: 3 }}>IA · FOTO · VÍDEO</div>
      </div>

      {/* Steps bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
        {steps.map((s, i) => (
          <div key={s.id} onClick={() => i < step && setStep(i)}
            style={{ flex: 1, padding: '10px 4px', textAlign: 'center', cursor: i < step ? 'pointer' : 'default',
              borderBottom: step === i ? `2px solid ${gold}` : '2px solid transparent', transition: 'all 0.3s' }}>
            <div style={{ fontSize: 14, color: i < step ? '#4a8' : step === i ? gold : '#2a2a2a', marginBottom: 2 }}>
              {i < step ? '✓' : s.num}
            </div>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: step === i ? gold : i < step ? '#4a8' : '#2a2a2a' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 780, width: '100%', margin: '0 auto', padding: '36px 24px', boxSizing: 'border-box' }}>

        {/* STEP 0 — Template */}
        {step === 0 && (
          <div>
            <Label>Passo 01</Label>
            <Title>Escolha o Template</Title>
            <Sub>Cada template é otimizado para um tipo de imagem. Selecione o que melhor se encaixa na sua visão.</Sub>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
              {templates.map(t => (
                <div key={t} onClick={() => setTemplate(t)}
                  style={{ padding: '18px 20px', border: `1px solid ${template === t ? gold : border}`,
                    background: template === t ? 'rgba(201,169,110,0.05)' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: template === t ? gold : textColor, marginBottom: 6 }}>{t}</div>
                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>{templateInfo[t]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Character */}
        {step === 1 && (
          <div>
            <Label>Passo 02 · Bloco 1</Label>
            <Title>{template === 'Produto' ? 'Descreva o Produto' : 'Descreva o Personagem'}</Title>
            <Sub>{template === 'Produto' ? 'Nome, material, cor e detalhes visuais marcantes do produto.' : 'Aparência + roupa + traço marcante. Escreva em inglês para melhores resultados.'}</Sub>
            <textarea value={character} onChange={e => setCharacter(e.target.value)}
              placeholder={template === 'Produto' ? 'ex: matte black ceramic coffee mug, minimalist design, gold rim detail' : 'ex: young woman, round glasses, yellow blouse, curly red hair'}
              style={{ width: '100%', minHeight: 90, marginTop: 20, background: card, border: `1px solid ${border}`,
                color: textColor, padding: 16, fontSize: 13, fontFamily: 'monospace', resize: 'vertical',
                outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }} />
            <Tip>Quanto mais específico o personagem, mais consistente ele aparece entre diferentes gerações. Use sempre a mesma descrição base.</Tip>
          </div>
        )}

        {/* STEP 2 — Action */}
        {step === 2 && (
          <div>
            <Label>Passo 03 · Bloco 1</Label>
            <Title>Descreva a Ação</Title>
            <Sub>Use a estrutura: <span style={{ color: gold }}>verbo + intensidade + direção</span>. Pense como um diretor de fotografia.</Sub>
            <textarea value={action} onChange={e => setAction(e.target.value)}
              placeholder="ex: walking slowly looking at shop windows"
              style={{ width: '100%', minHeight: 70, marginTop: 20, background: card, border: `1px solid ${border}`,
                color: textColor, padding: 16, fontSize: 13, fontFamily: 'monospace', resize: 'vertical',
                outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }} />
            <div style={{ fontSize: 10, letterSpacing: 2, color: muted, textTransform: 'uppercase', margin: '18px 0 10px' }}>Ações rápidas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {actionSuggestions.map(s => (
                <div key={s} onClick={() => setAction(s)}
                  style={{ padding: '8px 10px', border: `1px solid ${border}`, cursor: 'pointer',
                    fontSize: 10, color: muted, fontFamily: 'monospace', lineHeight: 1.4,
                    background: 'rgba(255,255,255,0.01)', transition: 'border-color 0.2s' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 — Scenario */}
        {step === 3 && (
          <div>
            <Label>Passo 04 · Bloco 1</Label>
            <Title>Descreva o Cenário</Title>
            <Sub>Estrutura: <span style={{ color: gold }}>ambiente + época + detalhes de fundo</span>. Descreva o que a câmera vê ao redor.</Sub>
            <textarea value={scenario} onChange={e => setScenario(e.target.value)}
              placeholder="ex: old European cobblestone street, flowers on windowsills, warm afternoon light"
              style={{ width: '100%', minHeight: 90, marginTop: 20, background: card, border: `1px solid ${border}`,
                color: textColor, padding: 16, fontSize: 13, fontFamily: 'monospace', resize: 'vertical',
                outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' }} />
            {template === 'Ultra' && (
              <div style={{ marginTop: 22 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: muted, textTransform: 'uppercase', marginBottom: 10 }}>Lente (Template Ultra)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['35mm', '50mm', '85mm', '24mm'].map(l => (
                    <div key={l} onClick={() => setLens(l)}
                      style={{ padding: '8px 18px', border: `1px solid ${lens === l ? gold : border}`,
                        cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
                        color: lens === l ? gold : muted, background: lens === l ? 'rgba(201,169,110,0.05)' : 'transparent' }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#333', marginTop: 6, fontFamily: 'monospace' }}>
                  {lens === '35mm' && '→ visão natural, ambiental'}
                  {lens === '50mm' && '→ equilíbrio universal'}
                  {lens === '85mm' && '→ retrato clássico, bokeh'}
                  {lens === '24mm' && '→ ambiental, arquitetura'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Lighting */}
        {step === 4 && (
          <div>
            <Label>Passo 05 · Bloco 3</Label>
            <Title>Escolha a Iluminação</Title>
            <Sub>A iluminação define toda a atmosfera. 40 tipos organizados em 6 categorias.</Sub>
            <div style={{ display: 'flex', gap: 0, marginTop: 20, overflowX: 'auto', borderBottom: `1px solid ${border}`, marginBottom: 16 }}>
              {Object.keys(lightingOptions).map(cat => (
                <div key={cat} onClick={() => setLightCat(cat)}
                  style={{ padding: '7px 12px', cursor: 'pointer', whiteSpace: 'nowrap',
                    fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                    borderBottom: lightCat === cat ? `2px solid ${gold}` : '2px solid transparent',
                    color: lightCat === cat ? gold : '#3a3a3a', transition: 'all 0.2s' }}>
                  {cat}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {lightingOptions[lightCat].map(opt => (
                <div key={opt.label} onClick={() => setLighting(opt)}
                  style={{ padding: '12px 16px', border: `1px solid ${lighting?.label === opt.label ? gold : border}`,
                    cursor: 'pointer', background: lighting?.label === opt.label ? 'rgba(201,169,110,0.05)' : 'rgba(255,255,255,0.01)',
                    transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 12, color: lighting?.label === opt.label ? gold : '#bbb', marginBottom: 3 }}>{opt.label}</div>
                  <div style={{ fontSize: 10, color: muted, marginBottom: 6 }}>{opt.desc}</div>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#2a2a2a', background: '#111', padding: '3px 7px', display: 'inline-block' }}>`{opt.prompt}`</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5 — Result */}
        {step === 5 && (
          <div>
            <Label>Resultado Final</Label>
            <Title>Seu Prompt Cinematográfico</Title>
            <Sub>Template <span style={{ color: gold }}>{template}</span> · Iluminação: <span style={{ color: gold }}>{lighting?.label}</span></Sub>
            <div style={{ background: card, border: `1px solid ${border}`, padding: 22, marginTop: 22, marginBottom: 14 }}>
              <pre style={{ fontFamily: 'monospace', fontSize: 11, color: '#777', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>
                {buildPrompt().split('\n').map((line, i) => (
                  <span key={i}>
                    {line.startsWith('[') ? <span style={{ color: gold }}>{line}</span> : line}
                    {'\n'}
                  </span>
                ))}
              </pre>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={copy}
                style={{ padding: '12px 28px', background: copied ? '#1a2e1a' : gold,
                  color: copied ? '#5a9a5a' : '#070707', border: 'none', cursor: 'pointer',
                  fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.3s' }}>
                {copied ? '✓ COPIADO!' : 'COPIAR PROMPT'}
              </button>
              <button onClick={reset}
                style={{ padding: '12px 24px', background: 'transparent', color: muted,
                  border: `1px solid ${border}`, cursor: 'pointer',
                  fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' }}>
                NOVO PROMPT
              </button>
            </div>
            <div style={{ marginTop: 22, background: card, border: `1px solid ${border}`, padding: '14px 18px' }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: muted, marginBottom: 10, textTransform: 'uppercase' }}>Funciona em</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Midjourney', 'Flux Pro', 'Leonardo AI', 'Stable Diffusion', 'Kling', 'Runway', 'Veo'].map(ia => (
                  <span key={ia} style={{ fontSize: 9, padding: '3px 9px', border: `1px solid ${border}`, color: '#3a3a3a', letterSpacing: 1 }}>{ia}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 20, borderTop: `1px solid ${border}` }}>
            <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              style={{ padding: '11px 26px', background: 'transparent',
                color: step === 0 ? '#1a1a1a' : muted, border: `1px solid ${step === 0 ? '#111' : border}`,
                cursor: step === 0 ? 'default' : 'pointer', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' }}>
              ← VOLTAR
            </button>
            <button onClick={() => canNext() && setStep(s => Math.min(5, s + 1))}
              style={{ padding: '11px 30px', background: canNext() ? gold : '#111',
                color: canNext() ? '#070707' : '#2a2a2a', border: 'none',
                cursor: canNext() ? 'pointer' : 'default', fontSize: 10, letterSpacing: 3,
                textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.3s' }}>
              {step === 4 ? 'GERAR PROMPT →' : 'PRÓXIMO →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
