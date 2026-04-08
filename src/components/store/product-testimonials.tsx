import React from 'react'

interface Testimonial {
  name: string
  text: string
}

const testimonialsData: Record<string, Testimonial[]> = {
  'kit-massagem-ems': [
    { name: 'Maa F.', text: 'Eu amei, é relaxante e bem útil! Chegou antes do prazo, bem embalado. Recomendo de olhos fechados!' },
    { name: 'Samela S.', text: 'Estou muito satisfeita! Produto pequeno mas super potente. Pode comprar à vontade pois funciona muito!' },
    { name: 'Juliana M.', text: 'Custo benefício muito bom — tão bom que é a segunda vez que compro! Esse foi para presentear meu tio que amou.' },
    { name: 'Claudia L.', text: 'Maravilhoso! Ajuda até na recuperação de trauma ortopédico. Benefício para circulação sanguínea maravilhoso.' }
  ],
  'mini-robo-aspirador-inteligente': [
    { name: 'Mayara M.', text: 'Limpa muito bem, pegou os pelos da minha gata — meu objetivo foi muito bem feito! Bateria durou 1h limpando.' },
    { name: 'Claudia B.', text: 'Chegou super rápido, bem antes do prazo. Limpa de verdade — para o dia a dia é sensacional. Comprem sem medo!' },
    { name: 'Josiane L.', text: 'Chegou bem embalado, antes do prazo. Excelente para minha necessidade, limpou bem embaixo da cama.' },
    { name: 'Diego S.', text: 'Funciona muito bem, chegou antes do prazo. Amei, recomendo!' }
  ],
  'camera-lampada-360-wi-fi': [
    { name: 'znhlb1', text: 'Fácil instalação e configuração! Ótima imagem, funciona bem à noite mesmo sem iluminação. Recomendo!' },
    { name: 'Dan F.', text: 'Produto excelente com ótimo preço, veio muito bem embalado, tudo em conformidade ao descrito.' },
    { name: 'Squirino', text: 'Excelente custo benefício. Segunda vez que compro. Fácil de instalar, filmagem e som muito claro.' },
    { name: 'adro1000', text: 'Segunda compra que faço e não me decepcionei! Produto chegou muito bem embalado e incrivelmente rápido. Conquistou um cliente fiel!' }
  ],
  'chaveiro-rastreador-gps-bluetooth': [
    { name: 'Jessiquinha', text: 'Chegou rápido, funciona bem! Mostra o local certinho no mapa e faz barulho.' },
    { name: 'Thalexandre', text: 'Adorei como chaveiro — como perco muito minha chave, me facilita agora!' },
    { name: 'Ripperteck', text: 'Produto cumpre com o que promete! Recomendo a todos!' },
    { name: 'C*****8', text: 'Entrega dentro do prazo e instalação no Android foi rápida.' }
  ],
  'caneta-depiladora-eletrica-recarregavel': [
    { name: 'Eliete U.', text: 'Já comprei 3. Ótima, satisfeita. Entrega rápida!' },
    { name: 'Prijjanaina', text: 'Realmente retira os pelos, não senti nenhuma dor. Pode comprar tranquilo, recomendo!' },
    { name: 'Ellen C.', text: 'Depila mesmo, buço e sobrancelha maravilhosamente bem. Não dói absolutamente nada! Amei!' },
    { name: 'jfmxdfbwlm', text: 'Bem prática, limpa até pelos pequenos da sobrancelha. Chegou extremamente rápido!' }
  ],
  'escova-a-vapor-para-pets-3-em-1': [
    { name: 's*****2', text: 'Produto muito bom, tira pelinhos certinho, minha gata adorou! Entrega nota dez, cumpriu o que promete!' },
    { name: 'z*****4', text: 'Funciona perfeitamente, as cerdas são macias. Minha cachorrinha ficou relaxada com o vaporzinho. Remove bastante os pelos mortos!' },
    { name: 'a*****2', text: 'O produto é muito bom, compraria de novo, a qualidade está magnífica!' },
    { name: 'e*****a', text: 'Chegou dentro do prazo, a escova é muito boa mesmo para gatos de pelo curto!' }
  ],
  'modelador-termico-de-cilios-eletrico': [
    { name: 'tatymendess', text: 'Gostei muito da qualidade, esquenta em três temperaturas e pelo preço é bem potente!' },
    { name: 'k*****a', text: 'Lindo e realmente funciona. Esquenta bastante. 3 temperaturas. Ótimo custo-benefício!' },
    { name: 'awf5cir97t', text: 'Gostei muito do efeito. Funciona direitinho e por isso recomendo!' },
    { name: 'josysilva2025', text: 'Chegou antes do prazo, bem embalado e funcionando perfeitamente!' }
  ],
  'lixa-de-pe-eletrica-recarregavel': [
    { name: 'c*****a', text: 'Já é o segundo que comprei, muito bom mesmo, deixa o pé tudo limpo. EU recomendo!' },
    { name: 'a*****8', text: 'Adorei! Lixa mesmo, dá um acabamento maravilhoso pois não agride tanto como uma lixa manual.' },
    { name: 'vivi.moliveiras', text: 'Chegou super rápido, bem embalado. Não machuca o pé, a lixa faz seu papel com toque mais suave.' },
    { name: 'rodrigovazpantoja', text: 'Ótimo produto, chegou bem antes do prazo, é bem forte. Gostei demais!' }
  ],
  'luminaria-mata-mosquito-uv': [
    { name: 'Karoliny M.', text: 'É uma gracinha de lindo! Chegou super bem embalado e rápido, super recomendo!' },
    { name: 'Fabiana F.', text: 'O aparelho funciona direitinho, pega os pernilongos! Gostei muito, recomendo a loja 🥰' },
    { name: 'Loyde P.', text: 'Recebi meu produto, está funcionando perfeitamente, veio muito bem embalado. Parabéns!' },
    { name: 'Marise M.', text: 'Muito linda, está ligando perfeitamente e chegou antes do prazo!' }
  ],
  'barbeador-eletrico-3-em-1': [
    { name: 't*****s', text: 'Melhor que navalha! Ótima opção para quem tem alergia a lâminas. Sabendo usar corretamente, tira bastante pelo.' },
    { name: 'asilva1979', text: 'Máquina muito boa e de corte eficiente. Chegou muito rápido e bem embalado. Recomendo!' },
    { name: 'larafernandes828', text: 'Gostei bastante do produto, chegou em 2 dias, já vem carregada e parece ser de boa qualidade!' },
    { name: 'x*****4', text: 'Máquina perfeita, custo benefício excelente, envio rápido e bem embalada!' }
  ],
  'mini-camera-wi-fi-a9': [
    { name: 'diloziebell', text: 'Tudo certinho. Veio muito rápido e bem embalado. Podem comprar, tudo conforme o anunciado!' },
    { name: 'sbs.cost', text: 'O produto correspondeu às minhas expectativas — discreto e fácil de manuseio.' },
    { name: 'miketysonantonio', text: 'Ótima qualidade, funcionamento muito bom, instalação fácil e prática!' },
    { name: 'l*****s', text: 'Bem embalado, funcionamento muito bom e fácil instalação!' }
  ],
  'fone-bluetooth-m10-com-power-bank-integrado': [
    { name: 'mendesclaudia', text: 'Som alto, material muito bom, preço maravilhoso. Uma compra que me deixou muito feliz, recomendo muito!' },
    { name: 'e*****a', text: 'Chegou rápido, qualidade ótima, não demora pra carregar e a bateria dura bastante!' },
    { name: 'hcqryaokh6', text: 'Chegou antes do prazo, bem embalado. A qualidade do som é ótima com bom cancelamento de ruído. Recomendo!' },
    { name: 'fernandogundel', text: 'Produto chegou 1 dia antes do prazo, testei e está funcionando muito bem. Vale a pena pelo custo benefício!' }
  ]
}

export default function ProductTestimonials({ slug }: { slug: string }) {
  const testimonials = testimonialsData[slug] || []

  if (testimonials.length === 0) return null

  return (
    <section className="bg-gray-50 py-16 md:py-24 mt-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-viva-text font-display">
          O que nossos clientes dizem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-sm">⭐</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 flex-grow italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <div className="w-8 h-8 rounded-full bg-viva-primary/10 flex items-center justify-center text-viva-primary font-bold text-xs uppercase">
                  {t.name.charAt(0)}
                </div>
                <span className="font-bold text-viva-text text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
