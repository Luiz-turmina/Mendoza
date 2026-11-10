# Roteiro Mendoza — Manu & Luiz

Site pessoal com o roteiro da viagem de 1 ano de namoro da Manu e do Luiz a Mendoza (Argentina), de 9 a 14 de janeiro de 2027. Vai ser enviado para a Manu pelo WhatsApp e usado no celular durante a viagem, e no PC durante o planejamento.

## Estado atual

A maior parte está em `index.html` (HTML, CSS e JavaScript juntos, sem build), mais um punhado de arquivos pequenos de apoio:

- `manifest.webmanifest` e `sw.js` — PWA simples: o roteiro em si abre sem sinal (mapa, fotos e previsão do tempo continuam precisando de internet).
- `icons/` — ícone do app (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`), gerado com Pillow a partir da identidade de cor de vinho.
- A foto do casal está embutida como data URI na constante `FOTO_NOS`. Ao migrar, vale extrair para `nos.jpg`.
- Bibliotecas: GSAP 3.12.5, Leaflet 1.9.4 (ambos via cdnjs) e Google Fonts (Cormorant Garamond, Jost, Pinyon Script).
- Estado salvo em `localStorage` (por aparelho): `ml-looks`, `ml-rates`, `ml-res`, `ml-mala-manu`, `ml-mala-luiz`, `ml-theme`, `ml-seen`, `ml-forecast`, `ml-whatif`, `ml-edits`, `ml-hosp`, `ml-budget`, `ml-budget-extra`.

### Estrutura do código

- `TRIP` — todos os dados: dias, paradas, planos B, looks, orçamento, reservas, mala e dicas. Quase toda mudança de conteúdo é aqui.
  - `days[].stops[]` — paradas (`t` horário, `i` ícone, `n` nome, `d` descrição, `q` busca no Google Maps, `look` índice do look, `hi` destaque, `ll` coordenadas para o mapa, `img` foto da parada, `info` reserva/horário/fonte).
  - `days[].foto` — chave em `FOTOS` usada como capa real do dia (cai para a cena ilustrada em SVG se não tiver).
  - `days[].planb[]` — cenários “E se…”. `alt` troca paradas por índice (`{n, d, t, q, ll, img, info}`) ou pula (`{skip:true}`).
  - `days[].looks[]` — looks sugeridos, com o objeto `o` usado pelo manequim.
  - `budget[]` — valores reais pesquisados nos sites oficiais (marcados `estimado`, com `fonte`); `valor:null` continua existindo pros itens que dependem de escolha do casal (hotel, voo, transporte).
- `PLACES` — coordenadas geocodificadas (Nominatim/OpenStreetMap) usadas pelo mapa. `zuccardi` é aproximada (a bodega não está cadastrada no OSM); `centro` e `tunuyanUco` são genéricas — e são sobrescritas automaticamente se vocês definirem a hospedagem de verdade (ver abaixo).
- `FOTOS` — fotos reais com licença aberta (Wikimedia Commons), linkadas direto (não embutidas) — precisam de internet. Cada entrada tem `credito` e `page` (para o link obrigatório da licença CC) e, quando a foto é só ilustrativa da região, um campo `nota`.
- `CLIMAS` — momentos do provador (calor, vinhedo, noite no Uco, chuva, termas, voo) com flags usadas na avaliação.
- `mannequin(o)` — desenha o manequim em SVG. `avaliar(o, clima)` — regras que dizem se o look combina com o momento.
- `initMap()` / `buildMapLayers()` — mapa Leaflet com um grupo de marcadores por dia (cor própria) e filtro "Todos os dias" ou um dia específico.
- `loadForecast()` / `renderForecast()` — busca a previsão real no Open-Meteo (sem chave) quando a viagem está a ≤15 dias; fora desse alcance, não mostra nada e o site segue com as estimativas fixas do `CLIMAS`.
- Navegação por abas com hash (`#roteiro`, `#mapa`, `#provador`, `#mala`, `#valores`, `#reservas`) e View Transitions API com fallback.

### O que dá pra editar direto no site (sem mexer no código)

Tudo isso fica salvo por aparelho em `localStorage` — editar no celular da Manu não muda o do Luiz, e vice-versa, até que um exporte e mande pro outro (hoje não existe essa sincronia, ver "Ideias para a próxima versão").

- **Valores**: toque no número de qualquer item pra corrigir o valor pesquisado, toque no selo (`estimado`/`validado`/`marcar`) pra confirmar que já reservaram de verdade, e use o formulário no fim da lista pra adicionar um item novo (ex.: um táxi extra).
- **Hospedagem**: no topo de qualquer dia, o ícone de lápis ao lado do nome do hotel/hospedagem abre um formulário pra digitar o nome e um endereço (ou colar um link do Google Maps). O site tenta localizar automaticamente (geocodificação via Nominatim/OpenStreetMap) e atualiza o nome e o pino no mapa em todos os dias que usam essa hospedagem. Se não conseguir localizar, só o nome é salvo. **Limitação**: os tempos de carro escritos em cada parada não recalculam sozinhos — continuam sendo a estimativa original.
- **Roteiro de cada dia**: o botão "Editar roteiro" (em cima da lista de paradas) deixa reordenar (setas), remover, adicionar e editar horário/nome/descrição de qualquer parada. "Restaurar roteiro original" desfaz tudo daquele dia.
- Os planos B ("E se...") continuam funcionando como antes — e agora a escolha fica salva entre visitas.

### Identidade visual

Cor de vinho, minimalista e clássico. Tokens de cor em `:root`, com tema claro e escuro. Mobile-first: barra de abas embaixo no celular, no topo no desktop.

## Roteiro atual (rascunho, tudo a confirmar)

- **Sáb 09** — chegada cedo de voo noturno (Curitiba ou SP), centro de Mendoza, siesta, Parque San Martín, jantar. Dorme no centro.
- **Dom 10** — Valle de Uco: Zuccardi (visita e almoço), Salentein (opcional), **jantar de 1 ano** à noite no Uco. Dorme no Uco. Pesquisado: as duas abrem normalmente aos domingos (mesmo horário de todos os dias), mas exigem reserva prévia.
- **Seg 11** — manhã livre no Uco, almoço longo na Lagarde (Luján de Cuyo), volta ao centro. Domingo da Lagarde tem grade reduzida segundo fontes não oficiais (a confirmar), mas isso não afeta esse dia (é segunda).
- **Ter 12** — Catena Zapata, almoço mais curto no Espacio Trapiche, El Enemigo (Casa Vigil) no fim da tarde. **A confirmar**: fontes secundárias sugerem que a Catena pode fechar às terças e aos domingos — não confirmado no site oficial, ligar antes de fechar o roteiro (turismo@catenazapata.com / +54 261 413-1124). "El Enemigo" e "Casa Vigil" são o mesmo lugar (bodega Aleanna, Chachingo) — o roteiro já trata isso como uma parada só.
- **Qua 13** — dia livre (Termas de Cacheuta ou cidade), voo de volta à noite (ou quinta 14).

Transporte desejado: van ou motorista contratado (Argentina tem álcool zero ao volante).

Distâncias de carro foram recalculadas com rota real (OSRM/OpenStreetMap, pesquisado 09/11/2026) e estão marcadas como estimadas no texto de cada parada — várias eram superestimadas no rascunho original (ex.: Trapiche → El Enemigo caiu de ~25 min para ~15 min).

### Preços pesquisados (aba Valores)

Só 2 dos 8 lugares/almoços têm preço público nos sites oficiais — os outros usam um sistema de reserva (Meitre) que só mostra valor depois de criar conta, e isso eu não fiz:

- **Lagarde (almoço)** — Menu Fogón 4 Passos, ARS 125.000 por pessoa. Fonte: `lagarde.com.ar/fogon`, 09/11/2026.
- **Termas de Cacheuta** — entrada geral, ARS 17.000 por pessoa em dia de semana (a visita é numa quarta). Fonte: `termascacheuta.com/tarifas-parque-de-agua`, 09/11/2026.
- **Zuccardi, Salentein, Catena Zapata, Espacio Trapiche, El Enemigo (Casa Vigil)** — sem preço público. Deixei o e-mail/telefone de contato de cada um na aba Valores, pra pedirem o orçamento direto.

## Regras importantes

- **Nunca inventar preços.** Valores ficam como “a pesquisar” até o casal validar. Se pesquisar preços, marcar como `estimado`, com fonte e data.
- O mesmo vale para horários e distâncias: sempre que pesquisados (não só supostos), marcar como estimado/a confirmar e citar a fonte — como já foi feito nos dados de `TRIP`.
- **Domingo**: Zuccardi e Salentein confirmados abertos; outras bodegas variam — conferir `info` de cada parada antes de reservar.
- O casal quer tudo com muita calma: poucos compromissos por dia e almoços longos.
- Fotos de lugares: usar apenas imagens com licença de uso (Wikimedia Commons, com crédito e link para a página do arquivo) ou fotos enviadas pelo casal. Cuidado: nem toda imagem com licença aberta no Commons é foto de verdade — já apareceu imagem gerada por IA disfarçada de foto (com metadados C2PA), então vale checar os metadados antes de usar algo que pareça bom demais.

## Ideias para a próxima versão

- ~~Fotos reais dos lugares nas capas dos dias e nas paradas.~~ Feito (linkadas do Wikimedia Commons, com crédito).
- ~~Mapa interativo com as paradas de cada dia.~~ Feito (Leaflet + OpenStreetMap, aba "Mapa", filtro por dia).
- ~~Previsão do tempo real perto da viagem (Open-Meteo, sem chave de API).~~ Feito — só aparece quando a viagem está a ≤15 dias (fora disso, segue com as estimativas fixas do `CLIMAS`).
- ~~Funcionar offline (PWA com service worker).~~ Feito — o roteiro abre sem sinal; mapa, fotos e previsão continuam precisando de internet.
- ~~Imagem de prévia para o WhatsApp (`og:image`).~~ Feito (foto do Wikimedia Commons; pode trocar por uma foto própria do casal depois da viagem).
- ~~Editar o roteiro direto no site (trocar parada, reordenar, mudar horário/nome).~~ Feito — botão "Editar roteiro" em cada dia.
- ~~Orçamento com preços reais, editável.~~ Feito — aba Valores com preços pesquisados nos sites oficiais, editáveis, mais um item customizado.
- ~~Hospedagem personalizada (nome/link atualiza o roteiro).~~ Feito — ícone de lápis ao lado do hotel/hospedagem em cada dia, com geocodificação automática.
- Recalcular os tempos de carro automaticamente quando a hospedagem muda (hoje só o nome e o pino no mapa atualizam; o texto de cada parada continua com a estimativa original — daria pra buscar a rota real via OSRM a cada mudança de hospedagem).
- Rotas desenhadas sobre as estradas reais no mapa (hoje é só uma linha reta entre as paradas do dia).
- Estado compartilhado entre os dois celulares (hoje o `localStorage` é por aparelho): Vercel KV, Supabase ou similar.
- Separar em arquivos (`styles.css`, `app.js`, `data.js`) se o `index.html` ficar grande demais para editar com conforto.

## Deploy

Site estático: basta publicar a pasta no Vercel (`npx vercel` na pasta, ou importar um repositório do GitHub em vercel.com).
