# JC Veículos — direção visual

Landing page de loja de carros 0 km e seminovos em Paty do Alferes — RJ. Nome, localização e Instagram fornecidos pelo usuário; telefone conferido na bio pública. Hospedagem e atualizações autorizadas no GitHub Pages.

## Apresentação

Preto e branco com um acento verde derivado da logo original. Hero em Barlow Condensed e DM Sans; demais seções em Syne e Space Grotesk com fallback local. A C180 Coupé domina o hero como fotografia conceitual de estúdio, sem moldura; os PNGs transparentes permanecem na coleção. Tokens em style.css; refinamento em polish.css e hero.css. Ink #101010, paper #f7f7f5, white #ffffff, muted #777777, rule #dededb. Gradiente metálico nos botões das seções seguintes.

## Comportamento

O hero Estúdio abre com foto em foco progressivo, luz cruzando a cena e título revelado em duas linhas; ao rolar, o texto sai e a fotografia ganha profundidade. Os títulos das seções seguintes entram conforme a rolagem. No desktop, a coleção fica fixa enquanto a rolagem conduz os cinco carros na horizontal. Setas, teclado e deslize oferecem caminhos alternativos. No celular, a vitrine vira um carrossel. Animações pausáveis e preferência por movimento reduzido respeitada. Um botão por carro, abaixo da imagem. Na seção de contato, apenas a chamada principal Conversar no Instagram. Diálogo nativo com Escape e retorno de foco; filtros de sedãs, cupês e picapes; mensagem copiada localmente sem envio automático.

## Conteúdo e verificação

Civic, C180 Coupé, Corolla, Saveiro e Hilux como referências ilustrativas, sem afirmar estoque atual ou preço. Créditos no rodapé. Civic com 24 vistas, Corolla e Hilux com 31: canvas recorta a sequência oficial, com arraste, setas e teclado. C180 Coupé e Saveiro exibem imagem estática.

JavaScript conferido com node --check. Imagens, filtros e giros conferidos no navegador; arraste e controle por teclado funcionais, viewport de 390px sem excesso de largura. Fontes e edição do C180 documentadas em IMAGENS.md.

O hero ocupa a primeira tela e traz uma ação principal para a coleção; o contato com a JC fica no rodapé do hero. A vitrine horizontal escura traduz a dinâmica de rolagem do vídeo de referência. C180 da coleção usa a imagem de catálogo C180 Coupé 2017 indicada pelo usuário, classificada como cupê e com origem creditada.

Hero Estúdio escolhido em 2026-10-05: logo original `assets/jc-logo.jpg` no cabeçalho; título “O carro muda tudo” em Barlow Condensed; fotografia conceitual da C180 gerada por IA a partir da referência já usada no projeto. Arquivo otimizado em `assets/hero-c180-studio.jpg`, identificado no hero como imagem conceitual e veículo ilustrativo. A entrada e a transição de rolagem são pausáveis, com movimento reduzido respeitado. O CTA abre a coleção e o link do rodapé abre o Instagram.
