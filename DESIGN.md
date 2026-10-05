# JC Veículos — direção visual

Landing page de loja de carros 0 km e seminovos em Paty do Alferes — RJ. Nome, localização e Instagram fornecidos pelo usuário; telefone conferido na bio pública. Hospedagem e atualizações autorizadas no GitHub Pages.

## Apresentação

Preto e branco com um acento verde derivado da logo original. Hero em Barlow Condensed e DM Sans; demais seções em Syne e Space Grotesk com fallback local. PNGs transparentes sobre superfícies neutras de showroom. C180 Coupé no hero, sem moldura. Tokens em style.css; refinamento em polish.css e hero.css. Ink #101010, paper #f7f7f5, white #ffffff, muted #777777, rule #dededb, verde do hero #3aaa45. Gradiente metálico nos botões das seções seguintes.

## Comportamento

O hero abre em etapas com cortina, feixe de luz, título e entrada do carro; ao rolar, texto e carro saem de cena enquanto o cenário ganha profundidade. Os títulos das seções seguintes entram conforme a rolagem, seguindo a nova preferência do usuário por movimento mais intenso. No desktop, a coleção fica fixa enquanto a rolagem conduz os cinco carros na horizontal. Setas, teclado e deslize oferecem caminhos alternativos. No celular, a vitrine vira um carrossel. Animações pausáveis e preferência por movimento reduzido respeitada. Um botão por carro, abaixo da imagem. Na seção de contato, apenas a chamada principal Conversar no Instagram. Diálogo nativo com Escape e retorno de foco; filtros de sedãs, cupês e picapes; mensagem copiada localmente sem envio automático.

## Conteúdo e verificação

Civic, C180 Coupé, Corolla, Saveiro e Hilux como referências ilustrativas, sem afirmar estoque atual ou preço. Créditos no rodapé. Civic com 24 vistas, Corolla e Hilux com 31: canvas recorta a sequência oficial, com arraste, setas e teclado. C180 Coupé e Saveiro exibem imagem estática.

JavaScript conferido com node --check. Imagens, filtros e giros conferidos no navegador; arraste e controle por teclado funcionais, viewport de 390px sem excesso de largura. Fontes e edição do C180 documentadas em IMAGENS.md.

Atualização visual: hero ocupa a primeira tela e traz uma ação para a coleção e outra para o Instagram. A vitrine horizontal escura traduz a dinâmica de rolagem do vídeo de referência. C180 substituída pela imagem de catálogo C180 Coupé 2017 indicada pelo usuário, classificada como cupê e com origem creditada.

Hero aprovado em 2026-10-05: logo original `assets/jc-logo.jpg` restaurada no cabeçalho; título “O próximo carro tem endereço” em Barlow Condensed; verde da marca apenas como acento. A C180 Coupé ilustrativa aparece sobre o showroom ao pôr do sol escolhido pelo usuário, gerado por IA e identificado no próprio hero como cenário ilustrativo. Arquivo otimizado em `assets/hero-showroom-sunset.jpg`. A sequência de abertura e a transição de rolagem são pausáveis, com movimento reduzido respeitado. CTA de coleção e ação de Instagram têm propósitos distintos.
